import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  Check,
  Home,
  Map,
  Menu,
  MessageCircle,
  PawPrint,
  Phone,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import clsx from "clsx";
import { SCHOOLS, schoolById } from "../data/schools";
import { BrandLockup } from "./BrandLockup";
import s from "./Shell.module.css";

/* ------------------------------------------------------------------ */
/* Shell context: lets any page open the enquiry sheet or menu         */
/* ------------------------------------------------------------------ */

interface ShellApi {
  openEnquiry: (campusId?: string) => void;
  openMenu: () => void;
}

const ShellContext = createContext<ShellApi>({
  openEnquiry: () => {},
  openMenu: () => {},
});

export const useShell = () => useContext(ShellContext);

const NAV = [
  { to: "/", label: "Home", icon: Home },
  { to: "/#schools", label: "Schools", icon: Map },
  { to: "/campus/nairobi", label: "Nairobi", icon: PawPrint },
  { to: "/admissions/prospectus", label: "Prospectus", icon: Sparkles },
];

const EASE = [0.22, 1, 0.36, 1] as const;

function useIsActive() {
  const { pathname, hash } = useLocation();
  return (to: string) => {
    if (to === "/") return pathname === "/" && hash !== "#schools";
    if (to === "/#schools") return pathname === "/" && hash === "#schools";
    return pathname.startsWith(to);
  };
}

function NavItem({
  to,
  className,
  activeClassName,
  onClick,
  children,
  label,
}: {
  to: string;
  className: string;
  activeClassName: string;
  onClick?: () => void;
  children: ReactNode;
  label: string;
}) {
  const active = useIsActive()(to);
  const { pathname } = useLocation();
  return (
    <Link
      to={to}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      className={clsx(className, active && activeClassName)}
      onClick={() => {
        onClick?.();
        if (to === "/#schools" && pathname === "/") {
          document.getElementById("schools")?.scrollIntoView({ behavior: "smooth" });
        }
      }}
    >
      {children}
    </Link>
  );
}

/* Scroll to top on route change, or to a hash target when present. */
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useLayoutEffect(() => {
    if (hash) {
      const id = hash.slice(1);
      const t = setTimeout(
        () => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }),
        140,
      );
      return () => clearTimeout(t);
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

/* ------------------------------------------------------------------ */
/* Full-screen curtain menu                                            */
/* ------------------------------------------------------------------ */

const MENU_LINKS = [
  { n: "01", label: "Our schools", to: "/#schools", sub: "11 schools · 3 countries" },
  { n: "02", label: "Nairobi campus", to: "/campus/nairobi", sub: "Pilot campus site" },
  { n: "03", label: "Personal prospectus", to: "/admissions/prospectus", sub: "Built around your child" },
  { n: "04", label: "The Group", to: "/#group", sub: "Governance · history · values" },
  { n: "05", label: "The Braeburn Circle", to: "/#circle", sub: "Alumni network" },
];

function Curtain({ onClose, onEnquire }: { onClose: () => void; onEnquire: () => void }) {
  return (
    <motion.div
      className={s.curtain}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      initial={{ clipPath: "inset(0 0 100% 0)" }}
      animate={{ clipPath: "inset(0 0 0% 0)" }}
      exit={{ clipPath: "inset(0 0 100% 0)" }}
      transition={{ duration: 0.65, ease: EASE }}
    >
      <div className={s.curtainHead}>
        <BrandLockup className={s.curtainLogo} compact onClick={onClose} />
        <button className={s.curtainClose} onClick={onClose} aria-label="Close menu">
          <X />
        </button>
      </div>

      <div className={s.curtainBody}>
        <nav aria-label="Menu">
          <ol>
            {MENU_LINKS.map((l, i) => (
              <motion.li
                key={l.to}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.06, duration: 0.6, ease: EASE }}
              >
                <Link to={l.to} className={s.bigLink} onClick={onClose}>
                  <small>{l.n}</small>
                  {l.label}
                  <span className={s.bigLinkSub}>{l.sub}</span>
                </Link>
              </motion.li>
            ))}
          </ol>
        </nav>

        <motion.aside
          className={s.curtainAside}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6, ease: EASE }}
        >
          <p className="eyebrow light">Take the next step</p>
          <div className={s.ctaTrio}>
            <button className="btn btn-accent" onClick={onEnquire}>
              Enquire <MessageCircle />
            </button>
            <button className="btn btn-light" onClick={onEnquire}>
              Book a visit
            </button>
            <Link to="/admissions/prospectus" className="btn btn-ghost on-dark" onClick={onClose}>
              Apply
            </Link>
          </div>

          <p className="eyebrow light">For current families</p>
          <ul className={s.curtainList}>
            {["Parent Portal (single sign-on)", "School fees", "Lunch menus", "Fixtures & calendar"].map((t) => (
              <li key={t}>
                <a href="https://braeburn.com" target="_blank" rel="noreferrer" onClick={onClose}>
                  {t} <ArrowUpRight size={14} />
                </a>
              </li>
            ))}
          </ul>

          <div className={s.curtainMeta}>
            <span>🇰🇪 Kenya</span>
            <span>🇹🇿 Tanzania</span>
            <span>🇷🇼 Rwanda</span>
            <span>EN · SW · RW · FR</span>
            <span>WCAG 2.2 AA</span>
          </div>
        </motion.aside>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Enquiry sheet — named contact, WhatsApp, tour slots                 */
/* ------------------------------------------------------------------ */

const SLOTS = ["Tue 10:00", "Thu 14:30", "Sat 09:30"];

function EnquirySheet({ campusId, onClose }: { campusId?: string; onClose: () => void }) {
  const [campus, setCampus] = useState(campusId ?? "nairobi");
  const [name, setName] = useState("");
  const [slot, setSlot] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const school = schoolById(campus) ?? SCHOOLS[0];
  const initials = school.contact.name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <>
      <motion.div
        className={s.sheetBackdrop}
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
      <motion.div
        className={s.sheet}
        role="dialog"
        aria-modal="true"
        aria-labelledby="enq-title"
        initial={{ y: 48, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 48, opacity: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        <div className={s.sheetHead}>
          <div>
            <p className="eyebrow">Enquire · visit · apply</p>
            <h2 id="enq-title" className="display display-md">
              Talk to a person, <em>not a form.</em>
            </h2>
          </div>
          <button className={s.closeBtn} onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {sent ? (
          <div className={s.success}>
            <span className={s.successIcon}>
              <Check size={30} />
            </span>
            <h3 className="display display-sm">Asante, {name.split(" ")[0] || "there"}.</h3>
            <p className="muted">
              {school.contact.name} will reply within one working day
              {slot ? ` and has provisionally held your ${slot} tour slot at ${school.short}` : ""}. We have also
              sent a copy to your inbox.
            </p>
            <button className="btn btn-primary" onClick={onClose}>
              Done
            </button>
          </div>
        ) : (
          <div className={s.sheetGrid}>
            <div className={s.contactCard}>
              <div className={s.contactRow}>
                <span className="avatar" aria-hidden="true">
                  {initials}
                </span>
                <div>
                  <strong>{school.contact.name}</strong>
                  <br />
                  <span style={{ color: "var(--muted-light)", fontSize: ".85rem" }}>
                    {school.contact.role} · {school.short}
                  </span>
                </div>
              </div>
              <p style={{ fontSize: ".9rem", color: "var(--muted-light)" }}>
                "Ask me anything — from class sizes to the school bus. I answer WhatsApp between 8am and 6pm."
              </p>
              <div className={s.contactBtns}>
                <a
                  className="btn btn-sm btn-accent"
                  href={`https://wa.me/${school.contact.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle /> WhatsApp
                </a>
                <a className="btn btn-sm btn-ghost on-dark" href={`tel:+${school.contact.whatsapp}`}>
                  <Phone /> Call
                </a>
              </div>
              <div>
                <p className="eyebrow light plain" style={{ marginBottom: 8 }}>
                  Hold a 20-minute tour slot
                </p>
                <div className={s.slots}>
                  {SLOTS.map((sl) => (
                    <button
                      key={sl}
                      type="button"
                      className="chip"
                      style={{ color: "var(--cream)", borderColor: "rgba(250,246,238,.35)" }}
                      aria-pressed={slot === sl}
                      onClick={() => setSlot(slot === sl ? null : sl)}
                    >
                      {sl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <form className={s.form} onSubmit={submit}>
              <div className={s.formRow}>
                <label className="field">
                  <span>Your name</span>
                  <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Amina Hassan" />
                </label>
                <label className="field">
                  <span>Email or phone</span>
                  <input required placeholder="you@example.com" />
                </label>
              </div>
              <div className={s.formRow}>
                <label className="field">
                  <span>Campus</span>
                  <select value={campus} onChange={(e) => setCampus(e.target.value)}>
                    {SCHOOLS.map((sc) => (
                      <option key={sc.id} value={sc.id}>
                        {sc.short} · {sc.country}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="field">
                  <span>Child's age</span>
                  <select defaultValue="7">
                    {Array.from({ length: 17 }, (_, i) => i + 2).map((a) => (
                      <option key={a} value={a}>
                        {a} years
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="field">
                <span>What would help most?</span>
                <textarea placeholder="e.g. We move to Nairobi in August and are weighing day vs weekly boarding…" />
              </label>
              <button className="btn btn-primary" type="submit">
                Send enquiry <Send />
              </button>
              <p className="muted" style={{ fontSize: ".75rem" }}>
                Your details go straight to {school.short}'s admissions team in Zoho CRM. We never share them. Consent
                and privacy details at braeburn.com/privacy.
              </p>
            </form>
          </div>
        )}
      </motion.div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Shell                                                               */
/* ------------------------------------------------------------------ */

export function Shell() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [menu, setMenu] = useState(false);
  const [enquiry, setEnquiry] = useState<{ campusId?: string } | null>(null);

  useEffect(() => {
    setMenu(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const open = menu || enquiry !== null;
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menu, enquiry]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(false);
        setEnquiry(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const api: ShellApi = {
    openEnquiry: (campusId) => {
      setMenu(false);
      setEnquiry({ campusId });
    },
    openMenu: () => setMenu(true),
  };

  return (
    <ShellContext.Provider value={api}>
      <ScrollManager />
      <div className={s.app}>
        <a href="#main" className="skip-link">
          Skip to content
        </a>

        {/* Desktop side rail. On home this opens into the fixed brand spine. */}
        <aside className={clsx(s.rail, isHome && s.railHome, "no-print")} aria-label="Primary">
          <Link to="/" className={s.railLogo} aria-label="Braeburn Group of International Schools home">
            <img src="brand/logo-mark.png" alt="" width={44} height={44} />
            <span className={s.railBrandCopy}>
              <strong>Braeburn</strong>
              <small>Group of International Schools</small>
              <i>Since 1979</i>
            </span>
          </Link>
          <nav className={s.railNav} aria-label="Primary">
            {NAV.map(({ to, label, icon: Icon }) => (
              <NavItem key={to} to={to} label={label} className={s.railLink} activeClassName={s.railLinkActive}>
                <Icon size={21} strokeWidth={1.8} />
                <span className={s.railLabel} aria-hidden="true">
                  {label}
                </span>
              </NavItem>
            ))}
          </nav>
          <div className={s.railBottom}>
            <button className={s.railCta} onClick={() => api.openEnquiry()}>
              Enquire
            </button>
            <button
              className={s.railMenu}
              onClick={() => setMenu(true)}
              aria-expanded={menu}
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </aside>

        {/* Mobile floating top bar */}
        <header className={clsx(s.topbar, "no-print")}>
          <BrandLockup className={clsx(s.topLogo, "glass-dark")} compact />
          <button
            className={clsx(s.topMenu, "glass-dark")}
            onClick={() => setMenu(true)}
            aria-expanded={menu}
            aria-label="Open menu"
          >
            <Menu size={18} /> Menu
          </button>
        </header>

        <main id="main" className={s.main}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE }}
          >
            <Outlet />
          </motion.div>
        </main>

        {/* Mobile bottom dock */}
        <nav className={clsx(s.dock, "no-print")} aria-label="Primary">
          {NAV.slice(0, 2).map(({ to, label, icon: Icon }) => (
            <NavItem key={to} to={to} label={label} className={s.dockItem} activeClassName={s.dockItemActive}>
              <Icon size={22} strokeWidth={1.8} />
              <span>{label}</span>
            </NavItem>
          ))}
          <button className={s.dockCtaWrap} onClick={() => api.openEnquiry()}>
            <span className={s.dockCta}>
              <MessageCircle size={22} />
            </span>
            <span>Enquire</span>
          </button>
          {NAV.slice(2).map(({ to, label, icon: Icon }) => (
            <NavItem key={to} to={to} label={label} className={s.dockItem} activeClassName={s.dockItemActive}>
              <Icon size={22} strokeWidth={1.8} />
              <span>{label}</span>
            </NavItem>
          ))}
        </nav>

        <AnimatePresence>
          {menu && <Curtain key="curtain" onClose={() => setMenu(false)} onEnquire={() => api.openEnquiry()} />}
        </AnimatePresence>
        <AnimatePresence>
          {enquiry && <EnquirySheet key="sheet" campusId={enquiry.campusId} onClose={() => setEnquiry(null)} />}
        </AnimatePresence>
      </div>
    </ShellContext.Provider>
  );
}

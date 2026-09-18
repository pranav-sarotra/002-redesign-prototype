import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, animate, motion, useInView, useReducedMotion } from "framer-motion";
import { Accessibility, ArrowUpRight, Zap } from "lucide-react";
import clsx from "clsx";
import { COUNTRIES, SCHOOLS } from "../data/schools";
import { useTypewriter } from "../hooks";
import { EastAfricaMap } from "./EastAfricaMap";
import { useShell } from "./Shell";
import s from "./Bits.module.css";

export const EASE = [0.22, 1, 0.36, 1] as const;

/* ---------- multilingual typewriter greeting ---------- */

const GREETINGS = [
  { text: "Welcome to Braeburn", lang: "English", note: "spoken on every campus" },
  { text: "Karibu Braeburn", lang: "Kiswahili", note: "Kenya & Tanzania" },
  { text: "Murakaza neza kuri Braeburn", lang: "Kinyarwanda", note: "Rwanda" },
  { text: "Bienvenue à Braeburn", lang: "Français", note: "Kigali & beyond" },
];
const PHRASES = GREETINGS.map((g) => g.text);

export function Greeting() {
  const reduced = useReducedMotion();
  const { text, index, complete } = useTypewriter(PHRASES, { reduced: !!reduced });
  const g = GREETINGS[index];
  return (
    <div className={s.greeting}>
      <h1 className={clsx("display display-xl", s.greetingTitle)} aria-label="Welcome to Braeburn">
        <span aria-hidden="true">
          {text}
          <span className={clsx(s.caret, complete && s.caretBlink)} />
        </span>
      </h1>
      <div className={s.langRow} aria-hidden="true">
        <AnimatePresence mode="wait">
          <motion.span
            key={index}
            className={s.lang}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
          >
            <i>{g.lang}</i> · {g.note}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ---------- proof-point ticker ---------- */

const TICKER = [
  "11 schools",
  "3 countries",
  "5,000 pupils",
  "60+ nationalities",
  "Est. 1979",
  "EYFS → IGCSE → A Level · BTEC · IB",
  "Day & boarding",
  "WCAG 2.2 AA",
];

export function Ticker() {
  return (
    <div className={s.ticker} aria-hidden="true">
      <div className={s.track}>
        {[...TICKER, ...TICKER].map((t, i) => (
          <span key={i} className={s.tickerItem}>
            {t}
            <i className={s.dot} />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ---------- animated counter ---------- */

export function Counter({
  to,
  prefix = "",
  suffix = "",
  className,
}: {
  to: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduced = useReducedMotion();
  const [val, setVal] = useState(reduced ? to : 0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setVal(to);
      return;
    }
    const controls = animate(0, to, {
      duration: 1.7,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setVal(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to, reduced]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {val.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ---------- scroll reveal wrapper ---------- */

export function Reveal({
  children,
  className,
  delay = 0,
  y = 28,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.85, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/* ---------- footer ---------- */

const ALL_IDS = new Set(SCHOOLS.map((sc) => sc.id));

export function Footer() {
  const { openEnquiry } = useShell();
  return (
    <footer className={clsx(s.footer, "on-dark")} id="portal">
      <div className="container">
        <div className={s.footerTop}>
          <div className={s.footerBrand}>
            <Link to="/" className={s.footerLogo}>
              <img src="brand/logo-mark.png" alt="" width={48} height={48} />
              <span>
                <strong>Braeburn</strong>
                <small>Group of International Schools</small>
              </span>
            </Link>
            <p className={s.footerMotto}>
              Confident individuals, responsible citizens, learners enjoying success — since 1979.
            </p>
            <div className={s.footerCtas}>
              <button className="btn btn-sm btn-accent" onClick={() => openEnquiry()}>
                Enquire
              </button>
              <button className="btn btn-sm btn-light" onClick={() => openEnquiry()}>
                Book a visit
              </button>
              <Link className="btn btn-sm btn-ghost on-dark" to="/admissions/prospectus">
                Build a prospectus
              </Link>
            </div>
          </div>
          <div className={s.footerMap}>
            <EastAfricaMap
              schools={SCHOOLS}
              visibleIds={ALL_IDS}
              selectedId={null}
              onSelect={() => {}}
              activeCountry="all"
              mini
            />
            <span className={s.footerMapCap}>11 schools · Kenya, Tanzania & Rwanda</span>
          </div>
        </div>

        <div className={s.footerCols}>
          {COUNTRIES.map((c) => (
            <div key={c.code}>
              <h4>
                {c.flag} {c.name}
              </h4>
              <ul>
                {SCHOOLS.filter((sc) => sc.code === c.code).map((sc) => (
                  <li key={sc.id}>
                    {sc.route ? (
                      <Link to={sc.route}>{sc.name}</Link>
                    ) : (
                      <Link to={`/admissions/prospectus?campus=${sc.id}`}>{sc.name}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h4>For families</h4>
            <ul>
              <li>
                <button onClick={() => openEnquiry()}>Enquire or book a visit</button>
              </li>
              <li>
                <Link to="/admissions/prospectus">Personal prospectus</Link>
              </li>
              <li>
                <a href="https://braeburn.com" target="_blank" rel="noreferrer">Fee calculator</a>
              </li>
              <li>
                <a href="https://braeburn.com" target="_blank" rel="noreferrer">
                  Parent Portal <ArrowUpRight size={12} />
                </a>
              </li>
              <li>
                <a href="https://braeburn.com" target="_blank" rel="noreferrer">Lunch menus & fixtures</a>
              </li>
            </ul>
            <h4 style={{ marginTop: 22 }}>The Group</h4>
            <ul>
              <li>
                <Link to="/#group">Governance & history</Link>
              </li>
              <li>
                <Link to="/#circle">The Braeburn Circle (alumni)</Link>
              </li>
              <li>
                <a href="https://braeburn.com" target="_blank" rel="noreferrer">Careers</a>
              </li>
              <li>
                <a href="https://braeburn.com" target="_blank" rel="noreferrer">Safeguarding & whistleblowing</a>
              </li>
            </ul>
          </div>
        </div>

        <div className={s.footerBottom}>
          <span>© 2026 Braeburn Group of International Schools</span>
          <span className={s.badges}>
            <span className="tag tag-dark">
              <Accessibility size={12} /> WCAG 2.2 AA
            </span>
            <span className="tag tag-dark">
              <Zap size={12} /> Built light for real connectivity
            </span>
          </span>
          <span>Privacy · Terms · Cookie preferences</span>
        </div>
      </div>
    </footer>
  );
}

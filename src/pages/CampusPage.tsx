import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  Baby,
  Backpack,
  ChevronDown,
  Clock,
  GraduationCap,
  MessageCircle,
  Play,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import clsx from "clsx";
import { schoolById, type StageId } from "../data/schools";
import { useMediaQuery } from "../hooks";
import { Counter, EASE, Footer, Reveal } from "../components/Bits";
import { useShell } from "../components/Shell";
import s from "./CampusPage.module.css";

interface Pathway {
  id: string;
  stage: StageId;
  name: string;
  tag: string;
  icon: LucideIcon;
  blurb: string;
  facts: [string, string][];
  lead: { name: string; role: string; ask: string };
  image: string;
}

const PATHWAYS: Pathway[] = [
  {
    id: "early",
    stage: "early",
    name: "Acacia Early Years",
    tag: "Ages 2–5 · Playgroup to Reception",
    icon: Baby,
    blurb:
      "Our named Early Years world has its own gate, its own garden and its own rhythm: play-led, EYFS-based and full of mud, music and story.",
    facts: [
      ["Class size", "Up to 16, two adults"],
      ["The day", "08:00–13:00, wraparound to 16:00"],
      ["Signature", "Forest-school Fridays"],
    ],
    lead: { name: "Wanjiku Otieno", role: "Head of Acacia Early Years", ask: "settling in, phonics and why we garden every day" },
    image: "images/early-years.jpg",
  },
  {
    id: "primary",
    stage: "primary",
    name: "Primary",
    tag: "Ages 5–11 · Year 1 to Year 6",
    icon: Backpack,
    blurb:
      "The English National Curriculum with an East African heartbeat: Kiswahili from Year 1, specialist music, daily swimming in Term 1 and a pupil-run garden.",
    facts: [
      ["Class size", "Average 18"],
      ["Languages", "Kiswahili · French"],
      ["Signature", "Year 5 Naivasha residential"],
    ],
    lead: { name: "Daniel Otieno", role: "Head of Primary", ask: "reading, the Year 6 transition and the tortoise" },
    image: "images/nairobi-hero.jpg",
  },
  {
    id: "secondary",
    stage: "secondary",
    name: "Secondary & Sixth Form",
    tag: "Ages 11–18 · IGCSE, A Level & BTEC",
    icon: GraduationCap,
    blurb:
      "A two-year IGCSE programme, then A Levels or BTEC in a Sixth Form small enough that every university application has a named mentor behind it.",
    facts: [
      ["Pathways", "IGCSE → A Level / BTEC"],
      ["Leavers 2025", "UK · Canada · SA · Kenya"],
      ["Signature", "Model UN & Enterprise Week"],
    ],
    lead: { name: "Priya Shah", role: "Head of Sixth Form", ask: "subject choices, destinations and BTEC routes" },
    image: "images/hero.jpg",
  },
];

const DAY = [
  {
    time: "07:20",
    title: "Gates open under the jacarandas",
    who: "Mr Kimani · first smile of the day",
    text: "Amara walks in with her brother; the tortoise gets checked before registration.",
  },
  {
    time: "08:00",
    title: "Registration with Mr Otieno",
    who: "Daniel Otieno · Year 6 teacher",
    text: "'Two truths and a lie' about last night's reading. Nobody guesses the lie.",
  },
  {
    time: "10:30",
    title: "Science in the garden",
    who: "Ms Achieng · Science lead",
    text: "Measuring how far the sukuma wiki has grown since Monday. The data goes on the wall chart.",
  },
  {
    time: "12:40",
    title: "Lunch, then the football league",
    who: "Coach Baraka",
    text: "Year 6 vs Year 5. Year 5 win. Nobody talks about it.",
  },
  {
    time: "14:15",
    title: "Kiswahili drama",
    who: "Mwalimu Njeri",
    text: "A market scene, wildly over-acted, in Kiswahili. Rehearsal for the Term 2 assembly.",
  },
  {
    time: "15:30",
    title: "Clubs: coding or choir",
    who: "Mr Patel & Ms Wairimu",
    text: "Amara picks coding. Her brother picks choir. Pick-up at 16:30 by the giraffe signpost.",
  },
];

const NEXT = [
  { from: "Acacia Early Years", to: "Primary", note: "Same campus, same gate — Reception to Year 1 with a shared garden." },
  { from: "Primary", to: "Secondary", note: "Year 6 taster weeks from May; every child meets their form tutor before July." },
  { from: "Year 11", to: "Sixth Form", note: "A Level or BTEC here, or the IB Diploma at Garden Estate, twenty minutes away." },
  { from: "Want boarding?", to: "Hillcrest, Karen", note: "Our flagship boarding campus across the city, with a guided switch at any stage." },
];

const initials = (name: string) =>
  name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2);

function Panel({ p, onVisit, whatsapp }: { p: Pathway; onVisit: () => void; whatsapp: string }) {
  return (
    <motion.div
      id={`panel-${p.id}`}
      className={s.panel}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.55, ease: EASE }}
    >
      <div className={s.panelInner}>
        <div className={s.panelMedia}>
          <img src={p.image} alt="" loading="lazy" decoding="async" />
        </div>
        <div className={s.panelBody}>
          <p className="eyebrow">{p.tag}</p>
          <h3 className="display display-md">{p.name}</h3>
          <p className={s.panelText}>{p.blurb}</p>
          <dl className={s.panelFacts}>
            {p.facts.map(([k, v]) => (
              <div key={k}>
                <dt>{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <div className={s.lead}>
            <span className="avatar" aria-hidden="true">
              {initials(p.lead.name)}
            </span>
            <div>
              <strong>{p.lead.name}</strong>
              <span>{p.lead.role}</span>
              <em>Ask me about {p.lead.ask}.</em>
            </div>
            <a className="btn btn-sm btn-ghost" href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer">
              <MessageCircle /> WhatsApp
            </a>
          </div>
          <div className={s.panelCtas}>
            <button className="btn btn-primary" onClick={onVisit}>
              Book a {p.id === "early" ? "Early Years" : p.name} visit
            </button>
            <Link to={`/admissions/prospectus?campus=nairobi&stage=${p.stage}`} className="btn btn-ghost">
              Prospectus for this stage <ArrowRight />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function CampusPage() {
  const school = schoolById("nairobi")!;
  const { openEnquiry } = useShell();
  const [active, setActive] = useState<string | null>(null);
  const [showBar, setShowBar] = useState(false);
  const [film, setFilm] = useState(false);
  const desktop = useMediaQuery("(min-width: 900px)");

  useEffect(() => {
    if (!film) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setFilm(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [film]);

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "26%"]);
  const copyY = useTransform(scrollYProgress, [0, 1], ["0%", "38%"]);
  const copyO = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  useMotionValueEvent(scrollYProgress, "change", (v) => setShowBar(v >= 0.95));

  const bandRef = useRef<HTMLElement>(null);
  const { scrollYProgress: bandP } = useScroll({ target: bandRef, offset: ["start end", "end start"] });
  const bandX = useTransform(bandP, [0, 1], ["-7%", "7%"]);

  const activePath = PATHWAYS.find((p) => p.id === active) ?? null;
  const visit = () => openEnquiry("nairobi");

  return (
    <>
      {/* ---------------- Hero ---------------- */}
      <section ref={heroRef} className={s.hero} aria-labelledby="campus-title">
        <motion.div className={s.heroMedia} style={{ y: imgY }}>
          <img src="images/nairobi-hero.jpg" alt="" fetchPriority="high" />
        </motion.div>
        <div className={s.heroShade} aria-hidden="true" />
        <div className={s.heroQuietField} aria-hidden="true" />
        <motion.div className={clsx("container", s.heroInner)} style={{ y: copyY, opacity: copyO }}>
          <p className={s.crumb}>
            <Link to="/">Braeburn Group</Link>
            <span>/</span>
            <Link to="/#schools">Schools</Link>
            <span>/</span>
            <span>Nairobi</span>
          </p>
          <div className={s.heroGrid}>
            <div className={s.heroCopy}>
              <p className="eyebrow light">Braeburn School · Lavington, Nairobi · est. 1979</p>
              <h1 id="campus-title" className="display display-xl">
                Where curiosity <em>runs wild.</em>
              </h1>
              <p className={s.heroLede}>
                Our founding campus on Gitanga Road is a garden school: jacarandas over the playground, a Sixth Form
                that knows every name, and wildlife line-art that marks the way from Nursery to Year 13.
              </p>
              <div className={s.heroCtas}>
                <button className="btn btn-light btn-lg" onClick={visit}>
                  Book a visit
                </button>
                <Link to="/admissions/prospectus?campus=nairobi" className="btn btn-accent btn-lg">
                  Build my prospectus <Sparkles />
                </Link>
                <button className="btn btn-ghost on-dark btn-lg" onClick={visit}>
                  Apply
                </button>
              </div>
            </div>
            <div className={s.heroAside}>
              <div className={clsx(s.floatCard, "glass-dark")}>
                <span className={s.floatNum}>18</span>
                <span>average Primary class size</span>
              </div>
              <button className={clsx(s.floatCard, s.floatCardAlt)} onClick={() => setFilm(true)}>
                <span className={s.playDot}>
                  <Play size={14} />
                </span>
                <span>Watch the 30-second campus film</span>
              </button>
            </div>
          </div>
        </motion.div>
        <a href="#wizard" className={s.heroScroll} onClick={(e) => { e.preventDefault(); document.getElementById("wizard")?.scrollIntoView({ behavior: "smooth" }); }}>
          <ChevronDown size={16} /> What are you looking for?
        </a>
      </section>

      {/* ---------------- Wizard ---------------- */}
      <section id="wizard" className={clsx("section", s.wizard)} aria-labelledby="wizard-title">
        <div className="container">
          <Reveal className={s.wizardHead}>
            <p className="eyebrow">Start where your child is</p>
            <h2 id="wizard-title" className="display display-lg">
              What are you <em>looking for?</em>
            </h2>
            <p className="lede">
              Three doors instead of a mega-menu. Pick a stage and we'll show you the people, the day and the next step
              — and nothing else.
            </p>
          </Reveal>

          <div className={s.doors}>
            {PATHWAYS.map((p, i) => {
              const Icon = p.icon;
              const open = active === p.id;
              return (
                <div key={p.id} className={s.doorWrap}>
                  <button
                    className={clsx(s.door, open && s.doorActive)}
                    onClick={() => setActive(open ? null : p.id)}
                    aria-expanded={open}
                    aria-controls={`panel-${p.id}`}
                  >
                    <span className={s.doorIcon}>
                      <Icon size={26} strokeWidth={1.6} />
                    </span>
                    <span className={s.doorNum}>0{i + 1}</span>
                    <span className={s.doorName}>{p.name}</span>
                    <span className={s.doorTag}>{p.tag}</span>
                    <span className={s.doorArrow}>
                      <ChevronDown size={18} />
                    </span>
                  </button>
                  {!desktop && (
                    <AnimatePresence initial={false}>
                      {open && <Panel key={p.id} p={p} onVisit={visit} whatsapp={school.contact.whatsapp} />}
                    </AnimatePresence>
                  )}
                </div>
              );
            })}
          </div>

          {desktop && (
            <AnimatePresence mode="wait" initial={false}>
              {activePath && (
                <Panel key={activePath.id} p={activePath} onVisit={visit} whatsapp={school.contact.whatsapp} />
              )}
            </AnimatePresence>
          )}
        </div>
      </section>

      {/* ---------------- Nairobi wayfinding signature ---------------- */}
      <section ref={bandRef} className={s.band} aria-labelledby="signature-title">
        <div className={clsx("container", s.bandShell)}>
          <div className={s.bandCopy}>
            <Reveal>
              <p className="eyebrow light">Nairobi wayfinding · giraffe path</p>
              <blockquote className={s.bandQuote}>
                <p>"I know every path on this campus by the animal on its signpost. Giraffe means the library."</p>
                <footer>— Amara, Year 6</footer>
              </blockquote>
            </Reveal>
            <Reveal delay={0.1} className={s.bandNote}>
              <h2 id="signature-title" className="sr-only">
                The Nairobi signature
              </h2>
              <p>
                Savannah wildlife line-art is Nairobi's wayfinding device — on signposts, on this site and on the
                prospectus cover. Nanyuki's is mountain forms; Kisumu's is water. Swap the logo out and the design
                should visibly break.
              </p>
            </Reveal>
          </div>
          <motion.div className={s.bandArtwork} style={{ x: bandX }} aria-hidden="true">
            <div
              className={clsx("motif", s.bandMotif)}
              style={{ backgroundImage: "url(images/motif-wildlife-transparent.png)" }}
            />
          </motion.div>
        </div>
      </section>

      {/* ---------------- Day in the life ---------------- */}
      <section className={clsx("section", s.day)} aria-labelledby="day-title">
        <div className="container">
          <div className={s.dayHead}>
            <Reveal>
              <p className="eyebrow">A day in the life</p>
              <h2 id="day-title" className="display display-lg">
                Thursday, told by <em>Amara,</em> Year 6.
              </h2>
            </Reveal>
            <Reveal delay={0.1} className={s.dayMeta}>
              <span className="tag">
                <Clock size={11} /> Refreshed termly
              </span>
              <span className={s.dayMetaText}>Term 2, 2026 · next story: Year 9, Term 3</span>
            </Reveal>
          </div>
        </div>
        <div className={clsx(s.timeline, "no-scrollbar")}>
          {DAY.map((m, i) => (
            <Reveal key={m.time} delay={i * 0.05} className={s.moment}>
              <span className={s.momentTime}>{m.time}</span>
              <h3>{m.title}</h3>
              <p>{m.text}</p>
              <span className={s.momentWho}>{m.who}</span>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- Proof points ---------------- */}
      <section className={clsx("section", s.proof)} aria-label="Key facts">
        <div className="container">
          <div className={s.proofGrid}>
            <Reveal className={s.proofItem}>
              <span className={s.proofNum}>1979</span>
              <span className={s.proofLabel}>Founded — the first Braeburn</span>
            </Reveal>
            <Reveal delay={0.05} className={s.proofItem}>
              <Counter to={18} className={s.proofNum} />
              <span className={s.proofLabel}>Average Primary class size</span>
            </Reveal>
            <Reveal delay={0.1} className={s.proofItem}>
              <Counter to={42} suffix="+" className={s.proofNum} />
              <span className={s.proofLabel}>Nationalities on this campus</span>
            </Reveal>
            <Reveal delay={0.15} className={s.proofItem}>
              <Counter to={98} suffix="%" className={s.proofNum} />
              <span className={s.proofLabel}>A Level pass rate, 2025</span>
            </Reveal>
          </div>
          <p className={s.proofNote}>Prototype figures for layout only — final statistics supplied by the school during discovery.</p>
        </div>
      </section>

      {/* ---------------- Gallery ---------------- */}
      <section className={s.gallery} aria-label="Campus photography">
        <div className={clsx("container", s.galleryGrid)}>
          <Reveal className={s.g1}>
            <img src="images/nairobi-hero.jpg" alt="Primary pupils sketching under a jacaranda tree" loading="lazy" />
          </Reveal>
          <Reveal delay={0.1} className={s.g2}>
            <img src="images/early-years.jpg" alt="Acacia Early Years children planting seedlings" loading="lazy" />
          </Reveal>
          <Reveal delay={0.15} className={s.g3}>
            <img src="images/hero.jpg" alt="Secondary students crossing the lawn at golden hour" loading="lazy" />
          </Reveal>
          <Reveal delay={0.2} className={clsx(s.g4, s.galleryCard)}>
            <p className="eyebrow light">Candid, not staged</p>
            <p>
              Every image is a real lesson, match or morning — briefed as documentary work, with safeguarding consent
              on file.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------------- Where next ---------------- */}
      <section className={clsx("section", s.next)} aria-labelledby="next-title">
        <div className="container">
          <Reveal>
            <p className="eyebrow">Transition map</p>
            <h2 id="next-title" className="display display-lg">
              Where next, <em>and when.</em>
            </h2>
          </Reveal>
          <ul className={s.nextList}>
            {NEXT.map((n, i) => (
              <li key={n.from}>
                <Reveal delay={i * 0.06} className={s.nextItem}>
                  <span className={s.nextFrom}>{n.from}</span>
                  <span className={s.nextArrow}>
                    <ArrowRight size={16} />
                  </span>
                  <span className={s.nextTo}>{n.to}</span>
                  <p>{n.note}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className={clsx("section on-dark", s.cta)} aria-labelledby="cta-title">
        <div className={s.ctaArtwork} aria-hidden="true">
          <div
            className={clsx("motif", s.ctaMotif)}
            style={{ backgroundImage: "url(images/motif-wildlife-transparent.png)" }}
          />
        </div>
        <div className={clsx("container", s.ctaInner)}>
          <Reveal>
            <p className="eyebrow light">Next step</p>
            <h2 id="cta-title" className="display display-lg">
              Come and walk the <em>giraffe path.</em>
            </h2>
            <p className="lede">
              Tours run Tuesday, Thursday and Saturday mornings: twenty minutes with {school.contact.name}, then as
              long as you like with the children.
            </p>
            <div className={s.ctaTrio}>
              <button className="btn btn-light btn-lg" onClick={visit}>
                Book a visit
              </button>
              <Link className="btn btn-accent btn-lg" to="/admissions/prospectus?campus=nairobi">
                Build my prospectus
              </Link>
              <button className="btn btn-ghost on-dark btn-lg" onClick={visit}>
                Apply
              </button>
            </div>
          </Reveal>
          <Reveal delay={0.1} className={s.ctaContact}>
            <span className="avatar" aria-hidden="true">
              {initials(school.contact.name)}
            </span>
            <div>
              <strong>{school.contact.name}</strong>
              <span>{school.contact.role}</span>
            </div>
            <a className="btn btn-sm btn-light" href={`https://wa.me/${school.contact.whatsapp}`} target="_blank" rel="noreferrer">
              <MessageCircle /> WhatsApp {school.contact.name.split(" ")[0]}
            </a>
          </Reveal>
        </div>
      </section>

      <Footer />

      {/* Placeholder 30-second campus film */}
      <AnimatePresence>
        {film && (
          <motion.div
            className={s.filmBackdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setFilm(false)}
          >
            <motion.div
              className={s.film}
              role="dialog"
              aria-modal="true"
              aria-label="Campus film"
              initial={{ scale: 0.94, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 20 }}
              transition={{ duration: 0.45, ease: EASE }}
              onClick={(e) => e.stopPropagation()}
            >
              <img src="images/hero.jpg" alt="" />
              <div className={s.filmOverlay}>
                <p className="eyebrow light plain">30-second campus film · placeholder</p>
                <p className={s.filmTitle}>Braeburn Nairobi, in the words of its pupils</p>
                <span className={s.filmProgress}>
                  <i />
                </span>
                <button className="btn btn-sm btn-light" onClick={() => setFilm(false)}>
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent campus CTA trio (desktop) */}
      <AnimatePresence>
        {showBar && (
          <motion.div
            className={clsx(s.stickyBar, "glass-dark", "no-print")}
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <span className={s.stickyName}>Braeburn Nairobi</span>
            <button className="btn btn-sm btn-light" onClick={visit}>
              Visit
            </button>
            <Link className="btn btn-sm btn-accent" to="/admissions/prospectus?campus=nairobi">
              Prospectus
            </Link>
            <button className="btn btn-sm btn-ghost on-dark" onClick={visit}>
              Apply
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

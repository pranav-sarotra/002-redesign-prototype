import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { Accessibility, ArrowRight, ArrowUpRight, ChevronDown, Clock, Sparkles, Zap } from "lucide-react";
import clsx from "clsx";
import { STAGES, schoolById, type StageId } from "../data/schools";
import { useSavedProspectus } from "../hooks";
import { firstName } from "../lib/prospectus";
import { Counter, Footer, Greeting, Reveal, Ticker } from "../components/Bits";
import { Locator } from "../components/Locator";
import { useShell } from "../components/Shell";
import s from "./GroupHome.module.css";

const GROUP_COLS = [
  {
    n: "01",
    t: "Governance",
    d: "One board of governors and one Group leadership team; common safeguarding, inspection and quality-assurance frameworks across every campus.",
  },
  {
    n: "02",
    t: "Our story",
    d: "Founded in Nairobi in 1979, Braeburn grew school by school — Garden Estate, Mombasa, Kisumu, Nanyuki, Thika, Arusha, Dar es Salaam, Kigali — without losing the family feel of the first.",
  },
  {
    n: "03",
    t: "Vision, mission & values",
    d: "Confident individuals, responsible citizens, learners enjoying success. Warm, child-centred, authentic and world-class — on campus and online.",
  },
];

const scrollToSchools = () => document.getElementById("schools")?.scrollIntoView({ behavior: "smooth" });

export default function GroupHome() {
  const [stage, setStage] = useState<StageId | "all">("all");
  const saved = useSavedProspectus();
  const savedSchool = schoolById(saved?.campusId);
  const { openEnquiry } = useShell();

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const quickStart = (id: StageId) => {
    setStage(id);
    scrollToSchools();
  };

  return (
    <>
      {/* ---------------- Hero ---------------- */}
      <section ref={heroRef} className={s.hero} aria-labelledby="hero-title">
        <motion.div className={s.heroMedia} style={{ y }}>
          <img src="images/hero.jpg" alt="" className={s.heroImg} fetchPriority="high" />
        </motion.div>
        <div className={s.heroShade} aria-hidden="true" />
        <motion.div className={clsx("container", s.heroInner)} style={{ opacity: fade }}>
          <div className={s.heroTop}>
            <span>Braeburn Group of International Schools</span>
            <span>Kenya · Tanzania · Rwanda</span>
          </div>
          <div className={s.heroBottom}>
            <div className={s.heroCopy}>
              {saved && savedSchool && (
                <Link to="/admissions/prospectus?resume=1" className={s.welcomeBack}>
                  <Sparkles size={14} /> Welcome back, {firstName(saved.name)} — your {savedSchool.short} prospectus is
                  saved <ArrowRight size={14} />
                </Link>
              )}
              <span id="hero-title" className="sr-only">
                Welcome to Braeburn
              </span>
              <Greeting />
              <p className={s.heroLede}>
                Eleven schools, three countries and one warm, unmistakably Braeburn way of growing up — from the first
                morning of nursery to the last day of Sixth Form.
              </p>
              <div className={s.heroCtas}>
                <Link to="/#schools" className="btn btn-light btn-lg" onClick={scrollToSchools}>
                  Find your school <ArrowRight />
                </Link>
                <Link to="/admissions/prospectus" className="btn btn-ghost on-dark btn-lg">
                  Build a prospectus
                </Link>
              </div>
            </div>

            <div className={clsx(s.quickStart, "glass-dark")}>
              <p className="eyebrow light">Quick start</p>
              <p className={s.quickTitle}>How old is your child?</p>
              <div className={s.quickChips}>
                {STAGES.map((st) => (
                  <button key={st.id} className={s.quickChip} onClick={() => quickStart(st.id)}>
                    <strong>{st.label}</strong>
                    <span>{st.ages} years</span>
                  </button>
                ))}
              </div>
              <p className={s.quickNote}>We'll surface the campuses that fit first — you can widen the search any time.</p>
            </div>
          </div>
        </motion.div>
        <div className={s.scrollCue} aria-hidden="true">
          <ChevronDown size={18} />
        </div>
      </section>

      <Ticker />

      {/* ---------------- Locator ---------------- */}
      <Locator stage={stage} onStage={setStage} />

      {/* ---------------- Bento: why Braeburn ---------------- */}
      <section className={clsx("section", s.bento)} aria-labelledby="why-title">
        <div className="container">
          <Reveal className={s.sectionHead}>
            <p className="eyebrow">Why families choose Braeburn</p>
            <h2 id="why-title" className="display display-lg">
              Small enough to know your child. <em>Big enough</em> to take them anywhere.
            </h2>
          </Reveal>

          <div className={s.bentoGrid}>
            <Reveal className={clsx(s.tile, s.tileQuote)}>
              <img src="images/early-years.jpg" alt="Early Years children planting seedlings with their teacher" loading="lazy" />
              <blockquote>
                <p>
                  "By the end of week one her teacher knew her name, her best friend's name and her favourite
                  dinosaur."
                </p>
                <footer>— Parent, Reception · Braeburn Garden Estate</footer>
              </blockquote>
            </Reveal>

            <Reveal delay={0.05} className={clsx(s.tile, s.tileStat)}>
              <Counter to={5000} className={s.statNum} />
              <span className={s.statLabel}>pupils learning together across the Group</span>
            </Reveal>

            <Reveal delay={0.1} className={clsx(s.tile, s.tileStat, s.tileStatAlt)}>
              <Counter to={60} suffix="+" className={s.statNum} />
              <span className={s.statLabel}>nationalities, and one shared playground</span>
            </Reveal>

            <Reveal delay={0.1} className={clsx(s.tile, s.tileDay)}>
              <div className={s.tileDayHead}>
                <span className="tag">
                  <Clock size={11} /> A day in the life
                </span>
                <span className={s.refresh}>Refreshed termly · Term 2, 2026</span>
              </div>
              <h3 className="display display-sm">07:40, Braeburn Nairobi. Amara (Year 6) is already in the garden.</h3>
              <p className={s.tileText}>
                "Mr Otieno lets us check on the tortoise before registration." Real pupils and real staff, by name — a
                rotating story from every campus, not a single claim of 'individual attention'.
              </p>
              <Link to="/campus/nairobi" className={s.tileLink}>
                Follow Amara's day <ArrowRight size={16} />
              </Link>
            </Reveal>

            <Reveal delay={0.15} className={clsx(s.tile, s.tilePath)}>
              <p className="eyebrow">One family, one journey</p>
              <ol className={s.pathList}>
                {STAGES.map((st, i) => (
                  <li key={st.id}>
                    <span className={s.pathNum}>{i + 1}</span>
                    <div>
                      <strong>{st.label}</strong>
                      <small>Ages {st.ages}</small>
                    </div>
                  </li>
                ))}
              </ol>
              <p className={s.pathNote}>
                Guided transitions between campuses — Nanyuki to Garden Estate, Kisumu to Nairobi — with the same
                pastoral team on either side.
              </p>
            </Reveal>

            <Reveal delay={0.2} className={clsx(s.tile, s.tileDark)}>
              <Zap size={28} />
              <h3 className="display display-sm">Fast on a 3G afternoon. Readable by everyone.</h3>
              <p className={s.tileText}>
                Built light for real connectivity across East Africa, to WCAG 2.2 AA as a minimum, not an afterthought.
              </p>
              <div className={s.tileBadges}>
                <span className="tag tag-dark">
                  <Accessibility size={11} /> AA
                </span>
                <span className="tag tag-dark">Under 1.5s first paint</span>
              </div>
            </Reveal>

            <Reveal delay={0.2} className={clsx(s.tile, s.tileBoarding)}>
              <img src="images/boarding.jpg" alt="Boarders relaxing together in a warm common room in the evening" loading="lazy" />
              <div className={s.tileBoardingBody}>
                <span className="tag tag-dark">Boarding from age 8</span>
                <h3 className="display display-sm">Hillcrest · Nanyuki · Thika · Arusha</h3>
                <Link to="/admissions/prospectus?interest=boarding" className={s.tileLinkLight}>
                  Put boarding in your prospectus <ArrowRight size={16} />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- Group authority strip ---------------- */}
      <section id="group" className={clsx("section", s.group)} aria-labelledby="group-title">
        <div className="container">
          <div className={s.groupHead}>
            <Reveal>
              <p className="eyebrow">The Group behind the schools</p>
              <h2 id="group-title" className="display display-lg">
                Weight <em>and</em> warmth, since 1979.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="lede">
                Braeburn began as one school in Lavington. Today a single board, one safeguarding standard and one set
                of values hold eleven schools together, while each campus keeps its own character.
              </p>
            </Reveal>
          </div>

          <div className={s.groupCols}>
            {GROUP_COLS.map((c, i) => (
              <Reveal key={c.n} delay={i * 0.08} className={s.groupCol}>
                <span className={s.groupNum}>{c.n}</span>
                <h3>{c.t}</h3>
                <p>{c.d}</p>
              </Reveal>
            ))}
          </div>

          <div className={s.groupFoot} id="circle">
            <div>
              <span className="tag">The Braeburn Circle</span>
              <p>
                Our alumni network: global chapters, mentoring for Sixth Form and BTEC students, and a living map of
                university destinations and careers.
              </p>
            </div>
            <a className="btn btn-ghost" href="https://braeburn.com" target="_blank" rel="noreferrer">
              Group site & governance <ArrowUpRight />
            </a>
          </div>
        </div>
      </section>

      {/* ---------------- Prospectus band ---------------- */}
      <section className={s.band} aria-labelledby="band-title">
        <div className={s.bandMedia} aria-hidden="true">
          <img src="images/nanyuki.jpg" alt="" loading="lazy" />
        </div>
        <div className={clsx("container", s.bandInner)}>
          <Reveal className={clsx(s.bandCard, "glass-dark")}>
            <p className="eyebrow light">Personal prospectus</p>
            <h2 id="band-title" className="display display-md">
              A prospectus about <em>your child</em>, not our org chart.
            </h2>
            <ol className={s.bandSteps}>
              <li>Your name</li>
              <li>Your child's age</li>
              <li>A campus</li>
              <li>What matters most</li>
            </ol>
            <p className={s.bandText}>
              Four questions, then a digital pack you can save, share or pick up after your visit — and that follows
              you through enquiry, offer and onboarding.
            </p>
            <div className={s.bandCtas}>
              <Link to="/admissions/prospectus" className="btn btn-accent btn-lg">
                Build mine <Sparkles />
              </Link>
              <button className="btn btn-ghost on-dark" onClick={() => openEnquiry()}>
                Talk to admissions
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </>
  );
}

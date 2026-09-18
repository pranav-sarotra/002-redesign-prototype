import { useEffect, useMemo, useReducer, useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BedDouble,
  Check,
  Copy,
  FlaskConical,
  GraduationCap,
  HeartHandshake,
  Languages,
  Mail,
  MessageCircle,
  Music,
  Printer,
  RotateCcw,
  Sparkles,
  Tent,
  Trophy,
  X,
  type LucideIcon,
} from "lucide-react";
import clsx from "clsx";
import {
  INTERESTS,
  SCHOOLS,
  offersStage,
  schoolById,
  stageForAge,
  yearGroupFor,
  type StageId,
} from "../data/schools";
import { readSavedProspectus, writeSavedProspectus } from "../hooks";
import { buildChapters, firstName } from "../lib/prospectus";
import { EASE } from "../components/Bits";
import { useShell } from "../components/Shell";
import s from "./ProspectusWizard.module.css";

/* ---------------- state ---------------- */

interface State {
  step: number;
  name: string;
  age: number | null;
  campusId: string | null;
  interests: string[];
  status: "editing" | "generating" | "done";
}

type Action =
  | { type: "name"; value: string }
  | { type: "age"; value: number }
  | { type: "campus"; value: string }
  | { type: "toggleInterest"; value: string }
  | { type: "next" }
  | { type: "back" }
  | { type: "generate" }
  | { type: "done" }
  | { type: "reset" };

const initial: State = { step: 0, name: "", age: null, campusId: null, interests: [], status: "editing" };

function reducer(st: State, a: Action): State {
  switch (a.type) {
    case "name":
      return { ...st, name: a.value };
    case "age":
      return { ...st, age: a.value };
    case "campus":
      return { ...st, campusId: a.value };
    case "toggleInterest":
      return {
        ...st,
        interests: st.interests.includes(a.value)
          ? st.interests.filter((i) => i !== a.value)
          : [...st.interests, a.value],
      };
    case "next":
      return { ...st, step: Math.min(3, st.step + 1) };
    case "back":
      return { ...st, step: Math.max(0, st.step - 1) };
    case "generate":
      return { ...st, status: "generating" };
    case "done":
      return { ...st, status: "done" };
    case "reset":
      return initial;
  }
}

const STAGE_DEFAULT_AGE: Record<StageId, number> = { early: 3, primary: 7, secondary: 12, sixth: 16 };

function initFromParams(p: URLSearchParams): State {
  const st: State = { ...initial };
  const campus = p.get("campus");
  if (campus && schoolById(campus)) st.campusId = campus;
  const stage = p.get("stage") as StageId | null;
  if (stage && STAGE_DEFAULT_AGE[stage]) st.age = STAGE_DEFAULT_AGE[stage];
  const age = Number(p.get("age"));
  if (age >= 2 && age <= 18) st.age = age;
  const interest = p.get("interest");
  if (interest) st.interests = interest.split(",").filter((i) => INTERESTS.some((x) => x.id === i));
  const name = p.get("name");
  if (name) st.name = name;

  if (p.get("resume") === "1") {
    const saved = readSavedProspectus();
    if (saved && schoolById(saved.campusId)) {
      return {
        step: 3,
        name: saved.name,
        age: saved.age,
        campusId: saved.campusId,
        interests: saved.interests,
        status: "done",
      };
    }
  }
  if (p.get("view") === "1" && st.name && st.age && st.campusId) return { ...st, step: 3, status: "done" };
  return st;
}

const ICONS: Record<string, LucideIcon> = {
  boarding: BedDouble,
  sport: Trophy,
  arts: Music,
  stem: FlaskConical,
  outdoor: Tent,
  university: GraduationCap,
  support: HeartHandshake,
  languages: Languages,
};

const STEP_LABELS = ["Name", "Age", "Campus", "Interests"];
const AGES = Array.from({ length: 17 }, (_, i) => i + 2);

const joinList = (items: string[]) =>
  items.length <= 1 ? items.join("") : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;

/* ---------------- component ---------------- */

export default function ProspectusWizard() {
  const [params] = useSearchParams();
  const [state, dispatch] = useReducer(reducer, params, initFromParams);
  const { openEnquiry } = useShell();
  const [toast, setToast] = useState<string | null>(null);
  const [email, setEmail] = useState("");

  const school = schoolById(state.campusId);
  const stage = state.age != null ? stageForAge(state.age) : null;
  const chapters = useMemo(
    () => (school && state.age != null ? buildChapters(school, state.age, state.interests) : []),
    [school, state.age, state.interests],
  );
  const valid = [state.name.trim().length >= 2, state.age !== null, state.campusId !== null, state.interests.length > 0][
    state.step
  ];

  /* generating → done */
  useEffect(() => {
    if (state.status !== "generating") return;
    const t = setTimeout(() => dispatch({ type: "done" }), chapters.length * 190 + 900);
    return () => clearTimeout(t);
  }, [state.status, chapters.length]);

  /* persist + scroll on completion */
  useEffect(() => {
    if (state.status !== "done" || !school || state.age == null) return;
    writeSavedProspectus({
      name: state.name,
      age: state.age,
      campusId: school.id,
      interests: state.interests,
      savedAt: new Date().toISOString(),
    });
    window.scrollTo({ top: 0 });
  }, [state.status, school, state.age, state.name, state.interests]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3600);
    return () => clearTimeout(t);
  }, [toast]);

  const advance = () => {
    if (!valid) return;
    if (state.step < 3) dispatch({ type: "next" });
    else dispatch({ type: "generate" });
  };

  const shareUrl = () => {
    const p = new URLSearchParams({
      view: "1",
      name: state.name,
      age: String(state.age),
      campus: school?.id ?? "",
      interest: state.interests.join(","),
    });
    const u = new URL(window.location.href);
    u.hash = `#/admissions/prospectus?${p.toString()}`;
    return u.toString();
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl());
      setToast("Link copied — it opens straight to this prospectus.");
    } catch {
      setToast(shareUrl());
    }
  };

  const sendEmail = (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setToast(`Sent to ${email}. It will also be waiting in your admissions record after your visit.`);
    setEmail("");
  };

  const nameParts = state.name.trim().split(/\s+/).filter(Boolean);
  const coverTitle = nameParts.length >= 2 ? `For the ${nameParts[nameParts.length - 1]} family` : nameParts[0] ? `For ${nameParts[0]}` : "For your family";

  /* ---------------- completion screen ---------------- */

  if (state.status === "done" && school && stage && state.age != null) {
    const interestLabels = state.interests.map((i) => INTERESTS.find((x) => x.id === i)?.label ?? i);
    return (
      <section className={s.done} aria-labelledby="done-title">
        <div className="container">
          <motion.div
            className={s.doneHead}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <p className="eyebrow">Your personal prospectus</p>
            <h1 id="done-title" className="display display-lg">
              Hi {firstName(state.name)}, your prospectus is <em>ready.</em>
            </h1>
            <p className="lede">
              We've built a {stage.label} pack ({yearGroupFor(state.age)}) for {school.short}
              {interestLabels.length ? `, focused on ${joinList(interestLabels)}` : ""}. It's saved on this device
              and will be waiting in your admissions record after you visit.
            </p>
          </motion.div>

          <div className={s.doneGrid}>
            <motion.div
              className={s.doneLeft}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            >
              <Cover school={school} title={coverTitle} stage={stage.label} year={yearGroupFor(state.age)} interests={interestLabels} />
              <div className={clsx(s.actions, "no-print")}>
                <button className="btn btn-primary" onClick={() => window.print()}>
                  <Printer /> Save as PDF
                </button>
                <button className="btn btn-ghost" onClick={copyLink}>
                  <Copy /> Copy share link
                </button>
              </div>
              <form className={clsx(s.emailRow, "no-print")} onSubmit={sendEmail}>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email it to me"
                  aria-label="Email address"
                />
                <button className="btn btn-accent" type="submit">
                  <Mail /> Send
                </button>
              </form>
              <AnimatePresence>
                {toast && (
                  <motion.p
                    className={s.toast}
                    role="status"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <Check size={16} /> {toast}
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>

            <div>
              <p className="eyebrow" style={{ marginBottom: 14 }}>
                Inside your prospectus · {chapters.length} chapters
              </p>
              <ol className={s.chapters}>
                {chapters.map((c, i) => (
                  <motion.li
                    key={c.title}
                    className={s.chapter}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: 0.15 + i * 0.06, ease: EASE }}
                  >
                    <span className={s.chNum}>{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <h3>{c.title}</h3>
                      <p>{c.blurb}</p>
                      {c.note && <span className={clsx("tag", s.chNote)}>{c.note}</span>}
                    </div>
                  </motion.li>
                ))}
              </ol>

              <div className={s.contactCard}>
                <span className="avatar" aria-hidden="true">
                  {school.contact.name
                    .split(" ")
                    .map((p) => p[0])
                    .join("")
                    .slice(0, 2)}
                </span>
                <div>
                  <strong>{school.contact.name}</strong>
                  <small>
                    {school.contact.role} · {school.short}
                  </small>
                </div>
                <div className={clsx(s.contactBtns, "no-print")}>
                  <a className="btn btn-sm btn-accent" href={`https://wa.me/${school.contact.whatsapp}`} target="_blank" rel="noreferrer">
                    <MessageCircle /> WhatsApp
                  </a>
                  <button className="btn btn-sm btn-light" onClick={() => openEnquiry(school.id)}>
                    Book a visit
                  </button>
                </div>
              </div>

              <div className={clsx(s.doneFoot, "no-print")}>
                <Link to="/" className="btn btn-ghost">
                  <ArrowLeft /> Return home
                </Link>
                {school.route && (
                  <Link to={school.route} className="btn btn-ghost">
                    Explore {school.short}
                  </Link>
                )}
                <button className="btn btn-ghost" onClick={() => dispatch({ type: "reset" })}>
                  <RotateCcw /> Start again
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* ---------------- wizard ---------------- */

  return (
    <div className={s.page}>
      <aside className={clsx(s.previewPane, "no-print")} aria-label="Prospectus preview">
        <Cover
          school={school}
          title={coverTitle}
          stage={stage?.label}
          year={state.age != null ? yearGroupFor(state.age) : undefined}
          interests={state.interests.map((i) => INTERESTS.find((x) => x.id === i)?.label ?? i)}
        />
        <p className={s.previewNote}>Your cover builds as you answer. Nothing is sent until you ask.</p>
      </aside>

      <div className={s.pane}>
        <div className={s.paneHead}>
          <span className={s.stepCount}>
            0{state.step + 1} <em>/ 04</em>
          </span>
          <Link to="/" className={s.exit}>
            <X size={16} /> Exit
          </Link>
        </div>
        <div className={s.progressLine} aria-hidden="true">
          <i style={{ width: `${((state.step + 1) / 4) * 100}%` }} />
        </div>

        <ol className={s.stepper} aria-label="Progress">
          {STEP_LABELS.map((l, i) => (
            <li key={l} className={clsx(s.stepDot, i < state.step && s.stepDone, i === state.step && s.stepCurrent)}>
              <i /> {l}
            </li>
          ))}
        </ol>

        <AnimatePresence mode="wait" initial={false}>
          {state.status === "generating" ? (
            <motion.div
              key="generating"
              className={s.generating}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              role="status"
            >
              <p className="eyebrow">Assembling your chapters</p>
              <h2 className={clsx("display", s.qTitle)}>
                One moment, {firstName(state.name)} — <em>writing it around {school?.short}.</em>
              </h2>
              <ul>
                {chapters.map((c, i) => (
                  <motion.li
                    key={c.title}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.19 }}
                  >
                    <Check size={16} /> {c.title}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ) : (
            <motion.div
              key={state.step}
              className={s.question}
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -28 }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              {state.step === 0 && (
                <>
                  <p className="eyebrow">First things first</p>
                  <h2 className={clsx("display", s.qTitle)}>
                    Who are we <em>writing this for?</em>
                  </h2>
                  <p className={s.qHelp}>Your name — so the pack, and the person who follows it up, can address you properly.</p>
                  <input
                    className={s.nameInput}
                    autoFocus
                    value={state.name}
                    onChange={(e) => dispatch({ type: "name", value: e.target.value })}
                    onKeyDown={(e) => e.key === "Enter" && advance()}
                    placeholder="Amina Hassan"
                    aria-label="Your name"
                    autoComplete="name"
                  />
                </>
              )}

              {state.step === 1 && (
                <>
                  <p className="eyebrow">Your child</p>
                  <h2 className={clsx("display", s.qTitle)}>
                    How old is your <em>child?</em>
                  </h2>
                  <p className={s.qHelp}>We'll map their age to a year group and stage — you can change it later.</p>
                  <div className={s.ages} role="group" aria-label="Child's age">
                    {AGES.map((a) => (
                      <button key={a} className={s.ageBtn} aria-pressed={state.age === a} onClick={() => dispatch({ type: "age", value: a })}>
                        {a}
                      </button>
                    ))}
                  </div>
                  <div className={s.ageOut} aria-live="polite">
                    {state.age != null && stage ? (
                      <motion.span key={state.age} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                        <strong>{state.age} years</strong> → {yearGroupFor(state.age)} · {stage.label}
                      </motion.span>
                    ) : (
                      <span className="muted">Pick an age from 2 to 18.</span>
                    )}
                  </div>
                </>
              )}

              {state.step === 2 && (
                <>
                  <p className="eyebrow">Campus</p>
                  <h2 className={clsx("display", s.qTitle)}>
                    Which Braeburn is <em>closest to home?</em>
                  </h2>
                  <p className={s.qHelp}>
                    Campuses that don't run to {stage?.label ?? "this stage"} are still worth a look — we'll include the
                    progression route in your pack.
                  </p>
                  <div className={s.campuses} role="group" aria-label="Campus">
                    {SCHOOLS.map((sc) => {
                      const fits = stage ? offersStage(sc, stage) : true;
                      return (
                        <button
                          key={sc.id}
                          className={s.campusTile}
                          aria-pressed={state.campusId === sc.id}
                          onClick={() => dispatch({ type: "campus", value: sc.id })}
                        >
                          <img src={sc.image} alt="" loading="lazy" decoding="async" />
                          <span className={s.campusMeta}>
                            <strong>{sc.name}</strong>
                            <small>
                              {sc.flag} {sc.town} · ages {sc.ages[0]}–{sc.ages[1]} · {sc.boarding ? "day & boarding" : "day"}
                            </small>
                            {!fits && <span className={s.tileNote}>Via progression route</span>}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}

              {state.step === 3 && (
                <>
                  <p className="eyebrow">What matters most</p>
                  <h2 className={clsx("display", s.qTitle)}>
                    Choose the chapters <em>worth your time.</em>
                  </h2>
                  <p className={s.qHelp}>Pick as many as you like. Each becomes a chapter written for {school?.short ?? "your campus"}.</p>
                  <div className={s.interests} role="group" aria-label="Areas of interest">
                    {INTERESTS.map((it) => {
                      const Icon = ICONS[it.id];
                      return (
                        <button
                          key={it.id}
                          className={s.interestTile}
                          aria-pressed={state.interests.includes(it.id)}
                          onClick={() => dispatch({ type: "toggleInterest", value: it.id })}
                        >
                          <Icon size={22} strokeWidth={1.7} />
                          <strong>{it.label}</strong>
                          <span>{it.blurb}</span>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {state.status === "editing" && (
          <div className={s.paneFoot}>
            <button className="btn btn-ghost" onClick={() => dispatch({ type: "back" })} disabled={state.step === 0}>
              <ArrowLeft /> Back
            </button>
            <button className={clsx("btn", state.step === 3 ? "btn-accent" : "btn-primary")} onClick={advance} disabled={!valid}>
              {state.step === 3 ? (
                <>
                  Generate my prospectus <Sparkles />
                </>
              ) : (
                <>
                  Continue <ArrowRight />
                </>
              )}
            </button>
            <span className={s.hint}>{state.step === 0 ? "Press Enter ↵" : `Step ${state.step + 1} of 4`}</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- cover ---------------- */

function Cover({
  school,
  title,
  stage,
  year,
  interests,
}: {
  school?: ReturnType<typeof schoolById>;
  title: string;
  stage?: string;
  year?: string;
  interests: string[];
}) {
  return (
    <div className={s.cover}>
      <AnimatePresence initial={false}>
        <motion.img
          key={school?.image ?? "default"}
          className={s.coverBg}
          src={school?.image ?? "images/hero.jpg"}
          alt=""
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: EASE }}
        />
      </AnimatePresence>
      <div className={s.coverShade} />
      <div className={s.coverTop}>
        <img src="brand/logo-mark.png" alt="" width={34} height={34} />
        <span>Personal prospectus · 2026/27</span>
      </div>
      <div className={s.coverBody}>
        <p className={s.coverEyebrow}>{school ? school.name : "Braeburn Group of International Schools"}</p>
        <h2 className={s.coverTitle}>{title}</h2>
        <div className={s.coverChips}>
          {stage && (
            <span>
              {stage}
              {year ? ` · ${year}` : ""}
            </span>
          )}
          {interests.map((i) => (
            <span key={i}>{i}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

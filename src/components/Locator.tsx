import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowLeftRight, ArrowRight, Play, X } from "lucide-react";
import clsx from "clsx";
import {
  COUNTRIES,
  SCHOOLS,
  STAGES,
  offersStage,
  schoolById,
  type CountryCode,
  type StageId,
} from "../data/schools";
import { EastAfricaMap } from "./EastAfricaMap";
import s from "./Locator.module.css";

type TypeFilter = "all" | "day" | "boarding";

interface Props {
  stage: StageId | "all";
  onStage: (stage: StageId | "all") => void;
}

export function Locator({ stage, onStage }: Props) {
  const [country, setCountry] = useState<CountryCode | "all">("all");
  const [type, setType] = useState<TypeFilter>("all");
  const [selected, setSelected] = useState<string | null>("nairobi");
  const [playing, setPlaying] = useState(false);
  const [compare, setCompare] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const railRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Record<string, HTMLElement | null>>({});

  const results = useMemo(() => {
    const st = STAGES.find((x) => x.id === stage);
    return SCHOOLS.filter(
      (sc) =>
        (country === "all" || sc.code === country) &&
        (type === "all" || (type === "boarding" ? sc.boarding : !sc.boarding)) &&
        (!st || offersStage(sc, st)),
    );
  }, [country, type, stage]);

  const visibleIds = useMemo(() => new Set(results.map((r) => r.id)), [results]);

  useEffect(() => {
    if (!selected || !visibleIds.has(selected)) {
      setSelected(results[0]?.id ?? null);
      setPlaying(false);
    }
  }, [results, visibleIds, selected]);

  const select = (id: string, scroll = true) => {
    setSelected(id);
    setPlaying(false);
    if (!scroll) return;
    const rail = railRef.current;
    const card = cardRefs.current[id];
    if (rail && card) {
      rail.scrollTo({ left: card.offsetLeft - (rail.clientWidth - card.clientWidth) / 2, behavior: "smooth" });
    }
  };

  const nudge = (dir: 1 | -1) => {
    railRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  const toggleCompare = (id: string) => {
    setCompare((c) => {
      if (c.includes(id)) return c.filter((x) => x !== id);
      if (c.length >= 2) return [c[1], id];
      return [...c, id];
    });
  };

  const current = schoolById(selected);
  const pair = compare.map((id) => schoolById(id)!).filter(Boolean);

  return (
    <section id="schools" className={clsx(s.section, "section on-dark")} aria-labelledby="locator-title">
      <div className={clsx("container", s.inner)}>
        <div className={s.head}>
          <div>
            <p className="eyebrow light">Find your Braeburn</p>
            <h2 id="locator-title" className="display display-lg">
              Eleven schools. <em>One</em> that feels like yours.
            </h2>
          </div>
          <p className={s.count} aria-live="polite">
            Showing <strong>{results.length}</strong> of {SCHOOLS.length} schools · tap a pin or swipe the cards
          </p>
        </div>

        <div className={s.filters} role="group" aria-label="Filter schools">
          <div className={clsx(s.filterGroup, "no-scrollbar")}>
            <span className={s.filterLabel}>Country</span>
            <button className="chip" aria-pressed={country === "all"} onClick={() => setCountry("all")}>
              All
            </button>
            {COUNTRIES.map((c) => (
              <button key={c.code} className="chip" aria-pressed={country === c.code} onClick={() => setCountry(c.code)}>
                {c.flag} {c.name}
              </button>
            ))}
          </div>
          <div className={clsx(s.filterGroup, "no-scrollbar")}>
            <span className={s.filterLabel}>Day / boarding</span>
            {(
              [
                ["all", "Any"],
                ["day", "Day only"],
                ["boarding", "Boarding"],
              ] as [TypeFilter, string][]
            ).map(([v, l]) => (
              <button key={v} className="chip" aria-pressed={type === v} onClick={() => setType(v)}>
                {l}
              </button>
            ))}
          </div>
          <div className={clsx(s.filterGroup, "no-scrollbar")}>
            <span className={s.filterLabel}>Stage</span>
            <button className="chip" aria-pressed={stage === "all"} onClick={() => onStage("all")}>
              Any age
            </button>
            {STAGES.map((st) => (
              <button key={st.id} className="chip" aria-pressed={stage === st.id} onClick={() => onStage(st.id)}>
                {st.label} <small style={{ opacity: 0.7 }}>{st.ages}</small>
              </button>
            ))}
          </div>
        </div>

        <div className={s.grid}>
          <div className={s.mapCard}>
            <span className={s.mapHint}>Tap a country to filter</span>
            <EastAfricaMap
              schools={SCHOOLS}
              visibleIds={visibleIds}
              selectedId={selected}
              onSelect={(id) => select(id)}
              onCountry={(code) => setCountry((c) => (c === code ? "all" : code))}
              activeCountry={country}
            />
          </div>

          <div className={s.right}>
            <div className={s.railHead}>
              <p>Swipe through the schools that match — each with its own one-line identity.</p>
              <div className={s.arrows}>
                <button className={s.arrow} onClick={() => nudge(-1)} aria-label="Scroll schools left">
                  <ArrowLeft size={18} />
                </button>
                <button className={s.arrow} onClick={() => nudge(1)} aria-label="Scroll schools right">
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>

            <div ref={railRef} className={clsx(s.rail, "no-scrollbar")} role="list" aria-label="Matching schools">
              <AnimatePresence initial={false}>
                {results.map((sc) => (
                  <motion.article
                    key={sc.id}
                    role="listitem"
                    ref={(el) => {
                      cardRefs.current[sc.id] = el;
                    }}
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.94 }}
                    transition={{ duration: 0.35 }}
                    className={clsx(s.card, selected === sc.id && s.cardSelected)}
                  >
                    <button className={s.cardMedia} onClick={() => select(sc.id, false)} aria-label={`Preview ${sc.name}`}>
                      <img src={sc.image} alt="" loading="lazy" decoding="async" />
                      <span className={s.cardFlag}>
                        {sc.flag} {sc.country}
                      </span>
                      <span className={s.playChip}>
                        <Play size={11} /> 0:30
                      </span>
                    </button>
                    <div className={s.cardBody}>
                      <h3>{sc.name}</h3>
                      <p className={s.cardTown}>{sc.town}</p>
                      <p className={s.cardIdentity}>{sc.identity}</p>
                      <div className={s.cardMeta}>
                        <span>
                          Ages {sc.ages[0]}–{sc.ages[1]}
                        </span>
                        <span>{sc.boarding ? "Day & boarding" : "Day"}</span>
                      </div>
                      <div className={s.cardActions}>
                        {sc.route ? (
                          <Link to={sc.route} className="btn btn-sm btn-primary">
                            Explore campus <ArrowRight />
                          </Link>
                        ) : (
                          <button className="btn btn-sm btn-ghost" onClick={() => select(sc.id, false)}>
                            Preview
                          </button>
                        )}
                        <button
                          className={s.compareBtn}
                          aria-pressed={compare.includes(sc.id)}
                          onClick={() => toggleCompare(sc.id)}
                        >
                          <ArrowLeftRight size={14} /> Compare
                        </button>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </AnimatePresence>
              {results.length === 0 && (
                <div className={s.empty}>
                  <p className="display display-sm">No campus matches every filter yet.</p>
                  <p className="muted">Try widening the stage or boarding filter, or ask us — we will suggest a route.</p>
                </div>
              )}
            </div>

            <AnimatePresence mode="wait">
              {current && (
                <motion.div
                  key={current.id}
                  className={s.detail}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className={s.detailMedia}>
                    <img src={current.image} alt={`${current.name} campus`} loading="lazy" decoding="async" />
                    {playing ? (
                      <div className={s.videoOverlay} role="status">
                        <p className="eyebrow light plain">30-second campus film · placeholder</p>
                        <p className={s.videoTitle}>{current.short}, in the words of its pupils</p>
                        <span className={s.progress}>
                          <i />
                        </span>
                        <button className="btn btn-sm btn-ghost on-dark" onClick={() => setPlaying(false)}>
                          Close
                        </button>
                      </div>
                    ) : (
                      <button className={s.playBig} onClick={() => setPlaying(true)}>
                        <span className={s.playIcon}>
                          <Play size={14} />
                        </span>
                        Watch the 30-second intro
                      </button>
                    )}
                  </div>
                  <div className={s.detailBody}>
                    <p className="eyebrow light">
                      {current.flag} {current.town} · {current.motif} motif
                    </p>
                    <h3 className="display display-sm">{current.name}</h3>
                    <p className={s.detailText}>{current.identity}</p>
                    <dl className={s.facts}>
                      <div>
                        <dt>Ages</dt>
                        <dd>
                          {current.ages[0]}–{current.ages[1]}
                        </dd>
                      </div>
                      <div>
                        <dt>Day / boarding</dt>
                        <dd>{current.boarding ? "Day & boarding" : "Day school"}</dd>
                      </div>
                      <div>
                        <dt>Pathway</dt>
                        <dd>{current.curriculum.slice(-2).join(" · ")}</dd>
                      </div>
                      <div>
                        <dt>Fees from (indicative)</dt>
                        <dd>{current.feeFrom}</dd>
                      </div>
                    </dl>
                    <div className={s.detailActions}>
                      {current.route ? (
                        <Link to={current.route} className="btn btn-light">
                          Explore campus <ArrowRight />
                        </Link>
                      ) : (
                        <span className="tag tag-dark">Campus site · phase 2 rollout</span>
                      )}
                      <Link to={`/admissions/prospectus?campus=${current.id}`} className="btn btn-ghost on-dark">
                        Prospectus for this campus
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {compare.length > 0 && (
          <motion.div
            className={s.tray}
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            role="region"
            aria-label="Campus comparison"
          >
            <div className={s.trayHead}>
              <strong className={s.trayTitle}>
                <ArrowLeftRight size={16} /> Compare
              </strong>
              {pair.map((sc) => (
                <span key={sc.id} className={s.trayChip}>
                  {sc.short}
                  <button onClick={() => toggleCompare(sc.id)} aria-label={`Remove ${sc.short}`}>
                    <X size={12} />
                  </button>
                </span>
              ))}
              {pair.length < 2 && <span className={s.trayHint}>Pick one more campus</span>}
              {pair.length === 2 && (
                <button className="btn btn-sm btn-primary" onClick={() => setCompareOpen((o) => !o)}>
                  {compareOpen ? "Hide" : "View side by side"}
                </button>
              )}
              <button
                className={s.trayClose}
                onClick={() => {
                  setCompare([]);
                  setCompareOpen(false);
                }}
                aria-label="Clear comparison"
              >
                <X size={16} />
              </button>
            </div>
            <AnimatePresence>
              {compareOpen && pair.length === 2 && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  style={{ overflow: "hidden" }}
                >
                  <table className={s.table}>
                    <thead>
                      <tr>
                        <th scope="col">
                          <span className="sr-only">Attribute</span>
                        </th>
                        {pair.map((sc) => (
                          <th key={sc.id} scope="col">
                            {sc.short}
                            <small>{sc.town}</small>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {(
                        [
                          ["Country", (sc) => `${sc.flag} ${sc.country}`],
                          ["Ages", (sc) => `${sc.ages[0]}–${sc.ages[1]}`],
                          ["Day / boarding", (sc) => (sc.boarding ? "Day & boarding" : "Day")],
                          ["Curriculum", (sc) => sc.curriculum.join(" · ")],
                          ["Setting", (sc) => sc.motif],
                          ["Sixth Form", (sc) => (sc.ages[1] >= 18 ? "On campus" : sc.progression ?? "Progression route")],
                          ["Fees from", (sc) => sc.feeFrom],
                        ] as [string, (sc: (typeof pair)[number]) => string][]
                      ).map(([label, fn]) => (
                        <tr key={label}>
                          <th scope="row">{label}</th>
                          {pair.map((sc) => (
                            <td key={sc.id}>{fn(sc)}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

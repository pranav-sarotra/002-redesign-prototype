import clsx from "clsx";
import type { CountryCode, School } from "../data/schools";
import s from "./EastAfricaMap.module.css";

/* Simplified, stylised outlines. Coordinates: x = longitude × 10, y = −latitude × 10. */
const COUNTRIES: { code: CountryCode | "UG" | "BI"; d: string }[] = [
  {
    code: "KE",
    d: "M339,10 L340,-2 L345,-12 L341,-36 L350,-50 L359,-45 L381,-36 L396,-34 L410,-40 L419,-40 L410,-28 L410,9 L415,17 L402,27 L392,47 L377,31 Z",
  },
  {
    code: "TZ",
    d: "M339,10 L377,31 L392,47 L394,60 L393,70 L395,80 L398,100 L404,105 L370,116 L355,116 L346,115 L340,95 L329,94 L310,86 L307,83 L296,65 L295,44 L304,33 L308,24 L305,11 L310,10 Z",
  },
  { code: "RW", d: "M289,24 L291,14 L296,14 L305,11 L308,24 L304,28 L294,28 Z" },
  {
    code: "UG",
    d: "M296,14 L296,-7 L312,-22 L310,-36 L330,-39 L341,-36 L345,-12 L340,-2 L339,10 L310,10 L305,11 Z",
  },
  { code: "BI", d: "M294,28 L304,28 L307,35 L305,44 L295,44 L293,35 Z" },
];

const LAKES = [
  "M318,-4 L326,-6 L336,-2 L343,3 L345,10 L341,18 L335,27 L326,30 L318,22 L315,10 Z",
  "M293,33 L299,35 L306,58 L310,78 L311,88 L306,86 L299,66 L293,45 Z",
  "M358,-46 L365,-46 L366,-30 L362,-24 L358,-30 Z",
];

const OCEAN = "M415,17 L402,27 L392,47 L394,60 L393,70 L395,80 L398,100 L404,105 L406,130 L440,130 L440,-10 Z";

const COUNTRY_LABELS = [
  { text: "Kenya", x: 386, y: -12, faded: false },
  { text: "Tanzania", x: 350, y: 66, faded: false },
  { text: "Rwanda", x: 291, y: 8, faded: false },
  { text: "Uganda", x: 316, y: -22, faded: true },
];

const TOWN_LABELS = [
  { text: "Nairobi", x: 372, y: 21, anchor: "start" },
  { text: "Thika", x: 378, y: 5, anchor: "start" },
  { text: "Nanyuki", x: 374, y: -1, anchor: "start" },
  { text: "Kisumu", x: 345, y: 0, anchor: "end" },
  { text: "Mombasa", x: 394, y: 45, anchor: "end" },
  { text: "Arusha", x: 364, y: 36, anchor: "end" },
  { text: "Dar es Salaam", x: 390, y: 71, anchor: "end" },
  { text: "Kigali", x: 304, y: 20, anchor: "start" },
] as const;

interface Props {
  schools: School[];
  visibleIds: Set<string>;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onCountry?: (code: CountryCode) => void;
  activeCountry: CountryCode | "all";
  mini?: boolean;
}

export function EastAfricaMap({ schools, visibleIds, selectedId, onSelect, onCountry, activeCountry, mini }: Props) {
  return (
    <svg
      className={clsx(s.map, mini && s.mini)}
      viewBox="286 -52 134 150"
      role={mini ? "img" : "group"}
      aria-label={mini ? "Map of Braeburn schools across Kenya, Tanzania and Rwanda" : "Interactive map of Braeburn schools"}
    >
      <path d={OCEAN} className={s.ocean} />
      {COUNTRIES.map((c) => {
        const faded = c.code === "UG" || c.code === "BI";
        const clickable = !faded && !mini && onCountry;
        return (
          <path
            key={c.code}
            d={c.d}
            className={clsx(
              s.country,
              faded && s.countryFaded,
              !faded && activeCountry === c.code && s.countryActive,
              clickable && s.countryClickable,
            )}
            onClick={clickable ? () => onCountry(c.code as CountryCode) : undefined}
          />
        );
      })}
      {LAKES.map((d) => (
        <path key={d} d={d} className={s.lake} />
      ))}
      {!mini && (
        <>
          {COUNTRY_LABELS.map((l) => (
            <text key={l.text} x={l.x} y={l.y} className={clsx(s.label, l.faded && s.labelFaded)}>
              {l.text}
            </text>
          ))}
          <text x={417} y={92} textAnchor="end" className={s.oceanLabel}>
            Indian Ocean
          </text>
          {TOWN_LABELS.map((t) => (
            <text key={t.text} x={t.x} y={t.y} textAnchor={t.anchor} className={s.town}>
              {t.text}
            </text>
          ))}
        </>
      )}
      {schools.map((sc) => {
        const [x, y] = sc.pin;
        const visible = visibleIds.has(sc.id);
        const selected = sc.id === selectedId;
        return (
          <g
            key={sc.id}
            transform={`translate(${x} ${y})`}
            className={clsx(s.pin, !visible && s.pinMuted, selected && s.pinSelected)}
            role={mini ? undefined : "button"}
            tabIndex={mini || !visible ? -1 : 0}
            aria-label={`${sc.name}, ${sc.town}`}
            aria-pressed={mini ? undefined : selected}
            onClick={() => visible && !mini && onSelect(sc.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect(sc.id);
              }
            }}
          >
            <circle r={6} fill="transparent" />
            {selected && <circle r={3} className={s.pulse} />}
            <circle r={selected ? 2.8 : mini ? 1.6 : 2.1} className={s.pinDot} />
          </g>
        );
      })}
    </svg>
  );
}

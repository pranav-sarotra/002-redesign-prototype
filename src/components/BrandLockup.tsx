import { Link } from "react-router-dom";
import clsx from "clsx";
import s from "./BrandLockup.module.css";

type Tone = "dark" | "light";

interface BrandLockupProps {
  /** Extra CSS-module class from the place where the lockup is rendered. */
  className?: string;
  /** `dark` is for a dark surrounding surface; `light` is for paper surfaces. */
  tone?: Tone;
  /** Keeps the complete name accessible while allowing a compact mobile treatment. */
  compact?: boolean;
  onClick?: () => void;
}

/**
 * The shared, live-text Group lockup. The supplied crest remains the brand mark;
 * keeping the descriptor as text makes it crisp, localisable and legible at all sizes.
 */
export function BrandLockup({ className, tone = "dark", compact = false, onClick }: BrandLockupProps) {
  return (
    <Link
      to="/"
      className={clsx(s.lockup, tone === "light" ? s.light : s.dark, compact && s.compact, className)}
      aria-label="Braeburn Group of International Schools home"
      onClick={onClick}
    >
      <span className={s.crest} aria-hidden="true">
        <img src="brand/logo-mark.png" alt="" width={44} height={44} />
      </span>
      <span className={s.copy}>
        <strong>Braeburn</strong>
        <small>Group of International Schools</small>
      </span>
    </Link>
  );
}

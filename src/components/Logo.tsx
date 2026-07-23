import Link from "next/link";

type LogoProps = {
  className?: string;
  href?: string;
  variant?: "full" | "mark";
};

export function Logo({ className = "", href = "/", variant = "full" }: LogoProps) {
  const mark = (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        viewBox="0 0 120 120"
        className="h-10 w-10 shrink-0"
        aria-hidden="true"
      >
        <g fill="currentColor">
          {/* speed lines */}
          <rect x="2" y="48" width="18" height="3" rx="1.5" />
          <rect x="6" y="56" width="14" height="3" rx="1.5" />
          <rect x="4" y="64" width="16" height="3" rx="1.5" />
          <rect x="8" y="72" width="12" height="3" rx="1.5" />
          {/* arc */}
          <path
            d="M38 22c22-10 52-4 64 18 10 18 6 42-10 56"
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M30 88c-8-14-6-36 10-50"
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
          />
          {/* sparkle */}
          <path d="M98 28 L100 34 L106 36 L100 38 L98 44 L96 38 L90 36 L96 34 Z" />
          {/* wordmark */}
          <text
            x="58"
            y="58"
            textAnchor="middle"
            fontSize="18"
            fontWeight="700"
            fontFamily="var(--font-display), sans-serif"
            letterSpacing="-0.5"
            transform="skewX(-8)"
          >
            slide
          </text>
          <text
            x="58"
            y="82"
            textAnchor="middle"
            fontSize="26"
            fontWeight="800"
            fontFamily="var(--font-display), sans-serif"
            letterSpacing="-1"
            transform="skewX(-8)"
          >
            XL
          </text>
        </g>
      </svg>
      {variant === "full" && (
        <span className="font-display text-xl font-bold tracking-tight sm:text-2xl">
          Slide <span className="text-purple">XL</span>
        </span>
      )}
    </span>
  );

  if (!href) return mark;
  return (
    <Link href={href} className="text-ink transition hover:text-purple">
      {mark}
      <span className="sr-only">Slide XL home</span>
    </Link>
  );
}

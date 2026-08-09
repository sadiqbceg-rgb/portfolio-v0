/* ============================================================================
 * ARTWORK
 *
 * The style reference carries its emotion through full-bleed cloud photography
 * and sculptural translucent glass forms. Rather than ship stock photos this
 * generates that imagery as self-contained SVG — no binary assets, no network
 * requests, and every parameter is a number you can edit.
 *
 * Gradients and blurs live ONLY inside these compositions. They stand in for
 * photography, which is exactly where the style guide permits tonal depth. The
 * UI chrome around them stays flat: no gradient buttons, cards or backgrounds.
 *
 * To replace a composition with a real photograph, pass `image` to the card
 * instead — see src/content/site.ts.
 * ==========================================================================*/

type Variant = 'clouds' | 'glass' | 'ridge' | 'orbit';

/**
 * Every SVG filter and gradient needs a document-unique id. Server components
 * cannot call useId, so callers pass a `uid` (e.g. "work-0") and the ids are
 * derived from it.
 */
function Clouds({ uid }: { uid: string }) {
  return (
    <svg
      viewBox="0 0 800 500"
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
      aria-hidden="true"
    >
      <defs>
        {/* Two turbulence passes at different frequencies read as depth: a
            broad soft mass behind, finer wisps in front. */}
        <filter id={`${uid}-back`} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.0035 0.008"
            numOctaves="6"
            seed="11"
            stitchTiles="stitch"
            result="t"
          />
          <feColorMatrix
            in="t"
            type="matrix"
            values="0 0 0 0 0.26
                    0 0 0 0 0.38
                    0 0 0 0 0.53
                    0.62 0.62 0.62 0 -0.62"
          />
        </filter>
        <filter id={`${uid}-front`} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.011 0.02"
            numOctaves="5"
            seed="4"
            stitchTiles="stitch"
            result="t"
          />
          <feColorMatrix
            in="t"
            type="matrix"
            values="0 0 0 0 0.85
                    0 0 0 0 0.89
                    0 0 0 0 0.96
                    0.5 0.5 0.5 0 -0.72"
          />
          <feGaussianBlur stdDeviation="1.6" />
        </filter>
        <radialGradient id={`${uid}-glow`} cx="62%" cy="28%" r="58%">
          <stop offset="0%" stopColor="#6f8db8" stopOpacity="0.55" />
          <stop offset="55%" stopColor="#426188" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="800" height="500" fill="#05070c" />
      <rect width="800" height="500" filter={`url(#${uid}-back)`} />
      <rect width="800" height="500" fill={`url(#${uid}-glow)`} />
      <rect width="800" height="500" filter={`url(#${uid}-front)`} opacity="0.5" />
    </svg>
  );
}

function Glass({ uid }: { uid: string }) {
  return (
    <svg
      viewBox="0 0 800 500"
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <filter id={`${uid}-haze`} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.004 0.01"
            numOctaves="5"
            seed="23"
            stitchTiles="stitch"
            result="t"
          />
          <feColorMatrix
            in="t"
            type="matrix"
            values="0 0 0 0 0.24
                    0 0 0 0 0.33
                    0 0 0 0 0.47
                    0.6 0.6 0.6 0 -0.68"
          />
        </filter>
        {/* The sculptural form: overlapping translucent lobes, softly blurred,
            reading as a single refractive object rather than flat shapes. */}
        <linearGradient id={`${uid}-g1`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.72" />
          <stop offset="48%" stopColor="#8fb0d8" stopOpacity="0.34" />
          <stop offset="100%" stopColor="#426188" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id={`${uid}-g2`} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2b7fff" stopOpacity="0.34" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.24" />
        </linearGradient>
        <filter id={`${uid}-soft`}>
          <feGaussianBlur stdDeviation="9" />
        </filter>
        <filter id={`${uid}-caustic`}>
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      <rect width="800" height="500" fill="#05070c" />
      <rect width="800" height="500" filter={`url(#${uid}-haze)`} />

      {/* The body of the sculpture: asymmetric overlapping lobes rather than a
          circle, so it reads as a blown, hand-made form. */}
      <g filter={`url(#${uid}-soft)`}>
        <path
          d="M400 68 C512 68 596 154 596 262 C596 372 508 438 398 438 C286 438 206 366 206 258 C206 150 292 68 400 68 Z"
          fill={`url(#${uid}-g1)`}
        />
        <ellipse
          cx="468"
          cy="206"
          rx="112"
          ry="146"
          fill={`url(#${uid}-g2)`}
          transform="rotate(-24 468 206)"
        />
        <ellipse cx="332" cy="304" rx="88" ry="112" fill="#ffffff" opacity="0.16" />
      </g>

      {/* Refraction: a bright caustic band bent through the body, plus rim
          light on the upper left only. Partial arcs, never a closed outline —
          a full stroke reads as a drawn circle instead of a lit edge. */}
      <g filter={`url(#${uid}-caustic)`} fill="none" strokeLinecap="round">
        <path
          d="M262 176 C316 132 396 118 462 140"
          stroke="#ffffff"
          strokeOpacity="0.5"
          strokeWidth="3"
        />
        <path
          d="M246 250 C300 300 380 330 470 318"
          stroke="#8fb0d8"
          strokeOpacity="0.32"
          strokeWidth="2"
        />
        <path
          d="M520 330 C560 300 578 262 580 226"
          stroke="#ffffff"
          strokeOpacity="0.22"
          strokeWidth="2"
        />
      </g>
    </svg>
  );
}

function Ridge({ uid }: { uid: string }) {
  return (
    <svg
      viewBox="0 0 800 500"
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <filter id={`${uid}-mist`} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.006 0.014"
            numOctaves="5"
            seed="31"
            stitchTiles="stitch"
            result="t"
          />
          <feColorMatrix
            in="t"
            type="matrix"
            values="0 0 0 0 0.55
                    0 0 0 0 0.65
                    0 0 0 0 0.8
                    0.5 0.5 0.5 0 -0.66"
          />
          <feGaussianBlur stdDeviation="2" />
        </filter>
        <linearGradient id={`${uid}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0d1522" />
          <stop offset="70%" stopColor="#243449" />
          <stop offset="100%" stopColor="#41608a" />
        </linearGradient>
        <filter id={`${uid}-far`}>
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <filter id={`${uid}-near`}>
          <feGaussianBlur stdDeviation="2" />
        </filter>
      </defs>

      <rect width="800" height="500" fill={`url(#${uid}-sky)`} />
      {/* Receding ridgelines. Each layer is blurred a little less than the one
          behind it — distance reads as softness, so the far ridge dissolves
          into the sky while the near one keeps its edge. Irregular spacing
          keeps them from scanning as a zigzag pattern. */}
      <path
        d="M0 372 L96 318 L188 344 L268 292 L352 338 L436 276 L534 330 L622 288 L714 326 L800 300 L800 500 L0 500 Z"
        fill="#0b1220"
        opacity="0.85"
        filter={`url(#${uid}-far)`}
      />
      <path
        d="M0 424 L118 374 L214 410 L318 356 L402 402 L502 350 L596 396 L702 358 L800 388 L800 500 L0 500 Z"
        fill="#070c15"
        opacity="0.95"
        filter={`url(#${uid}-near)`}
      />
      <rect width="800" height="500" filter={`url(#${uid}-mist)`} opacity="0.55" />
    </svg>
  );
}

function Orbit({ uid }: { uid: string }) {
  return (
    <svg
      viewBox="0 0 800 500"
      preserveAspectRatio="xMidYMid slice"
      className="h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <filter id={`${uid}-grain`} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.005 0.011"
            numOctaves="5"
            seed="17"
            stitchTiles="stitch"
            result="t"
          />
          <feColorMatrix
            in="t"
            type="matrix"
            values="0 0 0 0 0.22
                    0 0 0 0 0.31
                    0 0 0 0 0.45
                    0.58 0.58 0.58 0 -0.66"
          />
        </filter>
        <radialGradient id={`${uid}-core`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="45%" stopColor="#8fb0d8" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#426188" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="800" height="500" fill="#05070c" />
      <rect width="800" height="500" filter={`url(#${uid}-grain)`} />
      <g
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.22"
        transform="rotate(-16 400 250)"
      >
        <ellipse cx="400" cy="250" rx="270" ry="96" />
        <ellipse cx="400" cy="250" rx="205" ry="72" />
        <ellipse cx="400" cy="250" rx="140" ry="49" />
      </g>
      <circle cx="400" cy="250" r="96" fill={`url(#${uid}-core)`} />
    </svg>
  );
}

const VARIANTS: Record<Variant, (props: { uid: string }) => React.JSX.Element> = {
  clouds: Clouds,
  glass: Glass,
  ridge: Ridge,
  orbit: Orbit,
};

export function Artwork({ variant, uid }: { variant: Variant; uid: string }) {
  const Composition = VARIANTS[variant];
  return <Composition uid={uid} />;
}

/**
 * Full-bleed atmospheric backdrop for hero and statement sections. Sits behind
 * content at low opacity so Whiteout text keeps its contrast ratio.
 */
export function Atmosphere({
  uid,
  variant = 'clouds',
  className = '',
}: {
  uid: string;
  variant?: Variant;
  className?: string;
}) {
  return (
    <div className={`absolute inset-0 -z-10 overflow-hidden ${className}`}>
      <Artwork variant={variant} uid={uid} />
      {/* Scrim: keeps body copy legible over the brightest parts of the sky. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0.85) 100%)',
        }}
      />
    </div>
  );
}

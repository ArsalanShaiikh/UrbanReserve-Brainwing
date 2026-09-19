import { useRef } from 'react'
import { gsap, useGSAP, reduced } from '../gsap/gsapConfig'
import { rng } from './rng'
import ART from './botanicalPaths'

// Pivot for the idle sway: where each traced drawing's stem leaves the brochure page.
const ORIGIN = {
  fern: '0% 22%',
  umbel: '96% 100%',
  star: '50% 100%',
  monstera: '0% 85%',
  leaf: '55% 100%',
  seed: '4% 100%',
}

/**
 * Line art vectorised from the brochure (scripts/trace-botanicals.mjs).
 * The screen intro draws its outline (`data-draw`), then fills it (`data-fill`);
 * it sways gently and drifts with the cursor by `depth` px.
 */
export default function Botanical({ kind, seed = 1, depth = 14, sway = 2, className = '' }) {
  const g = useRef(null)
  const { w, h, d } = ART[kind]

  useGSAP(() => {
    if (!sway || reduced()) return
    const r = rng(seed * 31)
    gsap.fromTo(
      g.current,
      { rotation: -sway * 0.5 },
      {
        rotation: sway * 0.5,
        transformOrigin: ORIGIN[kind],
        duration: 4.5 + r() * 2.5,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: -r() * 4,
      },
    )
  })

  return (
    <div className={`drift pointer-events-none absolute ${className}`} style={{ '--d': depth }} aria-hidden="true">
      <svg viewBox={`0 0 ${w} ${h}`} className="block h-auto w-full overflow-visible">
        <g ref={g}>
          <path data-fill d={d} fill="currentColor" fillRule="evenodd" />
          <g data-draw fill="none" stroke="currentColor" strokeWidth={w / 520} strokeLinejoin="round">
            <path d={d} />
          </g>
        </g>
      </svg>
    </div>
  )
}

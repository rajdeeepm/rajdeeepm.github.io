// Types
import type { RootState } from 'store'

// Style
import style from './index.module.css'

// Utils
import cn from 'classnames'
import { gsap } from 'gsap'
import { Howl } from 'howler'
import { randomIntFromInterval } from 'utils/math'
import lerp from 'utils/lerp'

// Hooks
import { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

// Data
import { projectDetails } from 'components/Experience/utils/projectCardGenerator'

// Icons
import { ExternalArrow } from 'components/Icons'

const projectOrder = [
  'accessibility',
  'ectss',
  'aws-agentic',
  'multimodal',
  'vti-aero',
  'retrospect-ai',
  'aerollm',
  'net-gpt',
  'heterogeneous-dataset'
]

const BELLS = 4

function ProjectCards() {
  const dispatch = useDispatch()
  const audio = useSelector((state: RootState) => state.audio)

  const [flipped, setFlipped] = useState<boolean[]>(() => projectOrder.map(() => false))

  const runwayRef = useRef<HTMLDivElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLElement | null)[]>([])
  const facesRefs = useRef<(HTMLDivElement | null)[]>([])
  const flipTweens = useRef<(gsap.core.Timeline | null)[]>([])
  const howls = useRef<Howl[]>([])
  const audioMute = useRef(audio.mute)
  const currentX = useRef(0)
  const rafId = useRef<number | null>(null)
  const reducedMotion = useRef(false)

  audioMute.current = audio.mute

  // Hover bells (same set the WebGL cards used)
  useEffect(() => {
    for (let i = 1; i <= BELLS; i++) {
      howls.current.push(
        new Howl({
          src: [`/audio/bell${i}.mp3`],
          volume: 0.8
        })
      )
    }
    return () => {
      howls.current.forEach((howl) => howl.unload())
      howls.current = []
    }
  }, [])

  // Scroll-driven horizontal travel, smoothed with lerp
  useEffect(() => {
    reducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const update = () => {
      const runway = runwayRef.current
      const viewport = viewportRef.current
      const track = trackRef.current

      if (runway && viewport && track) {
        const rect = runway.getBoundingClientRect()
        const total = rect.height - viewport.clientHeight
        const progress = total > 0 ? Math.min(Math.max(-rect.top / total, 0), 1) : 0
        const travel = Math.max(track.scrollWidth - viewport.clientWidth, 0)
        const targetX = -progress * travel

        currentX.current = reducedMotion.current
          ? targetX
          : lerp(currentX.current, targetX, 0.09)

        // Pin the viewport while the runway scrolls by (sticky substitute:
        // position: sticky is broken by the global overflow-x: hidden)
        const pinY = Math.min(Math.max(-rect.top, 0), Math.max(total, 0))
        viewport.style.transform = `translate3d(0, ${pinY}px, 0)`
        track.style.transform = `translate3d(${currentX.current}px, 0, 0)`
      }

      rafId.current = requestAnimationFrame(update)
    }

    rafId.current = requestAnimationFrame(update)
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [])

  // Reveal cards as they enter the viewport
  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(style.revealed)
            observer.unobserve(entry.target)
          }
        })
      },
      { root: viewport, threshold: 0.15 }
    )

    cardRefs.current.forEach((card) => card && observer.observe(card))
    return () => observer.disconnect()
  }, [])

  const flipCard = useCallback((index: number) => {
    const card = facesRefs.current[index]
    if (!card) return

    // Ignore while a flip is running
    if (flipTweens.current[index]?.isActive()) return

    if (reducedMotion.current) {
      setFlipped((state) => state.map((f, i) => (i === index ? !f : f)))
      return
    }

    // Same collapse/expand flip the WebGL cards performed
    flipTweens.current[index] = gsap
      .timeline()
      .to(card, {
        scaleX: 0,
        duration: 0.25,
        ease: 'power2.in',
        onComplete: () => {
          setFlipped((state) => state.map((f, i) => (i === index ? !f : f)))
        }
      })
      .to(card, {
        scaleX: 1,
        duration: 0.3,
        ease: 'power2.out'
      })
  }, [])

  const cardClickHandler = useCallback(
    (index: number) => (e: React.MouseEvent) => {
      // Let links work and text selection happen without flipping
      if ((e.target as HTMLElement).closest('a, button')) return
      if (window.getSelection()?.toString()) return
      flipCard(index)
    },
    [flipCard]
  )

  const overHandler = useCallback(() => {
    dispatch.pointer.setType('hover')
    if (!audioMute.current) {
      const bell = howls.current[randomIntFromInterval(1, howls.current.length - 1)]
      if (bell && !bell.playing()) bell.play()
    }
  }, [dispatch.pointer])

  const outHandler = useCallback(() => {
    dispatch.pointer.setType('default')
  }, [dispatch.pointer])

  return (
    <div className={style.runway} ref={runwayRef}>
      <div className={style.viewport} ref={viewportRef}>
        <div className={style.track} ref={trackRef}>
          {projectOrder.map((key, index) => {
            const project = projectDetails[key]
            if (!project) return null

            const isFlipped = flipped[index]

            return (
              <article
                key={key}
                ref={(el) => (cardRefs.current[index] = el)}
                className={cn(style.card, { [style.flipped]: isFlipped })}
                onClick={cardClickHandler(index)}
                onMouseEnter={overHandler}
                onMouseLeave={outHandler}
              >
                <div className={style.faces} ref={(el) => (facesRefs.current[index] = el)}>
                {/* Front */}
                <div
                  className={cn(style.face, { [style.faceHidden]: isFlipped })}
                  aria-hidden={isFlipped}
                >
                  <header className={style.head}>
                    <span className={style.index}>{String(index + 1).padStart(2, '0')}</span>
                    <h3 className={style.title}>{project.name}</h3>
                    <p className={style.meta}>
                      {project.organization} · {project.period}
                    </p>
                  </header>

                  <p className={style.outcome}>{project.heroOutcome}</p>

                  <ul className={style.chips}>
                    {project.chips.map((chip) => (
                      <li key={chip}>{chip}</li>
                    ))}
                  </ul>

                  <div className={style.highlights}>
                    {project.highlights.map((highlight) => (
                      <div className={style.highlight} key={highlight.title}>
                        <h4>{highlight.title}</h4>
                        <p>{highlight.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Back */}
                <div
                  className={cn(style.face, style.back, { [style.faceHidden]: !isFlipped })}
                  aria-hidden={!isFlipped}
                >
                  <header className={style.head}>
                    <span className={style.index}>{String(index + 1).padStart(2, '0')}</span>
                    <h3 className={style.title}>{project.name}</h3>
                    <p className={style.meta}>Detailed overview</p>
                  </header>

                  <ul className={style.bullets}>
                    {project.detailedBullets.map((bullet, i) => (
                      <li key={i} dangerouslySetInnerHTML={{ __html: bullet }} />
                    ))}
                  </ul>

                  {project.publicationUrl && (
                    <a
                      className={style.publication}
                      href={project.publicationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      tabIndex={isFlipped ? 0 : -1}
                    >
                      View publication <ExternalArrow />
                    </a>
                  )}
                </div>
                </div>

                <button
                  type="button"
                  className={style.flipBtn}
                  onClick={() => flipCard(index)}
                  aria-expanded={isFlipped}
                >
                  {isFlipped ? 'Flip back ⟲' : 'Flip for details ⟲'}
                </button>
              </article>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ProjectCards

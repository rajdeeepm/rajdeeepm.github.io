// Types
import type { RootState } from 'store'

// Styles
import style from './index.module.css'

// Utils
import { gsap } from 'gsap'
import ScrambleTextPlugin from 'gsap/ScrambleTextPlugin'
import cn from 'classnames'

// Hooks
import { useEffect, useCallback, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

gsap.registerPlugin(ScrambleTextPlugin)
// type Props = {}

function Pointer() {
  const location = useLocation()
  const pointer = useSelector((state: RootState) => state.pointer)
  const cursorRef = useRef<HTMLDivElement>(null)
  const rafId = useRef<number | null>(null)

  const update = useCallback(() => {
    if (cursorRef.current) {
      // Use native CSS transform with GPU acceleration (translate3d)
      cursorRef.current.style.transform = `translate3d(${window.cursor.x}px, ${window.cursor.y}px, 0)`
    }

    rafId.current = requestAnimationFrame(update)
  }, [])

  useEffect(() => {
    rafId.current = requestAnimationFrame(update)
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [update])

  const classes = cn(style.root, {
    [style.dark]: location.pathname !== '/',
    [style[`type-${pointer.type}`]]: pointer.type
  })

  return (
    <div className={classes} ref={cursorRef}>
      <div className={style.leftLine} />
      <div className={style.rightLine} />
      <div className={style.circle} />
    </div>
  )
}
export default Pointer

// Types
import type { AnimationEvent } from 'react'
import type { RootState } from 'store'

// Style
import style from './index.module.css'

// Utils
import cn from 'classnames'

// Hooks
import { useState, useCallback, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

function Logo() {
  const location = useLocation()
  const [visible, setVisible] = useState(false)
  const [closingModal, setClosingModal] = useState(false)
  const currentPathname = useRef<string>(location.pathname)
  const app = useSelector((state: RootState) => state.app)

  const endAnimationHandler = useCallback((e: AnimationEvent) => {
    if (e.animationName === style['to-white']) {
      setClosingModal(false)
    }
  }, [])

  // Visible
  useEffect(() => {
    setTimeout(() => {
      setVisible(true)
    }, 500)
  }, [])

  useEffect(() => {
    if (currentPathname.current !== location.pathname && location.pathname === '/') {
      setClosingModal(true)
    }
    currentPathname.current = location.pathname
  }, [closingModal, location.pathname])

  const classes = cn(style.root, {
    [style.hidden]: !visible,
    [style.toWhite]: app.ready && closingModal,
    [style.toBlack]: app.ready && location.pathname !== '/'
  })

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className={classes} onClick={scrollToTop} style={{ cursor: 'pointer' }}>
      <span className={style.bold}>
        <span className={style.inner} onAnimationEnd={endAnimationHandler}>
          Rajdeep
        </span>
      </span>
    </div>
  )
}

export default Logo

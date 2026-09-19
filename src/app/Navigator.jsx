import { useEffect, useMemo, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import Curtain from './Curtain'
import { NavContext, direction, fromHash, hashFor, isPage, setIntroDelay } from './nav'

// One transition at a time; a request made mid-sweep is queued (latest wins) and runs right after.
function createDirector(initial, setRoute) {
  const d = {
    current: initial,
    lastPage: isPage(initial) ? initial : null,
    busy: false,
    curtain: null,
    queued: null,
    attach(c) {
      d.curtain = c
    },
    run(to, push) {
      if (to === d.current && !d.busy) return
      if (d.busy) {
        d.queued = { to, push }
        return
      }
      d.busy = true
      if (push) window.history.pushState(null, '', hashFor(to))
      const tl = d.curtain.sweep(direction(d.current, to), () => {
        setIntroDelay(0.22)
        d.current = to
        if (isPage(to)) d.lastPage = to
        flushSync(() => setRoute(to))
      })
      tl.eventCallback('onComplete', () => {
        d.busy = false
        const next = d.queued
        d.queued = null
        if (next && next.to !== d.current) d.run(next.to, next.push)
      })
    },
  }
  return d
}

export default function Navigator({ children }) {
  const [route, setRoute] = useState(fromHash)
  const [tone, setTone] = useState('dark')
  const curtain = useRef(null)
  const director = useRef(null)

  useEffect(() => {
    const d = createDirector(fromHash(), setRoute)
    d.attach(curtain.current)
    director.current = d
    const onPop = () => d.run(fromHash(), false)
    const onKey = (e) => {
      if (e.key !== 'Escape' || e.defaultPrevented) return
      if (isPage(d.current)) d.run('menu', true)
      else if (d.current === 'menu') d.run(d.lastPage ?? 'landing', true)
    }
    window.addEventListener('popstate', onPop)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('popstate', onPop)
      window.removeEventListener('keydown', onKey)
    }
  }, [])

  const value = useMemo(
    () => ({
      route,
      tone,
      setTone,
      go: (to) => director.current?.run(to, true),
      lastPage: () => director.current?.lastPage ?? null,
    }),
    [route, tone],
  )

  return (
    <NavContext.Provider value={value}>
      {children}
      <Curtain ref={curtain} />
    </NavContext.Provider>
  )
}

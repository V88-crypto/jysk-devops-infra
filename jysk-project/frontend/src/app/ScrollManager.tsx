import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Some sections render only after their async data loads,
// so the hash target may appear in the DOM a little later.
const HASH_TARGET_WAIT_MS = 2000

export const ScrollManager = () => {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
      return
    }

    const targetId = decodeURIComponent(hash.slice(1))
    const startedAt = performance.now()
    let frameId = 0

    const scrollToTarget = () => {
      const target = document.getElementById(targetId)

      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }

      if (performance.now() - startedAt < HASH_TARGET_WAIT_MS) {
        frameId = requestAnimationFrame(scrollToTarget)
      }
    }

    scrollToTarget()

    return () => cancelAnimationFrame(frameId)
  }, [pathname, hash])

  return null
}

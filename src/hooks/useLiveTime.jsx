import { createContext, useContext, useState, useEffect, useRef, useMemo } from 'react'

/**
 * Singleton live time context - provides a single interval for the entire app
 */
const LiveTimeContext = createContext(null)

let globalIntervalRef = null
let globalSubscribers = new Set()
let globalTime = new Date()

function startGlobalInterval() {
  if (globalIntervalRef) return
  globalIntervalRef = setInterval(() => {
    globalTime = new Date()
    globalSubscribers.forEach(callback => callback(globalTime))
  }, 1000)
}

function stopGlobalInterval() {
  if (globalIntervalRef && globalSubscribers.size === 0) {
    clearInterval(globalIntervalRef)
    globalIntervalRef = null
  }
}

function subscribe(callback) {
  globalSubscribers.add(callback)
  startGlobalInterval()
  return () => {
    globalSubscribers.delete(callback)
    stopGlobalInterval()
  }
}

/**
 * Provider component - wrap your app with this once
 */
export function LiveTimeProvider({ children }) {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const unsubscribe = subscribe(setTime)
    return unsubscribe
  }, [])

  const value = useMemo(() => ({ now: time }), [time])

  return (
    <LiveTimeContext.Provider value={value}>
      {children}
    </LiveTimeContext.Provider>
  )
}

/**
 * Hook to access live time - use anywhere in the component tree
 * @returns {Date} Current time, updates every second
 */
export function useLiveTime() {
  const context = useContext(LiveTimeContext)
  if (!context) {
    throw new Error('useLiveTime must be used within a LiveTimeProvider')
  }
  return context.now
}
import { useState, useEffect, useRef, useCallback } from 'react'

/**
 * Custom hook for debounced localStorage persistence
 * @param {string} key - localStorage key (without prefix)
 * @param {any} initialValue - Initial value if nothing in storage
 * @param {number} debounceMs - Debounce delay in ms (default 500)
 * @returns [value, setValue] - Similar to useState
 */
export function useLocalStorage(key, initialValue, debounceMs = 500) {
  const prefixedKey = `nw_${key}`
  const timeoutRef = useRef(null)
  const initializedRef = useRef(false)

  // Initialize from localStorage (only once)
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(prefixedKey)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${prefixedKey}":`, error)
      return initialValue
    }
  })

  // Debounced save to localStorage
  const setValue = useCallback((value) => {
    try {
      // Allow value to be a function for functional updates
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)

      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      // Debounce the write
      timeoutRef.current = setTimeout(() => {
        try {
          localStorage.setItem(prefixedKey, JSON.stringify(valueToStore))
        } catch (error) {
          console.warn(`Error writing localStorage key "${prefixedKey}":`, error)
        }
      }, debounceMs)
    } catch (error) {
      console.warn(`Error setting localStorage key "${prefixedKey}":`, error)
    }
  }, [prefixedKey, debounceMs, storedValue])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return [storedValue, setValue]
}

/**
 * Hook for managing multiple localStorage keys with a single debounced save
 * @param {Object} initialState - Object with keys as localStorage keys (without prefix) and values as initial values
 * @param {number} debounceMs - Debounce delay in ms (default 500)
 * @returns [state, setState, saveNow] - state object, setter, and immediate save function
 */
export function useLocalStorageObject(initialState, debounceMs = 500) {
  const timeoutRef = useRef(null)
  const keys = Object.keys(initialState)
  const prefixedKeys = keys.reduce((acc, key) => {
    acc[key] = `nw_${key}`
    return acc
  }, {})

  // Initialize all values from localStorage
  const [state, setState] = useState(() => {
    const initial = {}
    keys.forEach(key => {
      try {
        const item = localStorage.getItem(prefixedKeys[key])
        initial[key] = item ? JSON.parse(item) : initialState[key]
      } catch (error) {
        console.warn(`Error reading localStorage key "${prefixedKeys[key]}":`, error)
        initial[key] = initialState[key]
      }
    })
    return initial
  })

  // Debounced save all keys
  const saveAll = useCallback(() => {
    keys.forEach(key => {
      try {
        localStorage.setItem(prefixedKeys[key], JSON.stringify(state[key]))
      } catch (error) {
        console.warn(`Error writing localStorage key "${prefixedKeys[key]}":`, error)
      }
    })
  }, [keys, prefixedKeys, state])

  const setStateDebounced = useCallback((updater) => {
    setState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(saveAll, debounceMs)
      return next
    })
  }, [saveAll, debounceMs])

  // Immediate save (for critical updates)
  const saveNow = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    saveAll()
  }, [saveAll])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return [state, setStateDebounced, saveNow]
}
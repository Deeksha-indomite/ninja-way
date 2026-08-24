import { useEffect, useRef } from 'react'

const CLIENT_ID = import.meta.env.VITE_ADSENSE_CLIENT || 'ca-pub-6613219705062030'
const AD_SLOT = import.meta.env.VITE_ADSENSE_SLOT || ''

export default function AdSense({ slot = AD_SLOT, format = 'auto', layout }) {
  const pushed = useRef(false)
  const canRenderAd = Boolean(CLIENT_ID && slot && import.meta.env.PROD)

  useEffect(() => {
    if (!canRenderAd || pushed.current) return

    try {
      window.adsbygoogle = window.adsbygoogle || []
      window.adsbygoogle.push({})
      pushed.current = true
    } catch (error) {
      console.warn('AdSense could not render this ad slot:', error)
    }
  }, [canRenderAd])

  if (!canRenderAd) return null

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block', minHeight: 90, margin: '14px 0' }}
      data-ad-client={CLIENT_ID}
      data-ad-slot={slot}
      data-ad-format={format}
      data-ad-layout={layout || undefined}
      data-full-width-responsive="true"
    />
  )
}

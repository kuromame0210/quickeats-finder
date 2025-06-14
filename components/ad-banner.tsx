"use client"

import { useEffect } from "react"

interface AdBannerProps {
  slot: string
  format?: "auto" | "rectangle" | "horizontal" | "vertical"
  className?: string
  responsive?: boolean
}

declare global {
  interface Window {
    adsbygoogle: any[]
  }
}

export default function AdBanner({ 
  slot, 
  format = "auto", 
  className = "",
  responsive = true 
}: AdBannerProps) {
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        (window.adsbygoogle = window.adsbygoogle || []).push({})
      }
    } catch (err) {
      console.error("AdSense error:", err)
    }
  }, [])

  // 開発環境では模擬広告を表示
  if (process.env.NODE_ENV === "development") {
    return (
      <div className={`bg-gray-200 border-2 border-dashed border-gray-400 flex items-center justify-center ${className}`}>
        <div className="text-center text-gray-600">
          <div className="text-sm font-medium">広告エリア</div>
          <div className="text-xs">本番環境で表示されます</div>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <div className="text-xs text-gray-500 mb-1 text-center">広告</div>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive.toString()}
      />
    </div>
  )
}
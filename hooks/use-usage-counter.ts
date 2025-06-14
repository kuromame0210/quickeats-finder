"use client"

import { useState, useEffect } from "react"

const USAGE_COUNT_KEY = "quickeats_usage_count"
const AD_INTERVAL = 15 // 15回ごとに追加広告を表示

interface UsageCounter {
  usageCount: number
  shouldShowExtraAds: boolean
  incrementUsage: () => void
  resetUsage: () => void
}

export function useUsageCounter(): UsageCounter {
  const [usageCount, setUsageCount] = useState(0)
  const [shouldShowExtraAds, setShouldShowExtraAds] = useState(false)

  useEffect(() => {
    const count = parseInt(localStorage.getItem(USAGE_COUNT_KEY) || "0", 10)
    setUsageCount(count)
    setShouldShowExtraAds(count >= AD_INTERVAL)
  }, [])

  const incrementUsage = () => {
    const newCount = usageCount + 1
    setUsageCount(newCount)
    localStorage.setItem(USAGE_COUNT_KEY, newCount.toString())
    setShouldShowExtraAds(newCount >= AD_INTERVAL)
  }

  const resetUsage = () => {
    setUsageCount(0)
    localStorage.setItem(USAGE_COUNT_KEY, "0")
    setShouldShowExtraAds(false)
  }

  return {
    usageCount,
    shouldShowExtraAds,
    incrementUsage,
    resetUsage,
  }
}
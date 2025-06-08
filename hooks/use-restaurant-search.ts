"use client"

import { useState } from "react"
import type { Restaurant } from "@/types/interfaces"

interface SearchState {
  restaurants: Restaurant[]
  loading: boolean
  error: string | null
}

export function useRestaurantSearch() {
  const [state, setState] = useState<SearchState>({
    restaurants: [],
    loading: false,
    error: null,
  })

  const searchRestaurants = async (latitude: number, longitude: number, radius = 200) => {
    setState((prev) => ({ ...prev, loading: true, error: null }))

    try {
      const response = await fetch(`/api/places?lat=${latitude}&lng=${longitude}&radius=${radius}`)

      if (!response.ok) {
        throw new Error("飲食店の検索に失敗しました")
      }

      const data = await response.json()

      if (data.restaurants && data.restaurants.length === 0) {
        setState({
          restaurants: [],
          loading: false,
          error: "指定した条件に一致する飲食店が見つかりませんでした。検索範囲を広げてみてください。",
        })
        return
      }

      setState({
        restaurants: data.restaurants || [],
        loading: false,
        error: null,
      })
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "予期しないエラーが発生しました",
      }))
    }
  }

  return {
    ...state,
    searchRestaurants,
  }
}

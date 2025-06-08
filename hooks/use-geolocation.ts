"use client"

import { useState } from "react"

interface GeolocationState {
  latitude: number | null
  longitude: number | null
  error: string | null
  loading: boolean
}

interface GeolocationOptions {
  enableHighAccuracy?: boolean
  timeout?: number
  maximumAge?: number
}

export function useGeolocation(options: GeolocationOptions = {}) {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: false,
  })

  const getCurrentPosition = () => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: "お使いのブラウザは位置情報をサポートしていません",
        loading: false,
      }))
      return
    }

    setState((prev) => ({ ...prev, loading: true, error: null }))

    const defaultOptions: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000, // 5分間キャッシュ
      ...options,
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          loading: false,
        })
      },
      (error) => {
        let errorMessage = "位置情報の取得に失敗しました"

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "位置情報の使用が拒否されました。ブラウザの設定で位置情報を許可してください。"
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = "位置情報が利用できません"
            break
          case error.TIMEOUT:
            errorMessage = "位置情報の取得がタイムアウトしました"
            break
        }

        setState((prev) => ({
          ...prev,
          error: errorMessage,
          loading: false,
        }))
      },
      defaultOptions,
    )
  }

  return {
    ...state,
    getCurrentPosition,
  }
}

"use client"

import React from "react"

import { useState } from "react"
import { Search, MapPin, AlertCircle } from "lucide-react"
import RestaurantList from "@/components/restaurant-list"
import FilterPanel from "@/components/filter-panel"
import type { FilterState, SearchOptions } from "@/types/interfaces"
import Header from "@/components/header"
import { useGeolocation } from "@/hooks/use-geolocation"
import { useRestaurantSearch } from "@/hooks/use-restaurant-search"
import { useUsageCounter } from "@/hooks/use-usage-counter"
import { Alert, AlertDescription } from "@/components/ui/alert"
import SearchRadiusSelector from "@/components/search-radius-selector"
import AdBanner from "@/components/ad-banner"

export default function Home() {
  const [isSearched, setIsSearched] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    showOpenOnly: true,
    minRating: 4.0,
    selectedGenres: [],
    priceRange: "",
    sortBy: "distance",
  })
  const [searchOptions, setSearchOptions] = useState<SearchOptions>({
    radius: 500, // デフォルトを500mに変更
  })

  const { latitude, longitude, error: locationError, loading: locationLoading, getCurrentPosition } = useGeolocation()
  const { restaurants, loading: searchLoading, error: searchError, searchRestaurants } = useRestaurantSearch()
  const { usageCount, shouldShowExtraAds, incrementUsage } = useUsageCounter()

  const handleSearch = async () => {
    if (latitude && longitude) {
      await searchRestaurants(latitude, longitude, searchOptions.radius)
      setIsSearched(true)
      incrementUsage() // 検索時に使用回数をカウント
    } else {
      getCurrentPosition()
    }
  }

  // 位置情報が取得できたら自動的に検索
  React.useEffect(() => {
    if (latitude && longitude && !isSearched) {
      searchRestaurants(latitude, longitude, searchOptions.radius)
      setIsSearched(true)
      incrementUsage() // 自動検索時も使用回数をカウント
    }
  }, [latitude, longitude, isSearched, searchOptions.radius, searchRestaurants, incrementUsage])

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
  }

  const handleRadiusChange = (radius: number) => {
    setSearchOptions((prev) => ({ ...prev, radius }))
    if (latitude && longitude) {
      searchRestaurants(latitude, longitude, radius)
    }
  }

  const filteredRestaurants = restaurants
    .filter((restaurant) => {
      if (filters.showOpenOnly && !restaurant.isOpen) return false
      if (restaurant.rating < filters.minRating) return false
      if (filters.selectedGenres.length > 0 && !filters.selectedGenres.includes(restaurant.cuisine)) return false
      if (filters.priceRange && filters.priceRange !== restaurant.priceRange) return false
      return true
    })
    .sort((a, b) => {
      if (filters.sortBy === "distance") {
        return Number.parseInt(a.distance) - Number.parseInt(b.distance)
      } else {
        return b.rating - a.rating
      }
    })

  const isLoading = locationLoading || searchLoading
  const error = locationError || searchError

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-6 max-w-3xl">
        {error && (
          <Alert className="mb-6" variant={error.includes("一致する飲食店") ? "default" : "destructive"}>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-center mb-8">
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="bg-rose-600 hover:bg-rose-700 text-white font-bold py-4 px-8 rounded-full shadow-lg flex items-center justify-center transition-all w-full max-w-md disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                <span>{locationLoading ? "位置情報取得中..." : "検索中..."}</span>
              </div>
            ) : (
              <>
                <Search className="mr-2" />
                周辺の美味しいお店を探す
              </>
            )}
          </button>
        </div>

        {latitude && longitude && (
          <div className="text-center text-sm text-gray-600 mb-4">
            <MapPin className="inline h-4 w-4 mr-1" />
            現在地: {latitude.toFixed(4)}, {longitude.toFixed(4)}
          </div>
        )}
        
        {/* 使用回数表示（開発用） */}
        {process.env.NODE_ENV === "development" && (
          <div className="text-center text-xs text-gray-500 mb-4">
            使用回数: {usageCount}/15 {shouldShowExtraAds && "(追加広告表示中)"}
          </div>
        )}

        {isSearched && (
          <>
            <SearchRadiusSelector radius={searchOptions.radius} onChange={handleRadiusChange} />
            <FilterPanel filters={filters} onFilterChange={handleFilterChange} />
            
            {/* 15回使用後に追加広告を表示 */}
            {shouldShowExtraAds && (
              <div className="mb-6">
                <AdBanner
                  slot="9876543210"
                  format="rectangle"
                  className="h-32 flex items-center justify-center"
                />
              </div>
            )}
            
            <RestaurantList restaurants={filteredRestaurants} />
            
            {/* 15回使用後かつ結果が5件以上の場合に下部広告を表示 */}
            {shouldShowExtraAds && filteredRestaurants.length > 5 && (
              <div className="mt-6">
                <AdBanner
                  slot="5432109876"
                  format="rectangle"
                  className="h-32 flex items-center justify-center"
                />
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}

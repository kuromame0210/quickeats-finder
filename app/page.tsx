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
import { Alert, AlertDescription } from "@/components/ui/alert"
import SearchRadiusSelector from "@/components/search-radius-selector"

export default function Home() {
  const [isSearched, setIsSearched] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    showOpenOnly: false,
    minRating: 3.0,
    selectedGenres: [],
    priceRange: "",
    sortBy: "distance",
  })
  const [searchOptions, setSearchOptions] = useState<SearchOptions>({
    radius: 500, // デフォルトを500mに変更
  })

  const { latitude, longitude, error: locationError, loading: locationLoading, getCurrentPosition } = useGeolocation()
  const { restaurants, loading: searchLoading, error: searchError, searchRestaurants } = useRestaurantSearch()

  const handleSearch = async () => {
    if (latitude && longitude) {
      await searchRestaurants(latitude, longitude, searchOptions.radius)
      setIsSearched(true)
    } else {
      getCurrentPosition()
    }
  }

  // 位置情報が取得できたら自動的に検索
  React.useEffect(() => {
    if (latitude && longitude && !isSearched) {
      searchRestaurants(latitude, longitude, searchOptions.radius)
      setIsSearched(true)
    }
  }, [latitude, longitude, isSearched, searchOptions.radius, searchRestaurants])

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
                周辺のおいしい店を探す
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

        {isSearched && (
          <>
            <SearchRadiusSelector radius={searchOptions.radius} onChange={handleRadiusChange} />
            <FilterPanel filters={filters} onFilterChange={handleFilterChange} />
            <RestaurantList restaurants={filteredRestaurants} />
          </>
        )}
      </div>
    </main>
  )
}

export interface Restaurant {
  id: string
  name: string
  rating: number
  reviewCount: number
  distance: string
  walkTime: string
  isOpen: boolean
  cuisine: string
  priceRange: string
  address: string
  phone: string
  hours: string
  photoUrl: string
  description?: string
}

export interface FilterState {
  showOpenOnly: boolean
  minRating: number
  selectedGenres: string[]
  priceRange: string
  sortBy: "distance" | "rating"
}

export interface SearchOptions {
  radius: number
}

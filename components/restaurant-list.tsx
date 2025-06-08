"use client"

import { useState } from "react"
import type { Restaurant } from "@/types/interfaces"
import RestaurantCard from "./restaurant-card"
import RestaurantDetailModal from "./restaurant-detail-modal"

interface RestaurantListProps {
  restaurants: Restaurant[]
}

export default function RestaurantList({ restaurants }: RestaurantListProps) {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)

  return (
    <div>
      {restaurants.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">条件に一致する飲食店が見つかりませんでした。</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {restaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              onClick={() => setSelectedRestaurant(restaurant)}
            />
          ))}
        </div>
      )}

      <RestaurantDetailModal
        restaurant={selectedRestaurant}
        isOpen={!!selectedRestaurant}
        onClose={() => setSelectedRestaurant(null)}
      />
    </div>
  )
}

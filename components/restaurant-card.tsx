"use client"

import { Star } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Restaurant } from "@/types/interfaces"

interface RestaurantCardProps {
  restaurant: Restaurant
  onClick: () => void
}

export default function RestaurantCard({ restaurant, onClick }: RestaurantCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer group" onClick={onClick}>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg truncate pr-2">{restaurant.name}</h3>
          <Badge variant={restaurant.isOpen ? "success" : "destructive"} className="text-xs">
            {restaurant.isOpen ? "営業中" : "営業時間外"}
          </Badge>
        </div>

        <div className="flex items-center mb-2">
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
            <span className="font-medium">{restaurant.rating}</span>
          </div>
          <span className="mx-2 text-gray-400">•</span>
          <Badge variant="outline" className="text-xs">
            {restaurant.cuisine}
          </Badge>
          <span className="mx-2 text-gray-400">•</span>
          <span className="text-sm text-gray-600">{restaurant.priceRange}</span>
        </div>

        <div className="text-sm text-gray-600">
          徒歩{restaurant.walkTime} ({restaurant.distance})
        </div>
      </div>
    </Card>
  )
}

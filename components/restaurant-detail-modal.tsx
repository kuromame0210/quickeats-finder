"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Phone, Map, Star } from "lucide-react"
import type { Restaurant } from "@/types/interfaces"
import Image from "next/image"

interface RestaurantDetailModalProps {
  restaurant: Restaurant | null
  isOpen: boolean
  onClose: () => void
}

export default function RestaurantDetailModal({ restaurant, isOpen, onClose }: RestaurantDetailModalProps) {
  if (!restaurant) return null

  const handleCall = () => {
    window.location.href = `tel:${restaurant.phone}`
  }

  const handleOpenMap = () => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        restaurant.name + " " + restaurant.address,
      )}`,
      "_blank",
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">{restaurant.name}</DialogTitle>
        </DialogHeader>

        <div className="relative w-full h-48 mb-4">
          <Image
            src={restaurant.photoUrl || "/placeholder.svg?height=200&width=400&query=restaurant"}
            alt={restaurant.name}
            fill
            className="object-cover rounded-md"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
            <span className="font-medium">{restaurant.rating}</span>
            <span className="text-gray-500 ml-1">({restaurant.reviewCount}件)</span>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">住所</h4>
            <p>{restaurant.address}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">営業時間</h4>
            <p>{restaurant.hours}</p>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">電話番号</h4>
            <p>{restaurant.phone}</p>
          </div>

          <div className="flex space-x-2 pt-2">
            <Button onClick={handleCall} className="flex-1 bg-green-600 hover:bg-green-700">
              <Phone className="mr-2 h-4 w-4" />
              電話をかける
            </Button>
            <Button onClick={handleOpenMap} className="flex-1">
              <Map className="mr-2 h-4 w-4" />
              地図で見る
            </Button>
          </div>

          <Button variant="outline" onClick={onClose} className="w-full">
            閉じる
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

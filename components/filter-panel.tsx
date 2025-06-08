"use client"

import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import type { FilterState } from "@/types/interfaces"

interface FilterPanelProps {
  filters: FilterState
  onFilterChange: (filters: Partial<FilterState>) => void
}

export default function FilterPanel({ filters, onFilterChange }: FilterPanelProps) {
  const ratingOptions = [
    { value: 3.0, label: "3.0以上" },
    { value: 3.5, label: "3.5以上" },
    { value: 4.0, label: "4.0以上" },
    { value: 4.3, label: "4.3以上" },
    { value: 4.5, label: "4.5以上" },
  ]

  const genreOptions = [
    { value: "和食", label: "和食" },
    { value: "洋食", label: "洋食" },
    { value: "中華", label: "中華" },
    { value: "カフェ", label: "カフェ" },
    { value: "ファストフード", label: "ファストフード" },
  ]

  const priceOptions = [
    { value: "￥〜1000", label: "〜￥1000" },
    { value: "￥〜2000", label: "〜￥2000" },
    { value: "￥〜3000", label: "〜￥3000" },
    { value: "￥3000〜", label: "￥3000〜" },
  ]

  const toggleGenre = (genre: string) => {
    const newGenres = filters.selectedGenres.includes(genre)
      ? filters.selectedGenres.filter((g) => g !== genre)
      : [...filters.selectedGenres, genre]

    onFilterChange({ selectedGenres: newGenres })
  }

  return (
    <div className="mb-6 bg-white rounded-lg shadow p-4">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Switch
            id="open-only"
            checked={filters.showOpenOnly}
            onCheckedChange={(checked) => onFilterChange({ showOpenOnly: checked })}
          />
          <Label htmlFor="open-only">営業中のみ</Label>
        </div>
        <div className="flex items-center space-x-2">
          <button
            className={`px-3 py-1 text-sm rounded-full ${
              filters.sortBy === "distance" ? "bg-gray-800 text-white" : "bg-gray-200"
            }`}
            onClick={() => onFilterChange({ sortBy: "distance" })}
          >
            距離順
          </button>
          <button
            className={`px-3 py-1 text-sm rounded-full ${
              filters.sortBy === "rating" ? "bg-gray-800 text-white" : "bg-gray-200"
            }`}
            onClick={() => onFilterChange({ sortBy: "rating" })}
          >
            評価順
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-medium mb-2">評価</h3>
          <div className="flex flex-wrap gap-2">
            {ratingOptions.map((option) => (
              <Badge
                key={option.value}
                variant={filters.minRating === option.value ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => onFilterChange({ minRating: option.value })}
              >
                {option.label}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">ジャンル</h3>
          <div className="flex flex-wrap gap-2">
            {genreOptions.map((option) => (
              <Badge
                key={option.value}
                variant={filters.selectedGenres.includes(option.value) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleGenre(option.value)}
              >
                {option.label}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">価格帯</h3>
          <div className="flex flex-wrap gap-2">
            {priceOptions.map((option) => (
              <Badge
                key={option.value}
                variant={filters.priceRange === option.value ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => onFilterChange({ priceRange: option.value })}
              >
                {option.label}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

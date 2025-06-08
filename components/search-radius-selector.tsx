"use client"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface SearchRadiusSelectorProps {
  radius: number
  onChange: (radius: number) => void
}

export default function SearchRadiusSelector({ radius, onChange }: SearchRadiusSelectorProps) {
  const radiusOptions = [
    { value: 200, label: "200m" },
    { value: 500, label: "500m" },
    { value: 1000, label: "1km" },
    { value: 2000, label: "2km" },
  ]

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <h3 className="text-sm font-medium mb-3">検索範囲</h3>
      <RadioGroup
        value={radius.toString()}
        onValueChange={(value) => onChange(Number.parseInt(value))}
        className="flex flex-wrap gap-4"
      >
        {radiusOptions.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem value={option.value.toString()} id={`radius-${option.value}`} />
            <Label htmlFor={`radius-${option.value}`}>{option.label}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}

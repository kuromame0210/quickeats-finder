import { MapPin } from "lucide-react"

export default function Header() {
  return (
    <header className="bg-white shadow-sm py-4">
      <div className="container mx-auto px-4 flex justify-between items-center max-w-3xl">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-rose-600">QuickEats Finder</h1>
        </div>
        <div className="flex items-center text-gray-600">
          <MapPin className="h-5 w-5 mr-1" />
          <span className="text-sm">現在地</span>
        </div>
      </div>
    </header>
  )
}

import { MapPin } from "lucide-react"
import AdBanner from "./ad-banner"

export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-rose-600">QuickEats Finder</h1>
          </div>
          <div className="flex items-center text-gray-600">
            <MapPin className="h-5 w-5 mr-1" />
            <span className="text-sm">現在地</span>
          </div>
        </div>
        
        {/* ヘッダー広告は常時表示 */}
        <div className="pb-4">
          <AdBanner
            slot="1234567890"
            format="horizontal"
            className="h-20"
          />
        </div>
      </div>
    </header>
  )
}

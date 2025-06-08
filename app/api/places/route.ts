import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const lat = searchParams.get("lat")
  const lng = searchParams.get("lng")
  const radius = searchParams.get("radius") || "200"

  if (!lat || !lng) {
    return NextResponse.json({ error: "Latitude and longitude are required" }, { status: 400 })
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    return NextResponse.json({ error: "Google Maps API key not configured" }, { status: 500 })
  }

  try {
    let allRestaurants: any[] = []
    let nextPageToken: string | undefined = undefined
    let pageCount = 0
    const maxPages = 3 // 最大60件（20件×3ページ）

    do {
      let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=restaurant&key=${apiKey}&language=ja`
      
      if (nextPageToken) {
        url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken=${nextPageToken}&key=${apiKey}&language=ja`
        // next_page_tokenを使用する際は少し待機が必要
        await new Promise(resolve => setTimeout(resolve, 2000))
      }

      const response = await fetch(url)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error_message || "Failed to fetch places")
      }

      if (data.results) {
        allRestaurants.push(...data.results)
      }

      nextPageToken = data.next_page_token
      pageCount++
    } while (nextPageToken && pageCount < maxPages)

    // Google Places APIのレスポンスを我々のRestaurant型に変換
    const restaurants = allRestaurants
      .filter((place: any) => place.rating >= 3.0) // 3.0以上の評価のみ
      .map((place: any) => ({
        id: place.place_id,
        name: place.name,
        rating: place.rating || 4.0,
        reviewCount: place.user_ratings_total || 0,
        distance: calculateDistance(
          Number.parseFloat(lat),
          Number.parseFloat(lng),
          place.geometry.location.lat,
          place.geometry.location.lng,
        ),
        walkTime: calculateWalkTime(
          calculateDistance(
            Number.parseFloat(lat),
            Number.parseFloat(lng),
            place.geometry.location.lat,
            place.geometry.location.lng,
          ),
        ),
        isOpen: place.opening_hours?.open_now ?? true,
        cuisine: mapPlaceTypeToGenre(place.types),
        priceRange: mapPriceLevelToRange(place.price_level),
        address: place.vicinity || place.formatted_address || "住所不明",
        phone: "電話番号取得中...",
        hours: place.opening_hours?.open_now ? "営業時間を確認中..." : "営業時間外",
        photoUrl: place.photos?.[0]
          ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${apiKey}`
          : "/placeholder.svg?height=200&width=400",
        description: `${place.name}の詳細情報`,
      }))

    return NextResponse.json({ restaurants })
  } catch (error) {
    console.error("Error fetching places:", error)
    return NextResponse.json({ error: "Failed to fetch restaurant data" }, { status: 500 })
  }
}

// 2点間の距離を計算（メートル）
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): string {
  const R = 6371e3 // 地球の半径（メートル）
  const φ1 = (lat1 * Math.PI) / 180
  const φ2 = (lat2 * Math.PI) / 180
  const Δφ = ((lat2 - lat1) * Math.PI) / 180
  const Δλ = ((lng2 - lng1) * Math.PI) / 180

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  const distance = R * c
  return `${Math.round(distance)}m`
}

// 距離から徒歩時間を計算
function calculateWalkTime(distance: string): string {
  const meters = Number.parseInt(distance.replace("m", ""))
  const minutes = Math.ceil(meters / 80) // 徒歩80m/分として計算
  return `${minutes}分`
}

// Google Places APIのtypeを我々のジャンルにマッピング
function mapPlaceTypeToGenre(types: string[]): string {
  if (types.includes("meal_takeaway") || types.includes("fast_food")) return "ファストフード"
  if (types.includes("cafe")) return "カフェ"
  if (types.includes("bakery")) return "カフェ"
  if (types.includes("bar")) return "和食"
  return "洋食" // デフォルト
}

// price_levelを価格帯にマッピング
function mapPriceLevelToRange(priceLevel?: number): string {
  switch (priceLevel) {
    case 1:
      return "￥〜1000"
    case 2:
      return "￥〜2000"
    case 3:
      return "￥〜3000"
    case 4:
      return "￥3000〜"
    default:
      return "￥〜2000"
  }
}

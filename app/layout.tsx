import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

export const metadata: Metadata = {
  title: 'QuickEats Finder - 周辺の美味しいお店を簡単検索',
  description: '現在地から近くの美味しいレストランを簡単に検索できるアプリです。営業時間、評価、ジャンル別フィルターで理想のお店を見つけましょう。',
  keywords: 'レストラン検索, グルメ, 飲食店, 現在地, 周辺検索, 美味しい, 食事',
  authors: [{ name: 'QuickEats Finder' }],
  creator: 'QuickEats Finder',
  publisher: 'QuickEats Finder',
  openGraph: {
    title: 'QuickEats Finder - 周辺の美味しいお店を簡単検索',
    description: '現在地から近くの美味しいレストランを簡単に検索できるアプリです。営業時間、評価、ジャンル別フィルターで理想のお店を見つけましょう。',
    type: 'website',
    locale: 'ja_JP',
    siteName: 'QuickEats Finder',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QuickEats Finder - 周辺の美味しいお店を簡単検索',
    description: '現在地から近くの美味しいレストランを簡単に検索できるアプリです。営業時間、評価、ジャンル別フィルターで理想のお店を見つけましょう。',
    creator: '@quickeats_finder',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <head>
        {process.env.NEXT_PUBLIC_ADSENSE_ID && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </head>
      <body>{children}</body>
    </html>
  )
}

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import AuthProvider from '@/components/AuthProvider'
// import PageTransition from '@/components/animations/PageTransition'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Akira X Taekwondo 胜灵跆拳道 - Singapore Premier Academy',
  description: 'Affiliate of Singapore Taekwondo Federation. Dedicated to promoting Taekwondo with excellence and integrity. Character-building programs that instill integrity, discipline, and sportsmanship.',
  keywords: 'taekwondo, martial arts, Akira X, 胜灵跆拳道, Singapore Taekwondo Federation, training, classes, self defense, character building, integrity, discipline',
  authors: [{ name: 'Akira X Taekwondo 胜灵跆拳道' }],
  creator: 'Akira X Taekwondo 胜灵跆拳道',
  publisher: 'Akira X Taekwondo 胜灵跆拳道',
  icons: {
    icon: [
      { url: '/img/logo.jpg', sizes: '32x32', type: 'image/jpeg' },
      { url: '/img/logo.jpg', sizes: '16x16', type: 'image/jpeg' },
    ],
    apple: [
      { url: '/img/logo.jpg', sizes: '180x180', type: 'image/jpeg' },
    ],
    other: [
      {
        rel: 'apple-touch-icon-precomposed',
        url: '/img/logo.jpg',
      },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'en_SG',
    url: 'https://akiraxtkd.pages.dev',
    title: 'Akira X Taekwondo 胜灵跆拳道 - Singapore Premier Academy',
    description: 'Affiliate of Singapore Taekwondo Federation. Dedicated to promoting Taekwondo with excellence and integrity.',
    images: [
      {
        url: '/img/logo.jpg',
        width: 1200,
        height: 630,
        alt: 'Akira X Taekwondo Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Akira X Taekwondo 胜灵跆拳道 - Singapore Premier Academy',
    description: 'Affiliate of Singapore Taekwondo Federation. Dedicated to promoting Taekwondo with excellence and integrity.',
    images: ['/img/logo.jpg'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}

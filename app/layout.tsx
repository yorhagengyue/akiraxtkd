import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import AuthProvider from '@/components/AuthProvider'
// import PageTransition from '@/components/animations/PageTransition'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Akira X Taekwondo - Premier Taekwondo Training',
  description: 'Professional taekwondo academy offering world-class training programs for all ages. Expert instructors and comprehensive programs for every skill level.',
  keywords: 'taekwondo, martial arts, Akira X, training, classes, self defense',
  authors: [{ name: 'Akira X Taekwondo' }],
  creator: 'Akira X Taekwondo',
  publisher: 'Akira X Taekwondo',
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
    title: 'Akira X Taekwondo - Premier Taekwondo Training',
    description: 'Professional taekwondo academy offering world-class training programs for all ages.',
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
    title: 'Akira X Taekwondo - Premier Taekwondo Training',
    description: 'Professional taekwondo academy offering world-class training programs for all ages.',
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

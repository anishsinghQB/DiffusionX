import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'AI Creative Studio',
  description: 'Generate stunning images with AI-powered Stable Diffusion technology',
}

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <body cz-shortcut-listen="true" className={inter.className}>{children}</body>
    </html>
  )
} 
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'ユーザー管理システム',
  description: '外部ユーザーを管理するシステム',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}

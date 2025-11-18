import type { Metadata } from 'next'
import { Inter, Noto_Sans_Thai } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { I18nProvider } from '@/lib/i18n/I18nProvider'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const notoSansThai = Noto_Sans_Thai({ 
  subsets: ['thai', 'latin'],
  variable: '--font-noto-thai',
})

export const metadata: Metadata = {
  title: 'แพลตฟอร์มบริการท่องเที่ยวเชียงใหม่',
  description: 'ศูนย์กลางสำหรับค้นหา จอง และจัดการบริการท่องเที่ยวท้องถิ่นในเชียงใหม่',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th" className={`${inter.variable} ${notoSansThai.variable}`}>
      <body>
        <Providers>
          <I18nProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
          </I18nProvider>
        </Providers>
      </body>
    </html>
  )
}


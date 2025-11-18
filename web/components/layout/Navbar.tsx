'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, User, Menu, X, Bell } from 'lucide-react'
import { useState } from 'react'
import { LanguageSwitcher } from './LanguageSwitcher'
import { NotificationBell } from './NotificationBell'
import { useAuthStore } from '@/lib/store/authStore'
import { useRouter } from 'next/navigation'

export function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  const isActive = (path: string) => pathname === path
  const dashboardHref =
    user?.role === 'admin'
      ? '/admin/dashboard'
      : user?.role === 'merchant'
      ? '/merchant/dashboard'
      : '/user/dashboard'

  return (
    <nav className="bg-white border-b border-neutral-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-primary-600">
            ChiangMaiGo
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/services"
              className={`hover:text-primary-600 transition-colors ${
                isActive('/services') ? 'text-primary-600 font-medium' : 'text-neutral-700'
              }`}
            >
              บริการ
            </Link>
            <Link
              href="/faq"
              className={`hover:text-primary-600 transition-colors ${
                isActive('/faq') ? 'text-primary-600 font-medium' : 'text-neutral-700'
              }`}
            >
              คำถามที่พบบ่อย
            </Link>
            <Link
              href="/support"
              className={`hover:text-primary-600 transition-colors ${
                isActive('/support') ? 'text-primary-600 font-medium' : 'text-neutral-700'
              }`}
            >
              ติดต่อเรา
            </Link>
          </div>
          
          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <button className="p-2 hover:bg-neutral-100 rounded-lg">
              <Search className="w-5 h-5" />
            </button>
            {!user ? (
              <>
                <Link
                  href="/login"
                  className="hidden md:block px-4 py-2 text-neutral-700 hover:text-primary-600 transition-colors"
                >
                  เข้าสู่ระบบ
                </Link>
                <Link href="/register" className="hidden md:block btn-primary">
                  สมัครสมาชิก
                </Link>
              </>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <NotificationBell />
                <Link
                  href={dashboardHref}
                  className="px-3 py-2 text-neutral-700 hover:text-primary-600 transition-colors"
                >
                  {user.name || 'บัญชีของฉัน'}
                </Link>
                <button
                  onClick={() => {
                    logout()
                    router.push('/')
                  }}
                  className="px-3 py-2 text-neutral-700 hover:text-primary-600 transition-colors"
                >
                  ออกจากระบบ
                </button>
                <Link href={dashboardHref} className="p-2 hover:bg-neutral-100 rounded-lg">
                  <User className="w-5 h-5" />
                </Link>
              </div>
            )}
            
            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 hover:bg-neutral-100 rounded-lg"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-neutral-200 py-4 space-y-2">
            <Link
              href="/services"
              className="block px-4 py-2 hover:bg-neutral-50 rounded-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              บริการ
            </Link>
            <Link
              href="/faq"
              className="block px-4 py-2 hover:bg-neutral-50 rounded-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              คำถามที่พบบ่อย
            </Link>
            <Link
              href="/support"
              className="block px-4 py-2 hover:bg-neutral-50 rounded-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              ติดต่อเรา
            </Link>
            <div className="border-t border-neutral-200 pt-2 mt-2 space-y-2">
              {!user ? (
                <>
                  <Link
                    href="/login"
                    className="block px-4 py-2 hover:bg-neutral-50 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    เข้าสู่ระบบ
                  </Link>
                  <Link
                    href="/register"
                    className="block px-4 py-2 bg-primary-600 text-white rounded-lg text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    สมัครสมาชิก
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/user/notifications"
                    className="block px-4 py-2 hover:bg-neutral-50 rounded-lg flex items-center gap-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Bell className="w-4 h-4" />
                    การแจ้งเตือน
                  </Link>
                  <Link
                    href={dashboardHref}
                    className="block px-4 py-2 hover:bg-neutral-50 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    ไปยังแดชบอร์ด
                  </Link>
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-neutral-50 rounded-lg"
                    onClick={() => {
                      setIsMenuOpen(false)
                      logout()
                      router.push('/')
                    }}
                  >
                    ออกจากระบบ
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}


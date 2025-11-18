import Link from 'next/link'
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">ChiangMaiGo</h3>
            <p className="text-sm mb-4">
              แพลตฟอร์มศูนย์กลางสำหรับค้นหา จอง และจัดการบริการท่องเที่ยวท้องถิ่นในเชียงใหม่
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-primary-400 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">ลิงก์ด่วน</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/services" className="hover:text-primary-400 transition-colors">
                  บริการท่องเที่ยว
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-primary-400 transition-colors">
                  คำถามที่พบบ่อย
                </Link>
              </li>
              <li>
                <Link href="/support" className="hover:text-primary-400 transition-colors">
                  ติดต่อเรา
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary-400 transition-colors">
                  เกี่ยวกับเรา
                </Link>
              </li>
            </ul>
          </div>
          
          {/* For Business */}
          <div>
            <h3 className="text-white font-semibold mb-4">สำหรับธุรกิจ</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/merchant/register" className="hover:text-primary-400 transition-colors">
                  สมัครเป็นผู้ประกอบการ
                </Link>
              </li>
              <li>
                <Link href="/merchant/dashboard" className="hover:text-primary-400 transition-colors">
                  เข้าสู่ระบบผู้ประกอบการ
                </Link>
              </li>
              <li>
                <Link href="/advertise" className="hover:text-primary-400 transition-colors">
                  โฆษณากับเรา
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">ติดต่อเรา</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>เชียงใหม่, ประเทศไทย</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>02-123-4567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>support@chiangmaigo.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-neutral-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>© 2024 ChiangMaiGo สงวนลิขสิทธิ์</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="/terms" className="hover:text-primary-400 transition-colors">
              ข้อกำหนดและเงื่อนไข
            </Link>
            <Link href="/privacy" className="hover:text-primary-400 transition-colors">
              นโยบายความเป็นส่วนตัว
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}


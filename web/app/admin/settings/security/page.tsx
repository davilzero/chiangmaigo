'use client'

import { useState } from 'react'
import { Save, Shield, Lock, Key, Ban } from 'lucide-react'

export default function AdminSecuritySettingsPage() {
  const [settings, setSettings] = useState({
    passwordPolicy: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
    },
    mfa: {
      enabled: false,
      requiredForAdmin: true,
    },
    session: {
      timeout: 30, // minutes
      maxConcurrentSessions: 3,
    },
    ssl: {
      enabled: true,
      certificateExpiry: '2024-12-31',
    },
  })

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">ตั้งค่าความปลอดภัย (Admin Only!)</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card space-y-2">
              <a href="/admin/settings" className="block px-4 py-2 hover:bg-neutral-50 rounded-lg">
                ตั้งค่าทั่วไป
              </a>
              <a href="/admin/settings/payment" className="block px-4 py-2 hover:bg-neutral-50 rounded-lg">
                ตั้งค่าชำระเงิน
              </a>
              <a href="/admin/settings/security" className="block px-4 py-2 bg-primary-50 text-primary-700 rounded-lg font-medium">
                ความปลอดภัย
              </a>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Password Policy */}
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <Lock className="w-5 h-5 text-primary-600" />
                <h2 className="text-xl font-bold">นโยบายรหัสผ่าน</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">ความยาวขั้นต่ำ</label>
                  <input
                    type="number"
                    className="input"
                    value={settings.passwordPolicy.minLength}
                    onChange={(e) => setSettings({
                      ...settings,
                      passwordPolicy: {
                        ...settings.passwordPolicy,
                        minLength: parseInt(e.target.value)
                      }
                    })}
                    min="6"
                    max="32"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="rounded"
                      checked={settings.passwordPolicy.requireUppercase}
                      onChange={(e) => setSettings({
                        ...settings,
                        passwordPolicy: {
                          ...settings.passwordPolicy,
                          requireUppercase: e.target.checked
                        }
                      })}
                    />
                    <span>ต้องมีตัวอักษรพิมพ์ใหญ่</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="rounded"
                      checked={settings.passwordPolicy.requireLowercase}
                      onChange={(e) => setSettings({
                        ...settings,
                        passwordPolicy: {
                          ...settings.passwordPolicy,
                          requireLowercase: e.target.checked
                        }
                      })}
                    />
                    <span>ต้องมีตัวอักษรพิมพ์เล็ก</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="rounded"
                      checked={settings.passwordPolicy.requireNumbers}
                      onChange={(e) => setSettings({
                        ...settings,
                        passwordPolicy: {
                          ...settings.passwordPolicy,
                          requireNumbers: e.target.checked
                        }
                      })}
                    />
                    <span>ต้องมีตัวเลข</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="rounded"
                      checked={settings.passwordPolicy.requireSpecialChars}
                      onChange={(e) => setSettings({
                        ...settings,
                        passwordPolicy: {
                          ...settings.passwordPolicy,
                          requireSpecialChars: e.target.checked
                        }
                      })}
                    />
                    <span>ต้องมีอักขระพิเศษ</span>
                  </label>
                </div>
              </div>
            </div>
            
            {/* MFA */}
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-primary-600" />
                <h2 className="text-xl font-bold">Multi-Factor Authentication (MFA)</h2>
              </div>
              
              <div className="space-y-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="rounded"
                    checked={settings.mfa.enabled}
                    onChange={(e) => setSettings({
                      ...settings,
                      mfa: { ...settings.mfa, enabled: e.target.checked }
                    })}
                  />
                  <span>เปิดใช้งาน MFA</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="rounded"
                    checked={settings.mfa.requiredForAdmin}
                    onChange={(e) => setSettings({
                      ...settings,
                      mfa: { ...settings.mfa, requiredForAdmin: e.target.checked }
                    })}
                  />
                  <span>บังคับใช้สำหรับ Admin</span>
                </label>
              </div>
            </div>
            
            {/* Session Management */}
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <Key className="w-5 h-5 text-primary-600" />
                <h2 className="text-xl font-bold">การจัดการเซสชันผู้ใช้</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Session Timeout (นาที)</label>
                  <input
                    type="number"
                    className="input"
                    value={settings.session.timeout}
                    onChange={(e) => setSettings({
                      ...settings,
                      session: {
                        ...settings.session,
                        timeout: parseInt(e.target.value)
                      }
                    })}
                    min="5"
                    max="1440"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">จำนวนเซสชันพร้อมกันสูงสุด</label>
                  <input
                    type="number"
                    className="input"
                    value={settings.session.maxConcurrentSessions}
                    onChange={(e) => setSettings({
                      ...settings,
                      session: {
                        ...settings.session,
                        maxConcurrentSessions: parseInt(e.target.value)
                      }
                    })}
                    min="1"
                    max="10"
                  />
                </div>
              </div>
            </div>
            
            {/* SSL/TLS */}
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-primary-600" />
                <h2 className="text-xl font-bold">การจัดการใบรับรอง SSL/TLS</h2>
              </div>
              
              <div className="space-y-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="rounded"
                    checked={settings.ssl.enabled}
                    onChange={(e) => setSettings({
                      ...settings,
                      ssl: { ...settings.ssl, enabled: e.target.checked }
                    })}
                  />
                  <span>เปิดใช้งาน SSL/TLS</span>
                </label>
                <div>
                  <label className="block text-sm font-medium mb-2">วันหมดอายุใบรับรอง</label>
                  <input
                    type="date"
                    className="input"
                    value={settings.ssl.certificateExpiry}
                    onChange={(e) => setSettings({
                      ...settings,
                      ssl: { ...settings.ssl, certificateExpiry: e.target.value }
                    })}
                  />
                </div>
              </div>
            </div>
            
            {/* IP Blocking */}
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <Ban className="w-5 h-5 text-primary-600" />
                <h2 className="text-xl font-bold">ไฟร์วอลล์/บล็อก IP</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">IP Addresses ที่ถูกบล็อก</label>
                  <textarea
                    rows={4}
                    className="input"
                    placeholder="192.168.1.1&#10;10.0.0.1"
                  />
                  <p className="text-xs text-neutral-500 mt-1">ใส่ IP address แต่ละบรรทัด</p>
                </div>
              </div>
            </div>
            
            <button className="btn-primary w-full flex items-center justify-center gap-2">
              <Save className="w-4 h-4" />
              บันทึกการตั้งค่า
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}



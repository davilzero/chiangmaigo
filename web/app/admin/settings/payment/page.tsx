'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Save, History, CreditCard, CheckCircle, XCircle } from 'lucide-react'
import { useAuthStore } from '@/lib/store/authStore'
import { logEditHistory } from '@/lib/utils/editHistory'

export default function AdminPaymentSettingsPage() {
  const { user } = useAuthStore()
  const [settings, setSettings] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('admin-payment-settings')
      if (saved) {
        return JSON.parse(saved)
      }
    }
    return {
      stripe: {
        enabled: true,
        apiKey: 'sk_test_...',
        webhookSecret: 'whsec_...',
        status: 'connected',
      },
      paypal: {
        enabled: false,
        clientId: '',
        clientSecret: '',
        status: 'disconnected',
      },
      omise: {
        enabled: true,
        publicKey: 'pkey_test_...',
        secretKey: 'skey_test_...',
        status: 'connected',
      },
      promptpay: {
        enabled: true,
        qrCode: '',
        accountName: 'บริษัท เชียงใหม่โก จำกัด',
        accountNumber: '123-456-7890',
        bankName: 'ธนาคารกรุงเทพ',
      },
      bankTransfer: {
        enabled: true,
        accounts: [
          {
            bankName: 'ธนาคารกรุงเทพ',
            accountNumber: '123-456-7890',
            accountName: 'บริษัท เชียงใหม่โก จำกัด',
            branch: 'สาขาเชียงใหม่',
          },
          {
            bankName: 'ธนาคารกสิกรไทย',
            accountNumber: '987-654-3210',
            accountName: 'บริษัท เชียงใหม่โก จำกัด',
            branch: 'สาขาเชียงใหม่',
          },
        ],
      },
    }
  })

  const handleSave = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin-payment-settings', JSON.stringify(settings))
      
      // Log edit history
      if (user) {
        logEditHistory({
          userId: user.id,
          userName: user.name,
          userRole: user.role,
          action: 'update',
          entityType: 'payment-settings',
          entityId: 'all',
        })
      }
      
      alert('บันทึกการตั้งค่าเรียบร้อยแล้ว')
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">ตั้งค่าระบบชำระเงิน (Admin Only!)</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card space-y-2">
              <a href="/admin/settings" className="block px-4 py-2 hover:bg-neutral-50 rounded-lg">
                ตั้งค่าทั่วไป
              </a>
              <a href="/admin/settings/payment" className="block px-4 py-2 bg-primary-50 text-primary-700 rounded-lg font-medium">
                ตั้งค่าชำระเงิน
              </a>
              <a href="/admin/settings/security" className="block px-4 py-2 hover:bg-neutral-50 rounded-lg">
                ความปลอดภัย
              </a>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Stripe */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-6 h-6 text-primary-600" />
                  <h2 className="text-xl font-bold">Stripe</h2>
                </div>
                <div className="flex items-center gap-2">
                  {settings.stripe.status === 'connected' ? (
                    <span className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      เชื่อมต่อแล้ว
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-600">
                      <XCircle className="w-5 h-5" />
                      ไม่ได้เชื่อมต่อ
                    </span>
                  )}
                </div>
              </div>
              
              <form className="space-y-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="rounded"
                    checked={settings.stripe.enabled}
                    onChange={(e) => setSettings({
                      ...settings,
                      stripe: { ...settings.stripe, enabled: e.target.checked }
                    })}
                  />
                  <span>เปิดใช้งาน Stripe</span>
                </label>
                
                <div>
                  <label className="block text-sm font-medium mb-2">API Key</label>
                  <input
                    type="password"
                    className="input"
                    value={settings.stripe.apiKey}
                    onChange={(e) => setSettings({
                      ...settings,
                      stripe: { ...settings.stripe, apiKey: e.target.value }
                    })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Webhook Secret</label>
                  <input
                    type="password"
                    className="input"
                    value={settings.stripe.webhookSecret}
                    onChange={(e) => setSettings({
                      ...settings,
                      stripe: { ...settings.stripe, webhookSecret: e.target.value }
                    })}
                  />
                </div>
                
                <button type="button" className="btn-secondary">
                  ทดสอบการเชื่อมต่อ
                </button>
              </form>
            </div>
            
            {/* PayPal */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-6 h-6 text-primary-600" />
                  <h2 className="text-xl font-bold">PayPal</h2>
                </div>
                <div className="flex items-center gap-2">
                  {settings.paypal.status === 'connected' ? (
                    <span className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      เชื่อมต่อแล้ว
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-600">
                      <XCircle className="w-5 h-5" />
                      ไม่ได้เชื่อมต่อ
                    </span>
                  )}
                </div>
              </div>
              
              <form className="space-y-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="rounded"
                    checked={settings.paypal.enabled}
                    onChange={(e) => setSettings({
                      ...settings,
                      paypal: { ...settings.paypal, enabled: e.target.checked }
                    })}
                  />
                  <span>เปิดใช้งาน PayPal</span>
                </label>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Client ID</label>
                  <input
                    type="text"
                    className="input"
                    value={settings.paypal.clientId}
                    onChange={(e) => setSettings({
                      ...settings,
                      paypal: { ...settings.paypal, clientId: e.target.value }
                    })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Client Secret</label>
                  <input
                    type="password"
                    className="input"
                    value={settings.paypal.clientSecret}
                    onChange={(e) => setSettings({
                      ...settings,
                      paypal: { ...settings.paypal, clientSecret: e.target.value }
                    })}
                  />
                </div>
                
                <button type="button" className="btn-secondary">
                  ทดสอบการเชื่อมต่อ
                </button>
              </form>
            </div>
            
            {/* Omise */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-6 h-6 text-primary-600" />
                  <h2 className="text-xl font-bold">Omise</h2>
                </div>
                <div className="flex items-center gap-2">
                  {settings.omise.status === 'connected' ? (
                    <span className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      เชื่อมต่อแล้ว
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-600">
                      <XCircle className="w-5 h-5" />
                      ไม่ได้เชื่อมต่อ
                    </span>
                  )}
                </div>
              </div>
              
              <form className="space-y-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="rounded"
                    checked={settings.omise.enabled}
                    onChange={(e) => setSettings({
                      ...settings,
                      omise: { ...settings.omise, enabled: e.target.checked }
                    })}
                  />
                  <span>เปิดใช้งาน Omise</span>
                </label>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Public Key</label>
                  <input
                    type="text"
                    className="input"
                    value={settings.omise.publicKey}
                    onChange={(e) => setSettings({
                      ...settings,
                      omise: { ...settings.omise, publicKey: e.target.value }
                    })}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Secret Key</label>
                  <input
                    type="password"
                    className="input"
                    value={settings.omise.secretKey}
                    onChange={(e) => setSettings({
                      ...settings,
                      omise: { ...settings.omise, secretKey: e.target.value }
                    })}
                  />
                </div>
                
                <button type="button" className="btn-secondary">
                  ทดสอบการเชื่อมต่อ
                </button>
              </form>
            </div>
            
            {/* PromptPay */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-6 h-6 text-primary-600" />
                  <h2 className="text-xl font-bold">พร้อมเพย์ (PromptPay)</h2>
                </div>
              </div>
              
              <form className="space-y-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="rounded"
                    checked={settings.promptpay.enabled}
                    onChange={(e) => setSettings({
                      ...settings,
                      promptpay: { ...settings.promptpay, enabled: e.target.checked }
                    })}
                  />
                  <span>เปิดใช้งานพร้อมเพย์</span>
                </label>
                
                <div>
                  <label className="block text-sm font-medium mb-2">ชื่อบัญชี</label>
                  <input
                    type="text"
                    className="input"
                    value={settings.promptpay.accountName}
                    onChange={(e) => setSettings({
                      ...settings,
                      promptpay: { ...settings.promptpay, accountName: e.target.value }
                    })}
                    placeholder="ชื่อบัญชี"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">หมายเลขพร้อมเพย์/เบอร์โทร</label>
                  <input
                    type="text"
                    className="input"
                    value={settings.promptpay.accountNumber}
                    onChange={(e) => setSettings({
                      ...settings,
                      promptpay: { ...settings.promptpay, accountNumber: e.target.value }
                    })}
                    placeholder="0812345678 หรือ 1234567890"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">ชื่อธนาคาร</label>
                  <input
                    type="text"
                    className="input"
                    value={settings.promptpay.bankName}
                    onChange={(e) => setSettings({
                      ...settings,
                      promptpay: { ...settings.promptpay, bankName: e.target.value }
                    })}
                    placeholder="ธนาคารกรุงเทพ"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">QR Code (URL หรือ Base64)</label>
                  <input
                    type="text"
                    className="input"
                    value={settings.promptpay.qrCode}
                    onChange={(e) => setSettings({
                      ...settings,
                      promptpay: { ...settings.promptpay, qrCode: e.target.value }
                    })}
                    placeholder="https://example.com/qr.png หรือ data:image/png;base64,..."
                  />
                  <p className="text-xs text-neutral-500 mt-1">
                    อัปโหลด QR Code ของพร้อมเพย์ (จะแสดงในหน้าชำระเงิน)
                  </p>
                </div>
              </form>
            </div>
            
            {/* Bank Transfer */}
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-6 h-6 text-primary-600" />
                  <h2 className="text-xl font-bold">โอนผ่านธนาคาร</h2>
                </div>
              </div>
              
              <form className="space-y-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className="rounded"
                    checked={settings.bankTransfer.enabled}
                    onChange={(e) => setSettings({
                      ...settings,
                      bankTransfer: { ...settings.bankTransfer, enabled: e.target.checked }
                    })}
                  />
                  <span>เปิดใช้งานโอนผ่านธนาคาร</span>
                </label>
                
                <div>
                  <label className="block text-sm font-medium mb-2">บัญชีธนาคาร</label>
                  <div className="space-y-3">
                    {settings.bankTransfer.accounts.map((account: any, index: number) => (
                      <div key={index} className="border border-neutral-200 rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">บัญชีที่ {index + 1}</h3>
                          {settings.bankTransfer.accounts.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const newAccounts = settings.bankTransfer.accounts.filter((_: any, i: number) => i !== index)
                                setSettings({
                                  ...settings,
                                  bankTransfer: { ...settings.bankTransfer, accounts: newAccounts }
                                })
                              }}
                              className="text-red-600 hover:text-red-700 text-sm"
                            >
                              ลบ
                            </button>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">ชื่อธนาคาร</label>
                          <input
                            type="text"
                            className="input"
                            value={account.bankName}
                            onChange={(e) => {
                              const newAccounts = [...settings.bankTransfer.accounts]
                              newAccounts[index].bankName = e.target.value
                              setSettings({
                                ...settings,
                                bankTransfer: { ...settings.bankTransfer, accounts: newAccounts }
                              })
                            }}
                            placeholder="ธนาคารกรุงเทพ"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">เลขที่บัญชี</label>
                          <input
                            type="text"
                            className="input"
                            value={account.accountNumber}
                            onChange={(e) => {
                              const newAccounts = [...settings.bankTransfer.accounts]
                              newAccounts[index].accountNumber = e.target.value
                              setSettings({
                                ...settings,
                                bankTransfer: { ...settings.bankTransfer, accounts: newAccounts }
                              })
                            }}
                            placeholder="123-456-7890"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">ชื่อบัญชี</label>
                          <input
                            type="text"
                            className="input"
                            value={account.accountName}
                            onChange={(e) => {
                              const newAccounts = [...settings.bankTransfer.accounts]
                              newAccounts[index].accountName = e.target.value
                              setSettings({
                                ...settings,
                                bankTransfer: { ...settings.bankTransfer, accounts: newAccounts }
                              })
                            }}
                            placeholder="ชื่อบัญชี"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">สาขา</label>
                          <input
                            type="text"
                            className="input"
                            value={account.branch}
                            onChange={(e) => {
                              const newAccounts = [...settings.bankTransfer.accounts]
                              newAccounts[index].branch = e.target.value
                              setSettings({
                                ...settings,
                                bankTransfer: { ...settings.bankTransfer, accounts: newAccounts }
                              })
                            }}
                            placeholder="สาขาเชียงใหม่"
                          />
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setSettings({
                          ...settings,
                          bankTransfer: {
                            ...settings.bankTransfer,
                            accounts: [
                              ...settings.bankTransfer.accounts,
                              {
                                bankName: '',
                                accountNumber: '',
                                accountName: '',
                                branch: '',
                              }
                            ]
                          }
                        })
                      }}
                      className="btn-secondary w-full"
                    >
                      + เพิ่มบัญชีธนาคาร
                    </button>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
              <Link
                href="/admin/settings/edit-history"
                className="text-sm text-primary-600 hover:underline flex items-center gap-2"
              >
                <History className="w-4 h-4" />
                ประวัติการแก้ไข
              </Link>
              <button onClick={handleSave} className="btn-primary flex items-center gap-2">
                <Save className="w-4 h-4" />
                บันทึกการตั้งค่า
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


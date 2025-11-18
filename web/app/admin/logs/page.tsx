'use client'

import { useState } from 'react'
import { Search, Filter, Download, AlertCircle, Info, CheckCircle, XCircle } from 'lucide-react'

export default function AdminLogsPage() {
  const [logs] = useState([
    {
      id: '1',
      type: 'error',
      message: 'Payment processing failed',
      user: 'user@example.com',
      timestamp: '2024-01-15T10:30:00',
      details: 'Payment gateway timeout',
    },
    {
      id: '2',
      type: 'info',
      message: 'User logged in',
      user: 'admin@example.com',
      timestamp: '2024-01-15T10:25:00',
      details: 'Successful login',
    },
    {
      id: '3',
      type: 'warning',
      message: 'High server load detected',
      user: 'system',
      timestamp: '2024-01-15T10:20:00',
      details: 'CPU usage: 85%',
    },
    {
      id: '4',
      type: 'success',
      message: 'Service approved',
      user: 'admin@example.com',
      timestamp: '2024-01-15T10:15:00',
      details: 'Service ID: 123',
    },
  ])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      default:
        return <Info className="w-5 h-5 text-blue-500" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'error':
        return 'bg-red-50 border-red-200'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200'
      case 'success':
        return 'bg-green-50 border-green-200'
      default:
        return 'bg-blue-50 border-blue-200'
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">บันทึกระบบ (Admin Only!)</h1>
          <button className="btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" />
            ส่งออกรายการบันทึกระบบ
          </button>
        </div>
        
        <div className="card">
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="ค้นหาบันทึก..."
                className="input pl-12"
              />
            </div>
            <select className="input w-auto">
              <option>ทุกประเภท</option>
              <option>Error</option>
              <option>Warning</option>
              <option>Info</option>
              <option>Success</option>
            </select>
            <input
              type="text"
              placeholder="ผู้ใช้ที่เกี่ยวข้อง"
              className="input w-auto"
            />
            <div className="flex gap-2">
              <input
                type="date"
                className="input w-auto"
                placeholder="จากวันที่"
              />
              <input
                type="date"
                className="input w-auto"
                placeholder="ถึงวันที่"
              />
            </div>
          </div>
          
          <div className="space-y-3">
            {logs.map((log) => (
              <div
                key={log.id}
                className={`border rounded-lg p-4 ${getTypeColor(log.type)}`}
              >
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    {getTypeIcon(log.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{log.message}</h3>
                      <span className="text-sm text-neutral-600">
                        {new Date(log.timestamp).toLocaleString('th-TH')}
                      </span>
                    </div>
                    <div className="text-sm text-neutral-700 space-y-1">
                      <p><strong>ผู้ใช้:</strong> {log.user}</p>
                      <p><strong>รายละเอียด:</strong> {log.details}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}


'use client'

import { useState } from 'react'
import { Search, Filter, Send, Paperclip, MoreVertical } from 'lucide-react'

export default function UserMessagesPage() {
  const [conversations] = useState([
    {
      id: '1',
      participant: 'ผู้ประกอบการ 1',
      lastMessage: 'ขอบคุณสำหรับการจอง',
      unreadCount: 2,
      updatedAt: '2024-01-15T10:30:00',
    },
    {
      id: '2',
      participant: 'ฝ่ายสนับสนุน',
      lastMessage: 'เราจะช่วยคุณแก้ไขปัญหา',
      unreadCount: 0,
      updatedAt: '2024-01-14T15:20:00',
    },
    {
      id: '3',
      participant: 'ผู้ประกอบการ 2',
      lastMessage: 'ยืนยันการจองของคุณ',
      unreadCount: 1,
      updatedAt: '2024-01-13T09:15:00',
    },
  ])

  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">กล่องข้อความ</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="card space-y-2">
              <a href="/user/dashboard" className="block px-4 py-2 hover:bg-neutral-50 rounded-lg">
                ภาพรวม
              </a>
              <a href="/user/notifications" className="block px-4 py-2 hover:bg-neutral-50 rounded-lg">
                การแจ้งเตือน
              </a>
              <a href="/user/messages" className="block px-4 py-2 bg-primary-50 text-primary-700 rounded-lg font-medium">
                ข้อความ
              </a>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
              {/* Conversations List */}
              <div className="lg:col-span-1 space-y-4">
                <div className="card">
                  <div className="flex gap-4 mb-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                      <input
                        type="text"
                        placeholder="ค้นหาการสนทนา..."
                        className="input pl-12"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mb-4">
                    <button className="px-3 py-1 bg-primary-600 text-white rounded text-sm">
                      ทั้งหมด
                    </button>
                    <button className="px-3 py-1 bg-white border border-neutral-300 rounded text-sm hover:bg-neutral-50">
                      ยังไม่ได้อ่าน
                    </button>
                  </div>
                  
                  <select className="input w-full mb-4">
                    <option>ทุกประเภท</option>
                    <option>ผู้ประกอบการ</option>
                    <option>ฝ่ายสนับสนุน</option>
                  </select>
                </div>
                
                <div className="space-y-2 overflow-y-auto max-h-[500px]">
                  {conversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation.id)}
                      className={`card cursor-pointer hover:bg-neutral-50 ${
                        selectedConversation === conversation.id ? 'border-l-4 border-l-primary-600' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{conversation.participant}</h3>
                            {conversation.unreadCount > 0 && (
                              <span className="px-2 py-0.5 bg-primary-600 text-white text-xs rounded-full">
                                {conversation.unreadCount}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-neutral-600 line-clamp-2">{conversation.lastMessage}</p>
                          <p className="text-xs text-neutral-500 mt-1">
                            {new Date(conversation.updatedAt).toLocaleDateString('th-TH')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Chat Window */}
              <div className="lg:col-span-2">
                {selectedConversation ? (
                  <div className="card h-full flex flex-col">
                    <div className="border-b border-neutral-200 pb-4 mb-4">
                      <h3 className="font-semibold">ผู้ประกอบการ 1</h3>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                      {[
                        { sender: 'other', message: 'สวัสดีครับ ขอบคุณสำหรับการจอง', time: '10:00' },
                        { sender: 'me', message: 'สวัสดีครับ ขอบคุณมาก', time: '10:05' },
                        { sender: 'other', message: 'การจองของคุณได้รับการยืนยันแล้ว', time: '10:10' },
                      ].map((msg, i) => (
                        <div
                          key={i}
                          className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[70%] p-3 rounded-lg ${
                              msg.sender === 'me'
                                ? 'bg-primary-600 text-white'
                                : 'bg-neutral-100 text-neutral-900'
                            }`}
                          >
                            <p>{msg.message}</p>
                            <p className={`text-xs mt-1 ${
                              msg.sender === 'me' ? 'text-primary-100' : 'text-neutral-500'
                            }`}>
                              {msg.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="border-t border-neutral-200 pt-4">
                      <div className="flex gap-2">
                        <button className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg">
                          <Paperclip className="w-5 h-5" />
                        </button>
                        <input
                          type="text"
                          placeholder="พิมพ์ข้อความ..."
                          className="input flex-1"
                        />
                        <button className="btn-primary p-2">
                          <Send className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="card h-full flex items-center justify-center">
                    <p className="text-neutral-600">เลือกการสนทนาเพื่อเริ่มแชท</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Star, Upload, X } from 'lucide-react'

export default function ReviewPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [images, setImages] = useState<string[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle review submission
    router.push('/user/bookings')
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      // Handle image upload
      const newImages = Array.from(files).map(file => URL.createObjectURL(file))
      setImages([...images, ...newImages])
    }
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">ให้คะแนนและเขียนรีวิว</h1>
          
          <div className="card mb-6">
            <div className="flex gap-4">
              <div className="w-20 h-20 bg-neutral-200 rounded-lg"></div>
              <div>
                <h2 className="font-semibold text-lg mb-1">ทัวร์ดอยสุเทพ</h2>
                <p className="text-sm text-neutral-600">วันที่: 15 ม.ค. 2024</p>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="card space-y-6">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium mb-3">
                ให้คะแนน <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`w-10 h-10 ${
                        star <= rating
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-neutral-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-sm text-neutral-600 mt-2">
                  {rating === 5 && 'ยอดเยี่ยม!'}
                  {rating === 4 && 'ดีมาก'}
                  {rating === 3 && 'ดี'}
                  {rating === 2 && 'พอใช้'}
                  {rating === 1 && 'ไม่ดี'}
                </p>
              )}
            </div>
            
            {/* Comment */}
            <div>
              <label htmlFor="comment" className="block text-sm font-medium mb-2">
                รีวิว <span className="text-red-500">*</span>
              </label>
              <textarea
                id="comment"
                rows={6}
                className="input"
                placeholder="แบ่งปันประสบการณ์ของคุณ..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />
              <p className="text-xs text-neutral-500 mt-1">
                {comment.length}/500 ตัวอักษร
              </p>
            </div>
            
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium mb-2">
                อัปโหลดรูปภาพ (ไม่บังคับ)
              </label>
              <div className="space-y-4">
                {images.length > 0 && (
                  <div className="grid grid-cols-4 gap-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-neutral-300 rounded-lg cursor-pointer hover:bg-neutral-50">
                  <Upload className="w-5 h-5 text-neutral-400" />
                  <span className="text-sm text-neutral-600">คลิกเพื่ออัปโหลดรูปภาพ</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="btn-secondary flex-1"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                disabled={rating === 0 || !comment.trim()}
                className="btn-primary flex-1"
              >
                ส่งรีวิว
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}



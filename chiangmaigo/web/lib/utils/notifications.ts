import { prisma } from '@/lib/db/prisma'

export interface CreateNotificationParams {
  userId: string
  title: string
  message: string
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR'
}

/**
 * Create a notification for a user
 */
export async function createNotification(params: CreateNotificationParams) {
  try {
    const notification = await prisma.notification.create({
      data: {
        userId: params.userId,
        title: params.title,
        message: params.message,
        type: params.type,
      },
    })
    return notification
  } catch (error) {
    console.error('Error creating notification:', error)
    // Don't throw - notifications are not critical
    return null
  }
}

/**
 * Create booking success notification
 */
export async function createBookingSuccessNotification(
  userId: string,
  bookingId: string,
  serviceName: string
) {
  try {
    return await createNotification({
      userId,
      title: 'การจองสำเร็จ',
      message: `การจองของคุณสำหรับ "${serviceName}" สำเร็จแล้ว (หมายเลข: ${bookingId})`,
      type: 'SUCCESS',
    })
  } catch (error) {
    console.error('Error creating booking success notification:', error)
    return null
  }
}

/**
 * Create booking confirmation notification
 */
export async function createBookingConfirmationNotification(
  userId: string,
  bookingId: string,
  serviceName: string
) {
  return createNotification({
    userId,
    title: 'การจองได้รับการยืนยัน',
    message: `การจองของคุณสำหรับ "${serviceName}" ได้รับการยืนยันแล้ว (หมายเลข: ${bookingId})`,
    type: 'SUCCESS',
  })
}

/**
 * Create payment success notification
 */
export async function createPaymentSuccessNotification(
  userId: string,
  bookingId: string,
  amount: number
) {
  return createNotification({
    userId,
    title: 'ชำระเงินสำเร็จ',
    message: `การชำระเงินสำหรับการจองหมายเลข ${bookingId} จำนวน ฿${amount.toLocaleString()} สำเร็จแล้ว`,
    type: 'SUCCESS',
  })
}


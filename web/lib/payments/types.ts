export type PaymentGateway = 'omise' | 'stripe'

export interface CreatePaymentIntentInput {
  bookingId: string
  amount: number
  currency: string
  gateway: PaymentGateway
  metadata?: Record<string, string | number>
}

export interface PaymentIntent {
  id: string
  gateway: PaymentGateway
  amount: number
  currency: string
  clientSecret?: string
  status: 'requires_payment' | 'requires_action' | 'succeeded' | 'failed'
  bookingId: string
}

export interface PaymentProvider {
  createPaymentIntent(input: CreatePaymentIntentInput): Promise<PaymentIntent>
  // addRefund?(paymentId: string, amount?: number): Promise<any>
}




import { CreatePaymentIntentInput, PaymentIntent, PaymentProvider } from './types'

export class OmiseProvider implements PaymentProvider {
  async createPaymentIntent(input: CreatePaymentIntentInput): Promise<PaymentIntent> {
    // TODO: ใช้ Omise SDK/REST เรียกสร้าง charge/payment intent จริง
    // ใช้ process.env.OMISE_SECRET_KEY
    return {
      id: 'omise_pi_mock_123',
      gateway: 'omise',
      amount: input.amount,
      currency: input.currency,
      clientSecret: 'mock_client_secret_omise',
      status: 'requires_payment',
      bookingId: input.bookingId,
    }
  }
}




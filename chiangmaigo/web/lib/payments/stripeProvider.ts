import { CreatePaymentIntentInput, PaymentIntent, PaymentProvider } from './types'

export class StripeProvider implements PaymentProvider {
  async createPaymentIntent(input: CreatePaymentIntentInput): Promise<PaymentIntent> {
    // TODO: ใช้ Stripe SDK/REST สร้าง payment intent จริง
    // ใช้ process.env.STRIPE_API_KEY
    return {
      id: 'stripe_pi_mock_123',
      gateway: 'stripe',
      amount: input.amount,
      currency: input.currency,
      clientSecret: 'mock_client_secret_stripe',
      status: 'requires_payment',
      bookingId: input.bookingId,
    }
  }
}




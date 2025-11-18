import { PaymentGateway, PaymentProvider } from './types'
import { OmiseProvider } from './omiseProvider'
import { StripeProvider } from './stripeProvider'

export function getPaymentProvider(gateway: PaymentGateway): PaymentProvider {
  if (gateway === 'stripe') return new StripeProvider()
  return new OmiseProvider()
}




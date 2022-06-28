import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useLocation, Location } from 'react-router-dom'

import { StripeForm } from '~/components/StripeForm'

export const STRIPE_ROUTE = '/stripe'

const stripePromise = loadStripe(STRIPE_SECRET_KEY)

const SetStripe = () => {
  const location = useLocation()
  const { state } = location as Location & { state: { clientSecret?: string } }
  const options = { clientSecret: state?.clientSecret }

  return (
    <Elements stripe={stripePromise} options={options}>
      <StripeForm />
    </Elements>
  )
}

export default SetStripe

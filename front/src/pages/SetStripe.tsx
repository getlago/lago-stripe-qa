import { Elements, PaymentElement } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { Button } from '@mui/material'

export const STRIPE_ROUTE = '/stripe'

const stripePromise = loadStripe('pk_test_oKhSR5nslBRnBZpjO6KuzZeX')

const SetStripe = () => {
  const options = {
    // passing the client secret obtained in step 2
    clientSecret: '{{CLIENT_SECRET}}',
    // Fully customizable with appearance API.
    appearance: {
      /*...*/
    },
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      <form>
        <PaymentElement />
        <Button>Submit</Button>
      </form>
    </Elements>
  )
}

export default SetStripe

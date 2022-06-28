import { useState } from 'react'
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Button } from '@mui/material'
import styled from 'styled-components'

import { SUCCESS_ROUTE } from '~/pages/Success'

export const StripeForm = () => {
  const [stripeError, setStripeError] = useState<string>('')
  const stripe = useStripe()
  const elements = useElements()

  return (
    <form
      onSubmit={async (event) => {
        // We don't want to let default form submission happen here,
        // which would refresh the page.
        event.preventDefault()

        if (!stripe || !elements) {
          // Stripe.js has not yet loaded.
          // Make sure to disable form submission until Stripe.js has loaded.
          return
        }

        const { error } = await stripe.confirmSetup({
          //`Elements` instance that was used to create the Payment Element
          elements,
          confirmParams: {
            return_url: `http://192.168.1.17:8080${SUCCESS_ROUTE}`,
          },
        })

        setStripeError(JSON.stringify(error))
      }}
    >
      <PaymentElement />
      <Button type="submit" disabled={!stripe}>
        Submit
      </Button>

      {stripeError && <Error>🐞 {stripeError}</Error>}
    </form>
  )
}

const Error = styled.div`
  color: #ad1010;
  margin-top: 24px;
  white-space: pre;
  font-weight: bold;
`

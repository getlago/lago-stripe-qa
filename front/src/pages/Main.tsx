import { ChangeEvent, useEffect, useState } from 'react'
import { TextField, Button } from '@mui/material'
import { useFormik } from 'formik'
import { useNavigate } from 'react-router'
import styled from 'styled-components'

import StripeLogo from '~/public/images/stripe.svg'
import { STRIPE_ROUTE } from '~/pages/SetStripe'

let timer: number

const Main = () => {
  const [customerId, setCustomerId] = useState<string | null>(null)
  const [infosToDisplay, setInfosToDisplay] = useState<string>('')
  const [error, setError] = useState<string>('')
  const navigate = useNavigate()
  const formikProps = useFormik({
    initialValues: {
      email: '',
      name: '',
    },
    onSubmit: async (values) => {
      const futurCustomerId = String(Math.floor(Date.now() * Math.random()))

      setInfosToDisplay('Creating customer...')
      const response = await fetch(`${API_URL}/customer`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          customer_id: futurCustomerId,
          ...values,
        }),
      })

      if (response) {
        setCustomerId(futurCustomerId)
      }
    },
  })

  const getCustomer: (id: string) => Promise<void> = async () => {
    await fetch(`${API_URL}/customer/${customerId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        if (!!data?.stripe_customer_id) {
          clearInterval(timer)
          getSecretCustomerId()
        }
        if (!!data?.stripe_error) {
          clearInterval(timer)
          setError('Error : ' + data?.stripe_error?.message)
        }
      })
  }

  const getSecretCustomerId: () => Promise<void> = async () => {
    setInfosToDisplay((prev) => prev + '\nDone ✔\n\nGetting customer secret...')
    await fetch(`${API_URL}/secret/${customerId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'GET',
    })
      .then((response) => response.json())
      .then((data) => {
        if (!!data?.client_secret) {
          navigate(STRIPE_ROUTE, { state: { clientSecret: data?.client_secret } })
        }
      })
  }

  useEffect(() => {
    if (customerId) {
      setInfosToDisplay((prev) => prev + '\nDone ✔\n\nGetting customer infos...')
      timer = setInterval(getCustomer, 2000)
    }

    return () => clearInterval(timer)
  }, [customerId])

  const onChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    fieldName: string
  ) => void = (event, fieldName) => {
    const value = event.currentTarget.value

    formikProps.setFieldValue(fieldName, value)
  }

  return (
    <div>
      <Title>
        <StripeLogo height="50" />
        Welcome to Stripe QA app
      </Title>

      <Form>
        <TextField label="Name" onChange={(event) => onChange(event, 'name')} />
        <TextField label="Email" onChange={(event) => onChange(event, 'email')} />

        <Button variant="contained" onClick={formikProps.submitForm}>
          Submit
        </Button>
      </Form>
      <Infos>{infosToDisplay}</Infos>
      {error && <Error>🐞 {error}</Error>}
    </div>
  )
}

const Title = styled.h1`
  display: flex;
  align-items: center;

  > *:first-child {
    margin-right: 12px;
  }
`

const Infos = styled.div`
  margin-top: 24px;
  white-space: pre;
`

const Error = styled.div`
  color: #ad1010;
  margin-top: 24px;
  white-space: pre;
  font-weight: bold;
`

const Form = styled.form`
  display: flex;
  align-items: center;

  > * {
    margin-right: 12px;
  }
`

export default Main

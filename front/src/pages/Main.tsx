import { ChangeEvent, useEffect, useState } from 'react'
import { TextField, Button } from '@mui/material'
import { useFormik } from 'formik'

const Main = () => {
  const [customerId, setCustomerId] = useState<string | null>(null)
  const formikProps = useFormik({
    initialValues: {
      email: '',
      name: '',
    },
    onSubmit: async (values) => {
      const response = await fetch(`${API_URL}/customer`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          customer_id: customerId,
          ...values,
        }),
      })

      if (response) {
        setCustomerId(String(Math.floor(Date.now() * Math.random())))
      }
    },
  })

  const getCustomer: (id: string) => Promise<void> = async () => {
    let response = await fetch(`${API_URL}/customer/${customerId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'GET',
    })

    console.log(response)
    if (response) {
      // redirect
    }
  }

  useEffect(() => {
    let timer: number

    if (customerId) {
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
      <form>
        <TextField label="Name" onChange={(event) => onChange(event, 'name')} />
        <TextField label="Email" onChange={(event) => onChange(event, 'email')} />

        <Button variant="contained" onClick={formikProps.submitForm}>
          Submit
        </Button>
      </form>
    </div>
  )
}

export default Main

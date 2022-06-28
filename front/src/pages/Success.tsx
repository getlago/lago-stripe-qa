import styled from 'styled-components'
import { Button } from '@mui/material'
import { useNavigate } from 'react-router'

import SuccessImage from '~/public/images/success.svg'

export const SUCCESS_ROUTE = '/success'

const Success = () => {
  const navigate = useNavigate()

  return (
    <Content>
      <SuccessImage width="400" />
      <Text>It&apos;s a success !</Text>

      <StyledButton onClick={() => navigate('/')}>Go back to the home</StyledButton>
    </Content>
  )
}

const Content = styled.div`
  display: flex;
  margin-top: 80px;
  justify-content: center;
  flex-direction: column;
  align-items: center;

  > *:first-child {
    margin-bottom: 24px;
  }
`

const Text = styled.div`
  font-weight: bold;
  font-size: 40px;
  color: #4c9aff;
  margin-bottom: 24px;
`

const StyledButton = styled(Button)`
  color: #4c9aff;
`

export default Success

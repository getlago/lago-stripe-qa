import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Main from '~/pages/Main'
import SetStripe, { STRIPE_ROUTE } from '~/pages/SetStripe'

const App = () => {
  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path={STRIPE_ROUTE} element={<SetStripe />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

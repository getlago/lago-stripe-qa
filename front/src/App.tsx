import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Main from '~/pages/Main'
import SetStripe, { STRIPE_ROUTE } from '~/pages/SetStripe'
import Success, { SUCCESS_ROUTE } from '~/pages/Success'

const App = () => {
  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path={STRIPE_ROUTE} element={<SetStripe />} />
        <Route path={SUCCESS_ROUTE} element={<Success />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

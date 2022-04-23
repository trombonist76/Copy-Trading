import TradeSetups from './components/TradeSetups'
import CreateTradeSetup from './components/CreateTradeSetup'
import Navbar from './components/Navbar'
import { Route, Routes } from 'react-router-dom'
import EditSetup from './components/EditSetup'
import CreateTrader from './components/CreateTrader'
import { UserProvider } from './contexts/userContext'
import { ContractProvider } from './contexts/contractContext'

const App = () => {
  return (
    <div className='app'>
      <ContractProvider>
      <UserProvider>
        <Navbar/>
        { (
          <Routes>
            <Route exact path="/" element={<TradeSetups/>} />
            <Route path="/createSetup" element={<CreateTradeSetup/>} />
            <Route path="/createTrader" element={<CreateTrader/>} />
            <Route path="/editSetup/:id" element={<EditSetup/>} />
          </Routes>
        )}
      </UserProvider>
      </ContractProvider>
    </div>
  )
}

export default App

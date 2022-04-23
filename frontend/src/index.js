import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import getConfig from './config.js'
import * as nearAPI from 'near-api-js'
import 'antd/dist/antd.css'
import {BrowserRouter} from "react-router-dom"
import "./index.css"

async function initContract() {
  const nearConfig = getConfig(process.env.NODE_ENV || 'testnet')

  const near = await nearAPI.connect({
    deps: {
      keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore(),
    },
    ...nearConfig,
  })

  const walletConnection = new nearAPI.WalletConnection(near)

  let currentUser
  if (walletConnection.getAccountId()) {
    currentUser = {
      accountId: walletConnection.getAccountId(),
      balance: (await walletConnection.account().state()).amount,
    }
  }

  const contract = await new nearAPI.Contract(
    walletConnection.account(),
    nearConfig.contractName,
    {
      viewMethods: ['getSetups', "isTrader"],
      changeMethods: ['createSetup', 'updateSetup', 'deleteSetup', "createTrader", "subscribeSetup"],
      sender: walletConnection.getAccountId(),
    },
  )

  return { contract, currentUser, nearConfig, walletConnection }
}

window.nearInitPromise = initContract().then(
  ({ contract, currentUser, nearConfig, walletConnection }) => {
    ReactDOM.render(
      <BrowserRouter>
        <App
          contract={contract}
          currentUser={currentUser}
          nearConfig={nearConfig}
          wallet={walletConnection}
        />
      </BrowserRouter>,
      document.getElementById('root'),
    )
  },
)

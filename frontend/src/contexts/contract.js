import getConfig from '../config'
import * as nearAPI from 'near-api-js'

export async function initContract() {
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
            viewMethods: ['getSetups', "isTrader", "getSetupById"],
            changeMethods: ['createSetup', 'updateSetup', 'deleteSetup', "createTrader", "addSubToSetup", "donateTraderBySetupId"],
            sender: walletConnection.getAccountId(),
        },
    )

    return { contract, currentUser, nearConfig, walletConnection }
}
import { createContext, useContext, useEffect, useState } from 'react'
import { initContract } from './contract'

const contractContext = createContext()

export function ContractProvider({ children }) {
    const [contractValues, setContractValues] = useState({})

    useEffect(() => {
        (async () => {
            const values = await initContract()
            setContractValues(values)
        })()
    },[])

    const values = {
        wallet: contractValues.walletConnection,
        ...contractValues
    }

    return (
        <contractContext.Provider value={values}>{children}</contractContext.Provider>
    )
}

export const useContract = () => useContext(contractContext)
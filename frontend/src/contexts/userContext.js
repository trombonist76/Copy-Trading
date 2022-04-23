import React, { createContext, useContext, useEffect, useState } from 'react'
import { useContract } from './contractContext'

const userContext = createContext()


export function UserProvider({children}) {
    const { currentUser, contract } = useContract()
    const [isUserTrader, setIsUserTrader] = useState(false)
    const [userSignUp,setUserSignUp] = useState(false)

    console.log(currentUser)

    useEffect(() => {
        if (currentUser) {
            (async function () {
                const trader = await contract.isTrader({ id: currentUser.accountId })
                setIsUserTrader(trader && true)
                setUserSignUp(false)
            })()
        }

    }, [userSignUp,contract])


    const values = {
        isUserTrader,
        setIsUserTrader,
        setUserSignUp,
    }

    return (

        <userContext.Provider value={values}>{children}</userContext.Provider>
    )
}


export const useCurrentUser = () => useContext(userContext)
import { createContext, useState, useEffect, useContext } from 'react'
import truncateEthAddress from 'truncate-eth-address'
import { useAccount } from 'wagmi'

export const AppContext = createContext()

export const AppProvider = ({ children }) => {
    const [userAddress, setUserAddress] = useState('')

    const { address } = useAccount()

    useEffect(() => {
        if (!address) {
            setUserAddress(address)
        } else {
            console.log(address)
            setUserAddress(truncateEthAddress(address))
        }
    
      }, [address])


    return (
        <AppContext.Provider value={{ userAddress }}>
          {children}
        </AppContext.Provider>
      )
}

export const useAppContext = () => {
    return useContext(AppContext)
  }
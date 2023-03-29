import { createContext, useState, useEffect, useContext } from "react";
import truncateEthAddress from "truncate-eth-address";
import { useAccount } from "wagmi";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [userAddress, setUserAddress] = useState("");
  const [page, setPage] = useState("");

  const { address } = useAccount();

  useEffect(() => {
    if (!address) {
      setUserAddress(address);
    } else {
      console.log(address);
      setUserAddress(truncateEthAddress(address));
    }
  }, [address]);

  const uploadToIpfs = async (metaData) => {

    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: metaData,
    };

    try {
      const res = await fetch("/api/ipfs", options);
      const data = await res.json();
      return data;
    } catch (e) {
      console.log(e.message)
    }
  };

  // const setHomeDisplay = (display) => {
  //   setPage(display);
  // }

  return (
    <AppContext.Provider value={{ userAddress, page, setPage, uploadToIpfs }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};

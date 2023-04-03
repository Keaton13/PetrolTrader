import { createContext, useState, useEffect, useContext } from "react";
import { createContract } from "../utils/constant";
import truncateEthAddress from "truncate-eth-address";
import { useAccount } from "wagmi";
const axios = require('axios');

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [userAddress, setUserAddress] = useState();
  const [page, setPage] = useState("");
  const [dealershipContract, setDealershipContract] = useState();
  const [mintContract, setMintContract] = useState();
  const [nfts, setNfts] = useState();

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
    console.log(metaData);
    try {
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: metaData,
      };

      const res = await fetch("/api/ipfs", options);
      const data = await res.json();
      console.log(data.response[0].path);
      mint(data.response[0].path);
      return data;
    } catch (e) {
      console.log(e);
    }
  };

  const mint = async (tokenURI) => {
    mintContract.methods
      .mint(tokenURI)
      .send({ from: address })
      .on("transactionHash", function (hash) {
        console.log("Transaction hash:", hash);
      })
      .on("confirmation", function (confirmationNumber, receipt) {
        console.log("Confirmation number:", confirmationNumber);
        console.log("Receipt:", receipt);
      })
      .on("error", function (error) {
        console.error("Error:", error);
      });
  };

  const loadBlockchainData = async () => {
    const contracts = createContract();

    const dealershipContract = contracts.dealerContract;
    const mintContract = contracts.mintContract;
    setDealershipContract(dealershipContract);
    setMintContract(mintContract);

    console.log(mintContract);

    const totalSupply = await mintContract.methods.totalSupply().call();
    console.log(totalSupply);

    const nfts = [];

    for (let i = 1; i <= totalSupply; i++) {
      const uri = await mintContract.methods.tokenURI(i).call();
      await axios.get(uri)
      .then(response => {
        nfts.push(response.data);
      })
      .catch(error => {
        console.error(error);
      });
    }
    setNfts(nfts);
  };

  return (
    <AppContext.Provider value={{ userAddress, page, setPage, uploadToIpfs, loadBlockchainData, nfts }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};

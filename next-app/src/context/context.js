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
      mint(data.response[0].path, metaData);
      return data;
    } catch (e) {
      console.log(e);
    }
  };

  const mint = async (tokenURI, metaData) => {
    let newItemId
    try {
      const mintReceipt = await mintContract.methods
        .mint(tokenURI)
        .send({ from: address })
        .on("transactionHash", function (hash) {
          console.log("Transaction hash:", hash);
        })
        .on("confirmation", function (confirmationNumber, receipt) {
          newItemId = receipt.events.Transfer.returnValues.tokenId;
          console.log("Confirmation number:", confirmationNumber);
          console.log("Receipt:", receipt);
        })
        .on("error", function (error) {
          console.error("Error:", error);
        });
      } catch (error) {

      }
      let nftMetaData = JSON.parse(metaData);
    try{
      const listReceipt = await dealershipContract.methods
        .listCar(newItemId, nftMetaData.attributes.price)
        .send({from: address})
        .on("transactionHash", function (hash) {
          console.log("Transaction hash #2:", hash);
        })
        .on("confirmation", function (confirmationNumber, receipt) {
          console.log("Confirmation number #2:", confirmationNumber);
          console.log("Receipt #2:", receipt);
        })
        .on("error", function (error) {
          console.error("Error:", error);
        });
    
      console.log("Both transactions were successful.");
    } catch (error) {
      console.error("Error:", error);
      console.log("Transaction 2 failed")
    }
  };

  const loadBlockchainData = async () => {
    const contracts = createContract();

    const dealershipContract = contracts.dealerContract;
    const mintContract = contracts.mintContract;
    setDealershipContract(dealershipContract);
    setMintContract(mintContract);

    const approval = await mintContract.methods.setApprovalForAll("0x4946338b1597Ee7739a1404b48d32FD145d22389", true).call();
    console.log(approval)

    console.log(mintContract);

    const totalSupply = await mintContract.methods.totalSupply().call();
    console.log(totalSupply);

    const nfts = [];

    for (let i = 1; i <= totalSupply; i++) {
      const uri = await mintContract.methods.tokenURI(i).call();
      await axios.get(uri)
      .then(response => {
        nfts.push([response.data, i]);
      })
      .catch(error => {
        console.error(error);
      });
    }
    console.log(nfts)
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

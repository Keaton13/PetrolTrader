import { createContext, useState, useEffect, useContext } from "react";
import { createContract } from "../utils/constant";
import truncateEthAddress from "truncate-eth-address";
import { useAccount } from "wagmi";
const Web3 = require("web3");
const axios = require("axios");

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [userAddress, setUserAddress] = useState();
  const [page, setPage] = useState("");
  const [dealershipContract, setDealershipContract] = useState();
  const [mintContract, setMintContract] = useState();
  const [nfts, setNfts] = useState();
  const provider = new Web3.providers.HttpProvider('http://localhost:7545');

  const web3 = new Web3(provider);

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
    try {
      const options = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: metaData,
      };

      const res = await fetch("/api/ipfs", options);
      const data = await res.json();
      mint(data.response[0].path, metaData);
      return data;
    } catch (e) {
      console.log(e);
    }
  };

  const mint = async (tokenURI, metaData) => {
    const nftMetaData = JSON.parse(metaData);
    let newItemId;
    try {
      const transaction = await mintContract.methods
        .mint(tokenURI)
        .send({ from: address, gas: 3000000 });

      newItemId = transaction.events.Transfer.returnValues.tokenId;

      const approvalTransaction = await mintContract.methods
        .approve(dealershipContract._address, newItemId)
        .send({ from: address, gas: 3000000 });


      const receipt = await web3.eth.getTransactionReceipt(approvalTransaction.transactionHash);

      if (receipt.status === true) {
        list(newItemId, nftMetaData)
        console.log('Transaction confirmed!');
      } else {
        console.error('Transaction failed!');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const list = async (newItemId, nftMetaData) => {
    console.log(newItemId);
    console.log(nftMetaData);
    const isListed = await dealershipContract.methods.isListed(newItemId).call();
    console.log(isListed)
    // const transaction = await dealershipContract.methods
    //   .listCar(47, web3.utils.toWei("10", "ether"))
    //   .send({ from: address, gas: 3000000 });
  };

  const loadBlockchainData = async () => {
    const contracts = createContract();

    const dealershipContract = contracts.dealerContract;
    const mintContract = contracts.mintContract;
    setDealershipContract(dealershipContract);
    setMintContract(mintContract);

    console.log(dealershipContract.methods)

    const totalSupply = await mintContract.methods.totalSupply().call();

    const nfts = [];

    for (let i = 1; i <= totalSupply; i++) {
      const uri = await mintContract.methods.tokenURI(i).call();
      await axios
        .get(uri)
        .then((response) => {
          nfts.push([response.data, i]);
        })
        .catch((error) => {
          console.error(error);
        });
    }
    setNfts(nfts);
  };

  return (
    <AppContext.Provider
      value={{
        userAddress,
        page,
        setPage,
        uploadToIpfs,
        loadBlockchainData,
        nfts,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};

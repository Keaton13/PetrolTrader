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
  const provider = new Web3.providers.HttpProvider("http://localhost:7545");

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

      const receipt = await web3.eth.getTransactionReceipt(
        approvalTransaction.transactionHash
      );

      if (receipt.status === true) {
        list(newItemId, nftMetaData);
        console.log("Transaction confirmed!");
      } else {
        console.error("Transaction failed!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const list = async (newItemId, nftMetaData) => {
    console.log(newItemId);
    console.log(nftMetaData);

    const priceConversion = await getCurrentEthPrice(nftMetaData.attributes.price);
    console.log(priceConversion);
    const isListed = await dealershipContract.methods
      .isListed(newItemId)
      .call();
    console.log(isListed);
    try {
      const transaction = await dealershipContract.methods
        .listCar(newItemId, web3.utils.toWei(String(priceConversion), 'ether'))
        .send({ from: address, gas: 3000000 });
    } catch (error) {
      console.error(error);
    }
  };

  const getCurrentEthPrice = async (usdAmount) => {
      const response = await axios.get('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD');
      let etherPriceInUsd = response.data.USD;
  
      const etherAmount = usdAmount / etherPriceInUsd;
      const roundedEtherAmount = etherAmount.toFixed(2);
      return Number(roundedEtherAmount);
  }

  const loadBlockchainData = async () => {
    const contracts = createContract();

    const dealershipContract = contracts.dealerContract;
    const mintContract = contracts.mintContract;
    setDealershipContract(dealershipContract);
    setMintContract(mintContract);

    console.log(dealershipContract.methods);

    const totalSupply = await dealershipContract.methods.getAllTokens().call();

    const nfts = [];

    console.log(totalSupply);

    for (let i = 0; i <= totalSupply.length -1; i++) {
      let nftResponse;
      let inspectionResponse;
      let sellerAddress;
      let buyerAddress;
      let nftPrice;
      const uri = await mintContract.methods.tokenURI(totalSupply[i]).call();

      await axios
        .get(uri)
        .then((response) => {
          nftResponse = response;
        })
        .catch((error) => {
          console.error(error);
        });

      try {
        const status = await dealershipContract.methods
          .inspectionPassed(totalSupply[i])
          .call();
        inspectionResponse = status;
      } catch (error) {
        console.error(error);
      }

      try {
        const seller = await dealershipContract.methods
        .seller(totalSupply[i])
        .call();
        sellerAddress = seller;
      } catch (error) {
        console.error(error);
      }

      try {
        const buyer = await dealershipContract.methods
        .buyer(totalSupply[i])
        .call();
        buyerAddress = buyer;
      } catch (error) {
        console.error(error);
      }

      try {
        const price = await dealershipContract.methods
        .purchaseAmount(totalSupply[i])
        .call()
        nftPrice = price;
      } catch (error){
        console.error(error);
      }
      nfts.push([nftResponse.data ,nftPrice, inspectionResponse,sellerAddress,buyerAddress,totalSupply[i]]);
    }
    setNfts(nfts);
  };

  const setInspectionStatus = async (nftId, status) => {
    try {
      const inspectionStatus = await dealershipContract.methods
        .updatedInspectionStatus(nftId, status)
        .send({ from: address, gas: 3000000 });
      console.log(inspectionStatus.status);
    } catch (error) {
      console.error(error);
    }
  };

  const buyCar = async (nftId, price) => {
    try {
      const buy = await dealershipContract.methods
      .buyCar(nftId)
      .send({ from: address, value: price, gas: 300000 })
      console.log(buy.status);
    } catch (error) {
      console.error(error);
    }
  }

  const approveSale = async (nftId, address) => {
    try {
      const approve = await dealershipContract.methods
      .approveSale(nftId)
      .send({ from: address, gas: 300000 })
      console.log(approve.status)
    } catch {
      console.error(error);
    }
  }

  const finalizeSale = async (nftId) => {
    try{
      const price = await dealershipContract.methods
      .purchaseAmount(nftId)
      .call()
      console.log(price);
    } catch (error) {
      console.error(error);
    }
    try {
      const finalizeSale = await dealershipContract.methods
      .finalizeSale(nftId)
      .send({ from: address, gas: 300000 })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <AppContext.Provider
      value={{
        userAddress,
        page,
        dealershipContract,
        setPage,
        uploadToIpfs,
        loadBlockchainData,
        setInspectionStatus,
        buyCar,
        approveSale,
        finalizeSale,
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

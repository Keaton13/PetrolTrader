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
  const [soldNfts, setSoldNfts] = useState();
  const [events, setEvent] = useState();
  const provider = new Web3.providers.HttpProvider("http://localhost:7545");

  const web3 = new Web3(provider);

  const { address } = useAccount();

  useEffect(() => {
    if (!address) {
      setUserAddress(address);
    } else {
      setUserAddress(truncateEthAddress(address));
    }
  }, [address]);

  useEffect(() => {
    const contracts = createContract();

    const dealershipContract = contracts.dealerContract;
    const mintContract = contracts.mintContract;
    setDealershipContract(dealershipContract);
    setMintContract(mintContract);

    const carListedEvent = dealershipContract.events.CarListed(
      {},
      (error, event) => {
        if (error) {
          console.error(error);
        } else {
          setEvent(event.returnValues);
        }
      }
    );

    const carBoughtEvent = dealershipContract.events.CarBought(
      {},
      (error, event) => {
        if (error) {
          console.error(error);
        } else {
          setEvent(event.returnValues);
        }
      }
    );

    const carSoldEvent = dealershipContract.events.CarSold(
      {},
      (error, event) => {
        if (error) {
          console.error(error);
        } else {
          setEvent(event.returnValues);
        }
      }
    );

    const carInspectedEvent = dealershipContract.events.CarInspected(
      {},
      (error, event) => {
        if (error) {
          console.error(error);
        } else {
          setEvent(event.returnValues);
        }
      }
    );

    const saleApprovedEvent = dealershipContract.events.SaleApproved(
      {},
      (error, event) => {
        if (error) {
          console.error(error);
        } else {
          setEvent(event.returnValues);
        }
      }
    );
    return () => {
      carListedEvent.unsubscribe();
      carBoughtEvent.unsubscribe();
      carSoldEvent.unsubscribe();
      carInspectedEvent.unsubscribe();
      saleApprovedEvent.unsubscribe();
    };
  }, []);

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
        .mint(tokenURI, dealershipContract._address)
        .send({ from: address, gas: 3000000 });

      newItemId = transaction.events.Transfer.returnValues.tokenId;

      // const approvalTransaction = await mintContract.methods
      //   .approve(dealershipContract._address, newItemId)
      //   .send({ from: address, gas: 3000000 });

      const receipt = await web3.eth.getTransactionReceipt(
        transaction.transactionHash
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
    const priceConversion = await getCurrentEthPrice(
      nftMetaData.attributes.price
    );
    const isListed = await dealershipContract.methods
      .isListed(newItemId)
      .call();

    try {
      const transaction = await dealershipContract.methods
        .listCar(newItemId, web3.utils.toWei(String(priceConversion), "ether"))
        .send({ from: address, gas: 3000000 });
    } catch (error) {
      console.error(error);
    }
  };

  const getCurrentEthPrice = async (usdAmount) => {
    const response = await axios.get(
      "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD"
    );
    let etherPriceInUsd = response.data.USD;

    const etherAmount = usdAmount / etherPriceInUsd;
    const roundedEtherAmount = etherAmount.toFixed(2);
    return Number(roundedEtherAmount);
  };

  const loadNftData = async () => {
    const totalSupply = await dealershipContract.methods.getAllTokens().call();

    const nfts = [];

    for (let i = 0; i <= totalSupply.length - 1; i++) {
      let nftResponse;
      let inspectionResponse;
      let sellerAddress;
      let buyerAddress;
      let nftPrice;
      let approvalStatus;
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
        inspectionResponse = await dealershipContract.methods
          .inspectionPassed(totalSupply[i])
          .call();
      } catch (error) {
        console.error(error);
      }

      try {
        sellerAddress = await dealershipContract.methods
          .seller(totalSupply[i])
          .call();
      } catch (error) {
        console.error(error);
      }

      try {
        buyerAddress = await dealershipContract.methods
          .buyer(totalSupply[i])
          .call();
      } catch (error) {
        console.error(error);
      }

      try {
        nftPrice = await dealershipContract.methods
          .purchaseAmount(totalSupply[i])
          .call();
      } catch (error) {
        console.error(error);
      }

      try {
        approvalStatus = await dealershipContract.methods
          .approval(totalSupply[i], address)
          .call();
      } catch (error) {
        console.error(error);
      }

      nfts.push([
        nftResponse.data,
        nftPrice,
        inspectionResponse,
        sellerAddress,
        buyerAddress,
        totalSupply[i],
        approvalStatus,
      ]);
    }

    setNfts(nfts);

  };

  const loadSoldNftData = async () => {
    const soldSupply = await dealershipContract.methods.getAllSoldTokens().call();

    const soldNfts = [];

    for (let i = 0; i < soldSupply.length -1; i++) {
      let soldNftResponse;
      let nftSoldPrice;

      const soldUri = await mintContract.methods.tokenURI(soldSupply[i]).call();

      await axios
      .get(soldUri)
      .then((response) => {
        soldNftResponse = response;
      })
      .catch((error) => {
        console.error(error);
      });

      try {
        nftSoldPrice = await dealershipContract.methods
          .purchaseAmount(soldSupply[i])
          .call();
      } catch (error) {
        console.error(error);
      }
      let status = {
        sold: true
      }
      soldNfts.push([soldNftResponse.data, nftSoldPrice])

    }
    setSoldNfts(soldNfts);
  }

  const removeCarToken = async (nftId) => {
    try {
      const removalStatus = await dealershipContract.methods
        .removeToken(nftId)
        .send({ from: address, gas: 3000000 });
    } catch (error) {
      console.error(error);
    }
  };

  const setInspectionStatus = async (nftId, status) => {
    try {
      const inspectionStatus = await dealershipContract.methods
        .updatedInspectionStatus(nftId, status)
        .send({ from: address, gas: 3000000 });
    } catch (error) {
      console.error(error);
    }
  };

  const buyCar = async (nftId, price) => {
    try {
      const buy = await dealershipContract.methods
        .buyCar(nftId)
        .send({ from: address, value: price, gas: 300000 });
    } catch (error) {
      console.error(error);
    }
  };

  const approveSale = async (nftId, address) => {
    try {
      const approve = await dealershipContract.methods
        .approveSale(nftId)
        .send({ from: address, gas: 300000 });
    } catch {
      console.error(error);
    }
  };

  const approvalStatus = async (nftId) => {
    try {
      const approvalStatus = await dealershipContract.methods
        .approval(nftId, address)
        .call();
      return approvalStatus;
    } catch (error) {
      console.errpr(error);
    }
  };

  const finalizeSale = async (nftId) => {
    try {
      const price = await dealershipContract.methods
        .purchaseAmount(nftId)
        .call();
    } catch (error) {
      console.error(error);
    }
    try {
      const finalizeSale = await dealershipContract.methods
        .finalizeSale(nftId)
        .send({ from: address, gas: 300000 });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        userAddress,
        page,
        dealershipContract,
        setPage,
        uploadToIpfs,
        loadNftData,
        loadSoldNftData,
        setInspectionStatus,
        buyCar,
        approveSale,
        approvalStatus,
        finalizeSale,
        nfts,
        soldNfts,
        events
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};

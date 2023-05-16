import { createContext, useState, useEffect, useContext } from "react";
import { createContract } from "../utils/constant";
import truncateEthAddress from "truncate-eth-address";
import { useAccount } from "wagmi";
const Web3 = require("web3");
const axios = require("axios");

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [userAddress, setUserAddress] = useState();
  const [page, setPage] = useState("Listing");
  const [dealershipContract, setDealershipContract] = useState();
  const [mintContract, setMintContract] = useState();
  const [nfts, setNfts] = useState();
  const [soldNfts, setSoldNfts] = useState();
  const [card, setCard] = useState();
  const [button, setContextButton] = useState();
  const [events, setEvent] = useState();
  const [showModal, setShowModal] = useState(false);
  const [transactionModalStatus, setTransactionModalStatus] = useState(false);
  const provider = new Web3.providers.HttpProvider(
    `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`
  );

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

    // removeCarToken(5);

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
        // console.log("Event working");
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

  // const getCurrentGasPrice = async () => {
  //   let gasPrice = await web3.eth.getGasPrice();
  //   setCurrentGasPrice(gasPrice);
  // } 

  const mint = async (tokenURI, metaData) => {
    const nftMetaData = JSON.parse(metaData);
    let newItemId;

    setTransactionModalStatus(true);

    try {
      const transaction = await mintContract.methods
        .mint(tokenURI, dealershipContract._address)
        .send({ from: address, gasPrice: 20000000000 });

      // console.log(transaction);

      newItemId = transaction.events.Transfer.returnValues.tokenId;

      // const approvalTransaction = await mintContract.methods
      //   .approve(dealershipContract._address, newItemId)
      //   .send({ from: address, gas: 3000000 });

      const receipt = await web3.eth.getTransactionReceipt(
        transaction.transactionHash
      );

      // console.log(receipt);

      if (receipt.status === true) {
        list(newItemId, nftMetaData);
        // console.log("Transaction confirmed!");
      } else {
        console.error("Transaction failed!");
      }
    } catch (error) {
      setTransactionModalStatus(false);
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
        .send({ from: address });

      const receipt = await web3.eth.getTransactionReceipt(
        transaction.transactionHash
      );
      if (receipt.status === true) {
        setTransactionModalStatus(false);
      }
    } catch (error) {
      setTransactionModalStatus(false);
      console.error(error);
    }
  };

  const setInspector = async () => {
    try {
      const transaction = await dealershipContract.methods
        .addInspector("0xbc57BAEd94eFac14c1F4172748313ef3DCf75c30")
        .send({ from: address, gasPrice: 20000000000 });
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

    // console.log(totalSupply);

    for (let i = 0; i <= totalSupply.length - 1; i++) {
      let nftResponse;
      let inspectionResponse;
      let sellerAddress;
      let buyerAddress;
      let nftPrice;
      let approvalStatus;
      const uri = await mintContract.methods.tokenURI(totalSupply[i]).call();

      // const proxyUrl = "https://cors-anywhere.herokuapp.com/";

      await axios
        .get(uri)
        .then((response) => {
          // handle response
          nftResponse = response;
        })
        .catch((error) => {
          // handle error
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
    const soldSupply = await dealershipContract.methods
      .getAllSoldTokens()
      .call();

    const soldNfts = [];

    for (let i = 0; i <= soldSupply.length - 1; i++) {
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
        sold: true,
      };
      soldNfts.push([soldNftResponse.data, nftSoldPrice]);
    }
    setSoldNfts(soldNfts);
  };

  const removeCarToken = async (nftId) => {
    try {
      const removalStatus = await dealershipContract.methods
        .removeToken(nftId)
        .send({ from: address, gasPrice: 20000000000 });
    } catch (error) {
      console.error(error);
    }
  };

  const setInspectionStatus = async (nftId, status) => {
    try {
      setTransactionModalStatus(true);

      const inspectionStatusTransaction = await dealershipContract.methods
        .updatedInspectionStatus(nftId, status)
        .send({ from: address, gasPrice: 20000000000 });

      const receipt = await web3.eth.getTransactionReceipt(
        inspectionStatusTransaction.transactionHash
      );

      if (receipt.status == true) {
        setTransactionModalStatus(false);
      }
    } catch (error) {
      setTransactionModalStatus(false);
      console.error(error);
    }
  };

  const buyCar = async (nftId, price) => {
    try {
      setTransactionModalStatus(true);
      // console.log(price)
      const buyTransaction = await dealershipContract.methods
        .buyCar(nftId)
        .send({ from: address, value: price, gasPrice: 20000000000 });

      const receipt = await web3.eth.getTransactionReceipt(
        buyTransaction.transactionHash
      );
      if (receipt.status === true) {
        setTransactionModalStatus(false);
      }
    } catch (error) {
      setTransactionModalStatus(false);
      console.error(error);
    }
  };

  const approveSale = async (nftId, address) => {
    try {
      setTransactionModalStatus(true);

      const approveTransaction = await dealershipContract.methods
        .approveSale(nftId)
        .send({ from: address, gasPrice: 20000000000 });

      const receipt = await web3.eth.getTransactionReceipt(
        approveTransaction.transactionHash
      );
      if (receipt.status === true) {
        setTransactionModalStatus(false);
      }
    } catch {
      setTransactionModalStatus(false);
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
      console.error(error);
    }
  };

  const finalizeSale = async (nftId) => {
    setTransactionModalStatus(true);
    try {
      const price = await dealershipContract.methods
        .purchaseAmount(nftId)
        .call();
    } catch (error) {
      setTransactionModalStatus(false);
      console.error(error);
    }
    try {
      const finalizeSaleTransaction = await dealershipContract.methods
        .finalizeSale(nftId)
        .send({ from: address, gasPrice: 20000000000 });

      const receipt = await web3.eth.getTransactionReceipt(
        finalizeSaleTransaction.transactionHash
      );

      if (receipt.status == true) {
        setTransactionModalStatus(false);
      }
    } catch (error) {
      setTransactionModalStatus(true);
      console.error(error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        userAddress,
        page,
        button,
        card,
        dealershipContract,
        setPage,
        setCard,
        setContextButton,
        uploadToIpfs,
        loadNftData,
        loadSoldNftData,
        setInspectionStatus,
        buyCar,
        approveSale,
        approvalStatus,
        finalizeSale,
        setTransactionModalStatus,
        transactionModalStatus,
        nfts,
        soldNfts,
        events,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};

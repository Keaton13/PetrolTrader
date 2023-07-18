import { createContext, useState, useEffect, useContext } from "react";
import { createContract } from "../utils/constant";
import truncateEthAddress from "truncate-eth-address";
import { useAccount } from "wagmi";
const Web3 = require("web3");
const axios = require("axios");

// Creating a context for the app
export const AppContext = createContext();

// Creating a provider for the context which includes the entire app state and functions
export const AppProvider = ({ children }) => {
  const [userAddress, setUserAddress] = useState();
  const [page, setPage] = useState("Listing");
  const [dealershipContract, setDealershipContract] = useState();
  const [mintContract, setMintContract] = useState();
  const [nfts, setNfts] = useState();
  const [soldNfts, setSoldNfts] = useState();
  const [portfolioNfts, setPortfolioNfts] = useState();
  const [card, setCard] = useState();
  const [button, setContextButton] = useState();
  const [events, setEvent] = useState();
  const [showModal, setShowModal] = useState(false);
  const [transactionModalStatus, setTransactionModalStatus] = useState(false);

  // Creating a new Web3 provider
  const provider = new Web3.providers.HttpProvider(
    `https://goerli.infura.io/v3/${process.env.INFURA_API_KEY}`
  );

  // Creating a new Web3 instance
  const web3 = new Web3(provider);

  // Using the account hook to get the user's Ethereum address
  const { address } = useAccount();

  // Updating the userAddress state whenever the address changes
  useEffect(() => {
    if (!address) {
      setUserAddress(address);
    } else {
      setUserAddress(truncateEthAddress(address));
    }
  }, [address]);

  useEffect(() => {
    // initiating ETH contracts and saving contracts to state
    const contracts = createContract();
    const dealershipContract = contracts.dealerContract;
    const mintContract = contracts.mintContract;
    setDealershipContract(dealershipContract);
    setMintContract(mintContract);

    // Setting event handlers to watch for contract events
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

    // Unsubscribing from events
    return () => {
      carListedEvent.unsubscribe();
      carBoughtEvent.unsubscribe();
      carSoldEvent.unsubscribe();
      carInspectedEvent.unsubscribe();
      saleApprovedEvent.unsubscribe();
    };
  }, []);

  /**
   * Upload metadata to IPFS.
   *
   * @param {Object} metaData - The metadata to upload to IPFS.
   * @returns {Promise<Object>} The response data from the IPFS API.
   */
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

  /**
   * Mint a new token
   *
   * @param {string} tokenURI - The URI of the token.
   * @param {Object} metaData - The metadata associated with the token.
   */
  const mint = async (tokenURI, metaData) => {
    const nftMetaData = JSON.parse(metaData);
    let newItemId;

    setTransactionModalStatus(true);

    try {
      const transaction = await mintContract.methods
        .mint(tokenURI, dealershipContract._address)
        .send({ from: address, gasPrice: 20000000000 });

      newItemId = transaction.events.Transfer.returnValues.tokenId;

      const receipt = await web3.eth.getTransactionReceipt(
        transaction.transactionHash
      );

      if (receipt.status === true) {
        list(newItemId, nftMetaData);
      } else {
        console.error("Transaction failed!");
      }
    } catch (error) {
      setTransactionModalStatus(false);
      console.error(error);
    }
  };

  /**
   * List a new item.
   *
   * @param {string} newItemId - The ID of the new item.
   * @param {Object} nftMetaData - The metadata of the NFT.
   */
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

  /**
   * Add an inspector.
   */
  const setInspector = async () => {
    try {
      const transaction = await dealershipContract.methods
        .addInspector("0xbc57BAEd94eFac14c1F4172748313ef3DCf75c30")
        .send({ from: address, gasPrice: 20000000000 });
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Get the current price of Ether in USD.
   *
   * @param {number} usdAmount - The amount in USD to convert to Ether.
   * @returns {Promise<number>} The equivalent amount of Ether.
   */
  const getCurrentEthPrice = async (usdAmount) => {
    const response = await axios.get(
      "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD"
    );
    let etherPriceInUsd = response.data.USD;

    const etherAmount = usdAmount / etherPriceInUsd;
    const roundedEtherAmount = etherAmount.toFixed(2);
    return Number(roundedEtherAmount);
  };

  /**
   * Load NFT data.
   */
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

      // Get TokenURI from IPFS
      await axios
        .get(uri)
        .then((response) => {
          nftResponse = response;
        })
        .catch((error) => {
          console.error(error);
        });

      // Get NFT information from Contract
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

  /**
   * Load sold NFT data.
   */
  const loadSoldNftData = async () => {
    const soldSupply = await dealershipContract.methods
      .getAllSoldTokens()
      .call();

    const soldNfts = [];

    for (let i = 0; i <= soldSupply.length - 1; i++) {
      let soldNftResponse;
      let nftSoldPrice;
      let nftSeller;

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
      try {
        nftSeller = await dealershipContract.methods
        .buyer(soldSupply[i])
        .call();
      } catch (error) {
        console.error(error);
      }
      let status = {
        sold: true,
      };
      soldNfts.push([soldNftResponse.data, nftSoldPrice, nftSeller]);
    }
    setSoldNfts(soldNfts);
    loadPortfolioNftData()

  };

  const loadPortfolioNftData = async () => {
    let portfolioNfts = [];

    console.log(soldNfts)

    for(let i=0; i < nfts.length; i++){
      if(nfts[i][3] === address){
        portfolioNfts.push(nfts[i])
      }
    }

    for(let v=0; v < soldNfts.length; v++){
      if(soldNfts[v][2] == address){
        portfolioNfts.push(soldNfts[v])
      }
    }

    setPortfolioNfts(portfolioNfts);
    console.log(portfolioNfts)
  }

  /**
   * Remove a car token.
   *
   * @param {number} nftId - The ID of the NFT to remove.
   */
  const removeCarToken = async (nftId) => {
    try {
      const removalStatus = await dealershipContract.methods
        .removeToken(nftId)
        .send({ from: address, gasPrice: 20000000000 });
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Set the inspection status.
   *
   * @param {number} nftId - The ID of the NFT to inspect.
   * @param {boolean} status - The inspection status.
   */
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

  /**
   * Buy a car.
   *
   * @param {number} nftId - The ID of the NFT to buy.
   * @param {number} price - The price of the car.
   */
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

  /**
   * Approve a sale.
   *
   * @param {number} nftId - The ID of the NFT to approve for sale.
   * @param {string} address - The Ethereum address of the buyer.
   */
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

  /**
   * Check the approval status.
   *
   * @param {number} nftId - The ID of the NFT to check for approval.
   * @returns {Promise<boolean>} The approval status.
   */
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

  /**
   * Finalize a sale.
   *
   * @param {number} nftId - The ID of the NFT to finalize the sale for.
   */
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

  // Returning the provider with all the state variables and functions
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
        portfolioNfts,
        events,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// Exporting a hook to use the app context
export const useAppContext = () => {
  return useContext(AppContext);
};

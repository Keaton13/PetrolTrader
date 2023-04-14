import Web3 from "web3";
import mintAbi from "./MintCar.json";
import dealerAbi from "./Dealership.json";

const mintAddress = "0xD3c71fac15D88377BAbCC9787fc1Eb6221cDA28a";
const dealerAddress = "0x0CbdC8B97cA8Caacf593e402E25f09aD2F778A4d";

export const createContract = () => {
  const { ethereum } = window;

  if (ethereum) {
    const web3 = new Web3(ethereum);
    const mintContract = new web3.eth.Contract(mintAbi.abi, mintAddress);
    const dealerContract = new web3.eth.Contract(dealerAbi.abi, dealerAddress);

    return {
      mintContract,
      dealerContract,
    };
  }
};

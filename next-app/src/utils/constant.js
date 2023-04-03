import Web3 from "web3";
import mintAbi from "./MintCar.json";
import dealerAbi from "./Dealership.json";

const mintAddress = "0x4946338b1597Ee7739a1404b48d32FD145d22389";
const dealerAddress = "0xa0A38d44b819f84F16C16De88aFE31D1f5Af0cc6";

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

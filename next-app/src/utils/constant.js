import Web3 from "web3";
import mintAbi from "./MintCar.json";
import dealerAbi from "./Dealership.json";

const mintAddress = "0x731A4e8F83b50c0109856b644C97e2E2c63bBe2d";
const dealerAddress = "0x092051abFE00Dc75bCBb63146c9DD39fF9623E93";

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

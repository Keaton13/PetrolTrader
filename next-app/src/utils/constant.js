import Web3 from "web3";
import mintAbi from "./MintCar.json";
import dealerAbi from "./Dealership.json";

const mintAddress = "0xe4555dc8E4048AeC482eAE3Ef051Da9b0192D342";
const dealerAddress = "0xa028e34e88E820255b18E64737d369A4E610181b";

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

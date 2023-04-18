import Web3 from "web3";
import mintAbi from "./MintCar.json";
import dealerAbi from "./Dealership.json";

const mintAddress = "0x50Eb9925FF22F2e5D121FFE217B1FCed06f31042";
const dealerAddress = "0xB286BF5600f3977EEDbc36D2ED12fDc5f062cC66";

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

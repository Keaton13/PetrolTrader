const Dealership = artifacts.require("Dealership");
const Mint = artifacts.require("MintCar");

module.exports = function(deployer) {
  deployer.deploy(Mint, {from: '0x14d9996764Bb3CcFfB989Af6C7691690bF8037Ac', gas: 5000000}).then(() => {
    // console.log(Mint.address)
    return deployer.deploy(Dealership, Mint.address, {from: '0x14d9996764Bb3CcFfB989Af6C7691690bF8037Ac', gas: 5000000});
  }).then(() => {
    console.log("Contracts deployed successfully!");
  });
};
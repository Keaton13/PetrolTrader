const Dealership = artifacts.require("Dealership");
const Mint = artifacts.require("MintCar");

module.exports = function(deployer) {
  deployer.deploy(Mint).then(() => {
    return deployer.deploy(Dealership,"0xd2646dd1dC1f6fF4c64273aae040fA0a78d3540f", Mint.address);
  }).then(() => {
    console.log("Contracts deployed successfully!");
  });
};
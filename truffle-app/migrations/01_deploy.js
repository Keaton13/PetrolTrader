const Dealership = artifacts.require("dealership");
const Mint = artifacts.require("mint");

module.exports = function(deployer) {
  deployer.deploy(Mint).then(() => {
    return deployer.deploy(Dealership, Mint.address);
  }).then(() => {
    console.log("Contracts deployed successfully!");
  });
};
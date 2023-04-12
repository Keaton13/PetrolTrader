const Dealership = artifacts.require("Dealership");
const Mint = artifacts.require("MintCar");

module.exports = function(deployer) {
  deployer.deploy(Mint).then(() => {
    console.log(Mint.address)
    return deployer.deploy(Dealership,Mint.address,"0x84125D450F39d06C3Df31161D6d7de5c5977F472");
  }).then(() => {
    console.log("Contracts deployed successfully!");
  });
};
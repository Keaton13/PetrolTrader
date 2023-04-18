const Dealership = artifacts.require("Dealership");
const Mint = artifacts.require("MintCar");

module.exports = function(deployer) {
  deployer.deploy(Mint).then(() => {
    console.log(Mint.address)
    return deployer.deploy(Dealership,Mint.address,"0xbc57BAEd94eFac14c1F4172748313ef3DCf75c30");
  }).then(() => {
    console.log("Contracts deployed successfully!");
  });
};
var DataEscrow = artifacts.require("./DataEscrow.sol");

module.exports = function(deployer) {
  deployer.deploy(DataEscrow);
};

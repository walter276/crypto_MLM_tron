var MLM = artifacts.require("./MLM.sol");

var tdr = require('tron-deploy-registry')

module.exports = function(deployer) {
  // tdr.config.setNetworksPath(deployer)

  // console.log("ddddd", tdr)
  // mainnet
  // deployer.deploy(MLM, 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t');

  // in case of shasta testnet
  // deployer.deploy(MLM, 'TG3XXyExBkPp9nzdajDZsozEu4BkaSJozs');
};

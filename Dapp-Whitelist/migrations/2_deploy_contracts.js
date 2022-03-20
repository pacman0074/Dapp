const SimpleStorage = artifacts.require('SimpleStorage');
const Whitelist = artifacts.require('Whitelist');

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(Whitelist);
};

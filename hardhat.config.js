require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config()
require("@nomiclabs/hardhat-etherscan");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.4",
  networks:{
    goerli:{
      url:`
      https://goerli.infura.io/v3/${process.env.INFURA_KEY}`,
      accounts:[process.env.PRIVATE_KEY]
    }
  },
  etherscan:{
    apiKey:{
      goerli:`${process.env.API_KEY}`
    }
  }
};

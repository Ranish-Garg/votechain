require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks : {
    localganache: 
    {
      url : process.env.GANACHEPROVIDERURL,
      accounts : [`0x${process.env.GANACHEPRIVATEKEY}`]
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC,
      accounts: [`0x${process.env.SEPOLIAPRIVATEKEY}`],
      chainId: 11155111,
    },
  }
};

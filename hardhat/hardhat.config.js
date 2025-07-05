require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks : {
    localganache: 
    {
      url : process.env.PROVIDERURL,
      accounts : [`0x${process.env.PRIVATEKEY}`]
    }
  }
};

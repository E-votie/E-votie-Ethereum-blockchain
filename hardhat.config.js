require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

if (!process.env.PRIVATE_KEY) {
  throw new Error("Please set your PRIVATE_KEY in a .env file");
}

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {},
    sepolia: {
      url: "https://sepolia.infura.io/v3/464e9a32f1d648f9862d7bf9fc879330",
      accounts: [process.env.PRIVATE_KEY],
      chainId: 11155111,
      gasPrice: "auto"
    }
  },
  defaultNetwork: "sepolia"
};
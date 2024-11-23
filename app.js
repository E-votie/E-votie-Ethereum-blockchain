const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { handleDeployment } = require("./scripts/deploy");

// Force Sepolia network
process.env.HARDHAT_NETWORK = 'sepolia';

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/deploy-contract", handleDeployment);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Hardhat service running on http://localhost:${PORT}`);
    console.log("Network:", process.env.HARDHAT_NETWORK);
});
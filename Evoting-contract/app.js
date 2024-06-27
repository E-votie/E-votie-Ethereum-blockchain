const express = require("express");
const ethers = require('ethers');
const MyContract = require("./VotingContract.json");

const app = express();
app.use(express.json());

// Replace with your provider
const network = "sepolia";
const INFURA_API_KEY = "464e9a32f1d648f9862d7bf9fc879330"
const PRIVATE_KEY = "e8063119b1e22301d85abd4b5cd3f5bfe4401c4c70d6f3b157b689108afc2f36"

const provider = new ethers.providers.InfuraProvider(
    network,
    INFURA_API_KEY
);

const contractABI = MyContract.abi;
const contractAddress = '0x677F0E82BD9d30B74B779F730dd2468F644a4dc0';
const PrivateKey = "464e9a32f1d648f9862d7bf9fc879330";

const contract = new ethers.Contract(contractAddress, contractABI, provider);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contractWithSigner = contract.connect(wallet);

app.get("/result", async (req, res) => {
    const candidates = [];
    contract.getAllVotesOfCandiates().then(result => {
        for (let i = 0; i < result.length; i++) {
            const candidate = {
                name: result[i].name,
                voteCount: Number(result[i].voteCount)
            };
            candidates.push(candidate);
        }
        res.send(JSON.stringify(candidates));
    }).catch(error => {
        console.error(error);
        res.send(error.toString());
    });
})

app.post("/vote", async (req, res) => {
    contractWithSigner.vote(1).then(tx => {
        console.log(tx);
        res.send(tx.toString());
    }).catch(error => {
        console.error(error);
        res.send(error.toString());
    });
})

app.listen(3000, () => {
    console.log("Server is listing in port 3000")
})
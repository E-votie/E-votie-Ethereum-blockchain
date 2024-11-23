const hre = require("hardhat");
const { ethers } = require("hardhat");

async function deployVotingContract(candidateNumbers, votingStart, votingEnd) {
    try {
        // Get network info first
        const network = await ethers.provider.getNetwork();
        console.log("Connected to network:", {
            name: network.name,
            chainId: network.chainId
        });

        // Verify we're on Sepolia
        if (network.chainId !== 11155111) {
            throw new Error(`Must be connected to Sepolia. Current chainId: ${network.chainId}`);
        }

        // Get the signer
        const [deployer] = await ethers.getSigners();
        console.log("Deploying contracts with account:", deployer.address);

        // Check balance
        const balance = await deployer.getBalance();
        console.log("Account balance:", ethers.utils.formatEther(balance), "ETH");

        // Get the contract factory
        const VotingContract = await ethers.getContractFactory("VotingContract");
        console.log("Deploying contract...");

        // Deploy with explicit gas settings
        const contract = await VotingContract.deploy(
            candidateNumbers,
            votingStart,
            votingEnd,
            {
                gasLimit: 3000000
            }
        );

        console.log("Waiting for deployment transaction...");
        await contract.deployed();

        // Log success details
        console.log({
            address: contract.address,
            transactionHash: contract.deployTransaction.hash,
            gasUsed: (await contract.deployTransaction.wait()).gasUsed.toString()
        });

        return {
            success: true,
            address: contract.address,
            transactionHash: contract.deployTransaction.hash,
            deployer: deployer.address,
            network: "sepolia"
        };
    } catch (error) {
        console.error("Deployment failed:", error);
        throw error;
    }
}

// Express route handler
const handleDeployment = async (req, res) => {
    const { candidateNumbers, votingStart, votingEnd } = req.body;

    try {
        if (!process.env.PRIVATE_KEY) {
            throw new Error("PRIVATE_KEY not found in environment variables");
        }

        const result = await deployVotingContract(candidateNumbers, votingStart, votingEnd);
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
};

module.exports = {
    deployVotingContract,
    handleDeployment
};
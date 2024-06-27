const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("VotingContractModule", (m) => {

  const VotingContract = m.contract("VotingContract", [["a", "b", "c"], 15]);

  return { VotingContract };
});

// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract VotingContract {
    struct Candidate {
        string number; // Changed from 'name' to 'number'
        uint256 voteCount;
    }

    Candidate[] public candidates;
    address owner;

    uint256 public votingStart; // Starting timestamp of the election
    uint256 public votingEnd;   // Ending timestamp of the election

    // Constructor accepts candidate numbers and the voting start & end timestamps
    constructor(
        string[] memory _candidateNumbers,
        uint256 _votingStart,
        uint256 _votingEnd
    ) {
        require(_votingStart < _votingEnd, "Start time must be before end time.");
        for (uint256 i = 0; i < _candidateNumbers.length; i++) {
            candidates.push(Candidate({
                number: _candidateNumbers[i],
                voteCount: 0
            }));
        }
        owner = msg.sender;
        votingStart = _votingStart;
        votingEnd = _votingEnd;
    }

    modifier onlyOwner {
        require(msg.sender == owner, "Only the owner can perform this action.");
        _;
    }

    function addCandidate(string memory _number) public onlyOwner {
        candidates.push(Candidate({
            number: _number,
            voteCount: 0
        }));
    }

    function vote(uint256 _candidateIndex) public returns (uint256) {
        require(block.timestamp >= votingStart, "Voting has not started yet.");
        require(block.timestamp < votingEnd, "Voting has ended.");
        require(_candidateIndex < candidates.length, "Invalid candidate index.");
        candidates[_candidateIndex].voteCount++;
        return 1;
    }

    function getAllVotesOfCandidates() public view returns (Candidate[] memory) {
        return candidates;
    }

    function getVotingStatus() public view returns (bool) {
        return (block.timestamp >= votingStart && block.timestamp < votingEnd);
    }

    function getRemainingTime() public view returns (uint256) {
        require(block.timestamp >= votingStart, "Voting has not started yet.");
        if (block.timestamp >= votingEnd) {
            return 0;
        }
        return votingEnd - block.timestamp;
    }
}

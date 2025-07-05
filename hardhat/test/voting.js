const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");

describe("voting contract", function () {
  async function deployTokenFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();

     const metadataURIs = ["uri1", "uri2"];
    const duration = 5; 

    const Voting = await ethers.getContractFactory("voting", owner);
    const votingcontract = await Voting.deploy(metadataURIs, duration);

    // Fixtures can return anything you consider useful for your tests
    return { votingcontract, owner, addr1, addr2 };
  }

  it("should assign owner", async function () {
    const { votingcontract, owner } = await loadFixture(deployTokenFixture);

    const ownerincontract= await votingcontract.owner();
    expect(ownerincontract).to.equal(owner.address);
  });

 
});
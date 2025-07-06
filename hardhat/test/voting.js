const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");

describe("voting contract", function () {
  async function deployTokenFixture() {
    const [owner, addr1, addr2] = await ethers.getSigners();

     const candidatenames = ["Batman", "Superman","Thor"];
     const candidateimages = ["https://imgs.search.brave.com/ACmg8ScOnf0TFRVEd3RdPw7JZ_t9s-ogw3_xxJzJVW4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJjYXQuY29t/L3cvZnVsbC9jLzQv/Ny80NzIxMDYtMTA4/MHgxOTIwLW1vYmls/ZS0xMDgwcC1jaHJp/c3RpYW4tYmFsZS1i/YXRtYW4tYmFja2dy/b3VuZC1pbWFnZS5q/cGc",
      "https://imgs.search.brave.com/7aS_NvDk0aGZ5PGwO05thqF4_b66SRp5bANcbaTCMR8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJjYXQuY29t/L3cvZnVsbC9mL2Mv/Ni80MDYyNzQtMjE2/MHgzODQwLW1vYmls/ZS00ay1oZW5yeS1j/YXZpbGwtYmFja2dy/b3VuZC5qcGc",
      "https://wallpapercave.com/wp/wp8354923.jpg"]
    const duration = 5; 

    const Voting = await ethers.getContractFactory("voting", owner);
    const votingcontract = await Voting.deploy(candidatenames,candidateimages, duration);

    // Fixtures can return anything you consider useful for your tests
    return { votingcontract, owner, addr1, addr2 };
  }

  it("should assign owner", async function () {
    const { votingcontract, owner } = await loadFixture(deployTokenFixture);

    const ownerincontract= await votingcontract.owner();
    expect(ownerincontract).to.equal(owner.address);
  });

 
});
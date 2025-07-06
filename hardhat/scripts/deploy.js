const hre = require("hardhat");

async function main() {
  const Voting = await hre.ethers.getContractFactory("voting");

  const candidatenames = ["Batman", "Superman", "Thor"];
  const candidateimages = [
    "https://imgs.search.brave.com/ACmg8ScOnf0TFRVEd3RdPw7JZ_t9s-ogw3_xxJzJVW4/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJjYXQuY29t/L3cvZnVsbC9jLzQv/Ny80NzIxMDYtMTA4/MHgxOTIwLW1vYmls/ZS0xMDgwcC1jaHJp/c3RpYW4tYmFsZS1i/YXRtYW4tYmFja2dy/b3VuZC1pbWFnZS5q/cGc",
    "https://imgs.search.brave.com/7aS_NvDk0aGZ5PGwO05thqF4_b66SRp5bANcbaTCMR8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93YWxs/cGFwZXJjYXQuY29t/L3cvZnVsbC9mL2Mv/Ni80MDYyNzQtMjE2/MHgzODQwLW1vYmls/ZS00ay1oZW5yeS1j/YXZpbGwtYmFja2dy/b3VuZC5qcGc",
    "https://wallpapercave.com/wp/wp8354923.jpg"
  ];

  const voting = await Voting.deploy(candidatenames, candidateimages, 3600);

  await voting.waitForDeployment(); 

  console.log("Contract address:", await voting.getAddress()); 
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });

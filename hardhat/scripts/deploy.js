async function main() {
  const Voting = await ethers.getContractFactory("voting");

  // Start deployment, returning a promise that resolves to a contract object
  const Voting_ = await Voting.deploy(["url1", "uri2", "uri3"], 3600);
  console.log("Contract address:", Voting_.address);


}

main()
 .then(() => process.exit(0))
 .catch(error => {
   console.error(error);
   process.exit(1);
 });
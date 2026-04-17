const hre = require("hardhat");

async function main() {
  const Contract = await hre.ethers.getContractFactory("DecentralizedVideo");
  const contract = await Contract.deploy();
  await contract.waitForDeployment();
  console.log("DecentralizedVideo deployed to:", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const DocumentVerification = await hre.ethers.getContractFactory("DocumentVerification");
  const contract = await DocumentVerification.deploy();

  await contract.deployed();
  const address = contract.address;
  
  console.log("DocumentVerification deployed to:", address);

  const info = {
    address: address
  };
  fs.writeFileSync(path.join(__dirname, "..", "contract-address.json"), JSON.stringify(info, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

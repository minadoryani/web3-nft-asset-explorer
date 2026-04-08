import { ethers } from "hardhat";

async function main() {
  try {
    console.log("Deploy startet...");

    const MyNFT = await ethers.getContractFactory("MyNFT");
    const myNFT = await MyNFT.deploy();

    await myNFT.waitForDeployment();

    console.log("MyNFT deployed to:", await myNFT.getAddress());
  } catch (error) {
    console.error("Deploy-Fehler:", error);
    process.exit(1);
  }
}

main();
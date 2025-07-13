// Deployment script for the SupplyChain contract
// Run with: npx hardhat run scripts/deploy-contract.js --network localhost

const { ethers, network, run, artifacts } = require("hardhat")

async function main() {
  console.log("Deploying SupplyChain contract...")

  // Get the ContractFactory and Signers here.
  const SupplyChain = await ethers.getContractFactory("SupplyChain")
  const [deployer] = await ethers.getSigners()

  console.log("Deploying contracts with the account:", deployer.address)
  console.log("Account balance:", (await deployer.getBalance()).toString())

  // Deploy the contract
  const supplyChain = await SupplyChain.deploy()
  await supplyChain.deployed()

  console.log("SupplyChain contract deployed to:", supplyChain.address)
  console.log("Contract deployment transaction:", supplyChain.deployTransaction.hash)

  // Verify the contract on Etherscan (optional)
  if (network.name !== "hardhat" && network.name !== "localhost") {
    console.log("Waiting for block confirmations...")
    await supplyChain.deployTransaction.wait(6)

    console.log("Verifying contract on Etherscan...")
    try {
      await run("verify:verify", {
        address: supplyChain.address,
        constructorArguments: [],
      })
    } catch (e) {
      console.log("Verification failed:", e.message)
    }
  }

  // Save the contract address and ABI for the frontend
  const fs = require("fs")
  const contractsDir = "./contracts-info"

  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir)
  }

  fs.writeFileSync(
    contractsDir + "/contract-address.json",
    JSON.stringify({ SupplyChain: supplyChain.address }, undefined, 2),
  )

  const SupplyChainArtifact = artifacts.readArtifactSync("SupplyChain")

  fs.writeFileSync(contractsDir + "/SupplyChain.json", JSON.stringify(SupplyChainArtifact, null, 2))

  console.log("Contract info saved to contracts-info/")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

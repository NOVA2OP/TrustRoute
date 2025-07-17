# TrustRoute

## Live Site
[The code is deployed here](https://trust-route.vercel.app/)

##  Demo Video

 [Link to demo video](https://youtu.be/fuNbjsp9HLo?si=t2kVYSJfaCx7jCrr) 

**TrustRoute** is a blockchain + cybersecurity solution built for the Walmart Hackathon 2025 to build customer trust through:
- Blockchain-based product authenticity tracking
- Simulated IoT tamper detection
- Role-based log verification using Decentralised Identity (DID)

---

## Project Structure

| Folder         | Purpose |
|----------------|---------|
| `smart-contracts/` | Solidity smart contracts |
| `frontend/`    | React-based frontend (MetaMask, ethers.js) |
| `simulate-iot/`| Simulated IoT data submission |
| `shared/`      | Shared ABI + contract address for frontend/backend integration |

---

##  Tech Stack

-  Smart Contracts: Solidity, Hardhat/Remix, Ethereum Testnet
-  Frontend: React.js, MetaMask, ethers.js
-  IoT Simulation: Python
-  Identity: MetaMask wallets as Decentralised Identities

---

##  Demo Instructions (for Judges)

1. Connect MetaMask to the Ethereum testnet (Mumbai/Sepolia), to view existing logs, this step is necessary.
2. To get assigned a role to actually add logs, you have to ask for permission by sending the wallet address, as only I (Advik) can assign roles (my wallet is admin).
3. For the meanwhile, you can view existing logs created by Garvit (Manufacturer) and Shivansh (Transporter) for BATCH001 and BATCH01 and BATCH002.
4. Choose a role (Manufacturer, Transporter, Retailer)
5. Add product logs using the form
6. View the full supply chain history by scanning the product QR

---

##  Team

- Advik Gupta
- Garvit 
- Shivansh Singh 

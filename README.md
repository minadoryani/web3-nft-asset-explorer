# Web3 NFT Asset Explorer

A Web3 decentralized application for exploring, managing, and transferring NFT assets on Ethereum.

This project combines a Solidity smart contract, a React frontend, and blockchain data integrations to demonstrate practical Web3 development skills across smart contract interaction, wallet-based NFT management, and frontend architecture.

## Key Features

* Display NFTs owned by a connected wallet
* Mint new NFTs with metadata
* Transfer NFTs to another wallet address
* Integrate blockchain data services for NFT and wallet information
* Connect frontend and smart contract workflows in a single DApp architecture

## Tech Stack

### Smart Contracts

* Solidity
* Hardhat

### Frontend

* React
* Vite
* Ethers.js
* Thirdweb SDK

### Data & Infrastructure

* Ethereum
* Moralis
* Alchemy

## Project Structure

```
web3-nft-asset-explorer/
├── contracts/              
├── scripts/                
├── frontend/               
│   ├── src/                
│   ├── index.html          
│   └── vite.config.js      
├── hardhat.config.cjs      
├── package.json            
├── README.md               
├── .gitignore              
└── .env.example            
```

## Technical Scope

This project was built to demonstrate the following capabilities:

* Smart contract development with Solidity
* Hardhat-based project setup and deployment workflow
* Frontend integration for Web3 user interactions
* NFT-focused wallet features
* Clean separation between blockchain logic and UI layer
* Secure environment variable handling using `.env.example` and `.gitignore`

## Local Setup

### Install root dependencies

```
npm install
```

### Run local Hardhat node

```
npx hardhat node
```

### Deploy contract

```
npx hardhat run scripts/deploy.js --network localhost
```

### Start frontend

```
cd frontend
npm install
npm run dev
```

## Environment Variables

Create a `.env` file in the project root and add your environment values:

```
SEPOLIA_RPC_URL=your_alchemy_or_sepolia_rpc_url
PRIVATE_KEY=your_wallet_private_key
```

## Notes

This repository is presented as a portfolio project to demonstrate practical Ethereum and Web3 development skills, including smart contract integration, frontend architecture, and NFT-related DApp functionality.

## Author

Mina Doryani

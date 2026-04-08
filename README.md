# Web3 NFT Asset Explorer

## Overview

The Web3 NFT Asset Explorer is a decentralized application (DApp) that allows users to explore, manage, and transfer NFT assets directly on the Ethereum blockchain.

This project demonstrates the integration of smart contracts, blockchain data APIs, and a modern frontend interface to provide a seamless Web3 experience.

---

## Features

* View all NFTs owned by a wallet address
* Fetch blockchain data using Moralis API
* Mint new NFTs with metadata (image, name, description)
* Transfer NFTs to another wallet
* Display wallet balances and transaction history
* Real-time interaction with Ethereum via Thirdweb SDK

---

## Tech Stack

### Blockchain

* Solidity (0.8.24)
* Hardhat
* Alchemy (RPC Provider)

### Frontend

* React (Vite)
* Thirdweb SDK
* Ethers.js

### APIs

* Moralis NFT API
* Alchemy API

---

## Project Structure

```
web3-nft-asset-explorer/
│
├── contracts/        # Smart Contracts
├── scripts/          # Deployment scripts
├── frontend/         # React frontend
│   ├── src/
│   ├── index.html
│   └── vite.config.js
│
├── hardhat.config.js
├── package.json
├── README.md
```

---

## Setup Instructions

### 1. Install dependencies

```
npm install
```

### 2. Start local blockchain

```
npx hardhat node
```

### 3. Deploy smart contracts

```
npx hardhat run scripts/deploy.js --network localhost
```

### 4. Start frontend

```
cd frontend
npm install
npm run dev
```

---

## Environment Variables

Create a `.env` file in the root directory:

```
SEPOLIA_RPC_URL=your_alchemy_url
PRIVATE_KEY=your_private_key
```

---

## Author

Mina Doryani

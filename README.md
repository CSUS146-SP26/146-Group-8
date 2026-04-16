# DecentTube — Decentralized Video Platform

> CSC 146 | Group 8 | California State University, Sacramento

A decentralized alternative to YouTube built on the Ethereum blockchain. Creators upload videos to IPFS, sign ownership with their wallet, and earn ETH directly from viewers — no middleman, no platform cut.

---

## Team

| Name | GitHub | Role |
|------|--------|------|
| Uday Kyama | [@Udaykyama](https://github.com/Udaykyama) | UI & QA |
| Vincent Lam | [@vincentlan4554](https://github.com/vincentlan4554) | Frontend & Blockchain Integration |
| Brandon Hoang | [@Brandonhoang2](https://github.com/Brandonhoang2) | Smart Contracts (Solidity) |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Smart Contracts | Solidity, Remix IDE, Hardhat |
| Blockchain | Ethereum (Hardhat local / Sepolia testnet) |
| Frontend | React.js, Vite, ethers.js |
| Storage | IPFS via Pinata |
| Wallet | MetaMask |
| Testing | Hardhat + Mocha/Chai |

---

## How It Works

1. Creator uploads video to IPFS → receives a CID
2. Frontend computes `keccak256(videoHash + creatorAddress)` off-chain
3. Creator signs the hash via MetaMask (ECDSA)
4. `uploadVideo()` is called — contract verifies signature via `ecrecover()` before storing
5. Viewer calls `payToWatch()` with ETH → contract grants access
6. Viewer fetches video from IPFS and can verify integrity by re-hashing against the stored content hash
7. Viewer can call `tipCreator()` at any time
8. Creator calls `withdrawEarnings()` to receive accumulated ETH

---

## Smart Contract Functions

| Function | Access | Description |
|----------|--------|-------------|
| `uploadVideo(CID, contentHash, signature, price)` | Creator | Registers video; verifies ECDSA signature before storing |
| `verifyOwnership(contentHash, signature)` | Internal | Uses `ecrecover()` to confirm signer matches creator |
| `payToWatch(videoId)` | Viewer | Sends ETH to unlock access to a video |
| `tipCreator(videoId)` | Viewer | Sends optional ETH tip directly to creator wallet |
| `hasAccess(viewer, videoId)` | Public | Returns bool — has viewer paid for this video? |
| `withdrawEarnings()` | Creator | Pulls accumulated ETH balance to creator wallet |
| `getVideoMetadata(id)` | Public | Returns CID, contentHash, price, creator address |

---

## System Actors

| Actor | Description |
|-------|-------------|
| Content Creator | Uploads videos, sets ETH price, earns from views and tips |
| Viewer | Browses content, pays to unlock videos, tips creators |
| Content Moderator | Reviews flagged content via DAO-style governance |
| Billing Agent | Smart contract logic handling all ETH payment routing |
| Platform Admin | Deploys contract, manages emergency pause, sets platform parameters |

---

## Project Structure

```
146-Group-8/
├── SmartContract/
│   └── Contracts/
│       └── DecentralizedYT.sol    # Solidity smart contract
└── frontend/
    └── src/
        ├── App.jsx                # Root component + routing
        ├── components/
        │   ├── WalletConnect.jsx  # MetaMask connect/disconnect
        │   └── VideoCard.jsx      # Video thumbnail card
        ├── pages/
        │   ├── BrowsePage.jsx     # Video grid + search
        │   └── PlayerPage.jsx     # Video player + tip panel
        └── data/
            └── videos.js          # Mock video data (temporary)
```

---

## Running Locally

### Prerequisites
- Node.js v18+
- MetaMask browser extension
- Git

### Frontend

```bash
git clone https://github.com/CSUS146-SP26/146-Group-8.git
cd 146-Group-8/frontend
npm install
npm run dev
```

Open `http://localhost:5173` in Chrome with MetaMask installed.

### Smart Contract

```bash
cd SmartContract
npm install
npx hardhat compile
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
```

---

## Current Status

- [x] React frontend scaffold
- [x] MetaMask wallet connect
- [x] Video browse page with search
- [x] Video player page (locked/unlocked states)
- [x] Tip the Creator panel
- [x] Smart contract — uploadVideo, payToWatch, tipCreator, withdrawEarnings
- [ ] Frontend ↔ contract integration
- [ ] IPFS upload flow
- [ ] Deploy to Sepolia testnet
- [ ] Content moderation (DAO voting)

---

## License

Academic project — CSC 146, CSUS Spring 2026

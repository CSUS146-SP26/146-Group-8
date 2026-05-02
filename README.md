\# DecentTube — Decentralized Video Platform



> CSC 146 Fundamentals of Blockchain · Group 8 · California State University, Sacramento · Spring 2026



A blockchain-based alternative to YouTube. Creators upload videos to IPFS, sign ownership with their wallet, and earn ETH directly from viewers — no platform cut, no middleman, no censorship.



\---



\## Team



| Name | GitHub | Role |

|---|---|---|

| Uday Kyama | \[@Udaykyama](https://github.com/Udaykyama) | UI, IPFS integration, QA |

| Vincent Lam | \[@vincentlam4554](https://github.com/vincentlam4554) | Frontend, blockchain wiring |

| Brandon Hoang | \[@Brandonhoang2](https://github.com/Brandonhoang2) | Smart contracts (Solidity) |



\---



\## Demo



!\[Dashboard with file picker, IPFS upload, and on-chain registration flow](docs/screenshots/01-dashboard.png)



\*Creator dashboard — pick a file, set a price, register on-chain in four steps.\*



!\[Browse page showing one video registered on-chain](docs/screenshots/02-browse.png)



\*Browse page — videos pulled live from the smart contract.\*



!\[Player page streaming from IPFS with on-chain content hash verification](docs/screenshots/03-player.png)



\*Player — fetches the file from IPFS and verifies integrity against the on-chain content hash.\*



!\[MetaMask confirming a 0.001 ETH tip to the creator's wallet](docs/screenshots/04-payment.png)



\*Direct ETH payment to the creator — no platform skim.\*



\---



\## How It Works



1\. \*\*Creator picks a file\*\* in the Dashboard → browser computes `keccak256` of the file's raw bytes (the \*\*content hash\*\*).

2\. \*\*Browser computes ownership fingerprint\*\* = `keccak256(contentHash || creatorAddress)`.

3\. \*\*Creator signs the fingerprint\*\* via MetaMask (ECDSA `personal\_sign`).

4\. \*\*File uploads to IPFS\*\* via Pinata → returns a CID.

5\. \*\*`uploadVideo()` is called on-chain\*\* with `(cid, contentHash, signature, price, title)`.

6\. \*\*Contract verifies the signature\*\* via `ecrecover` before storing the record. If verification fails, the transaction reverts.

7\. \*\*Viewer calls `payToWatch()`\*\* with ETH → contract grants access and credits the creator's earnings.

8\. \*\*Viewer fetches the file\*\* from IPFS via gateway and can re-hash to verify integrity against the on-chain `contentHash`.

9\. \*\*Viewer can `tipCreator()`\*\* at any time, sending ETH directly to the creator's wallet.

10\. \*\*Creator calls `withdrawEarnings()`\*\* to pull accumulated ETH.



\---



\## Smart Contract API



| Function | Caller | Description |

|---|---|---|

| `uploadVideo(cid, contentHash, signature, price, title)` | Creator | Verifies ECDSA signature via `ecrecover`, stores record on-chain, emits `VideoUploaded` |

| `payToWatch(videoId)` payable | Viewer | Sends ETH to unlock access; credits creator's `earnings` mapping |

| `tipCreator(videoId)` payable | Viewer | Direct ETH tip to creator wallet |

| `hasAccess(viewer, videoId)` view | Anyone | Returns whether a viewer has paid for a video |

| `withdrawEarnings()` | Creator | Pulls accumulated ETH balance to caller |

| `getVideoMetadata(videoId)` view | Anyone | Returns `(creator, cid, contentHash, price, title, viewCount)` |

| `nextVideoId()` view | Anyone | Total registered videos (used by frontend to iterate) |



Events: `VideoUploaded`, `VideoPurchased`, `CreatorTipped`, `EarningsWithdrawn`.



\---



\## System Actors



| Actor | Role |

|---|---|

| \*\*Content Creator\*\* | Uploads videos, signs ownership via MetaMask, sets ETH price, withdraws earnings |

| \*\*Viewer\*\* | Browses content, pays ETH to unlock videos, tips creators, verifies content integrity |

| \*\*Content Moderator\*\* | Reviews flagged content; marks videos as restricted on-chain (frontend hides flagged content from catalog) |

| \*\*Platform Administrator\*\* | Manages moderator role assignments, handles dispute resolution, approves creator verification |



> Note: Smart Contract, IPFS, MetaMask, and Ethereum Network are \*infrastructure components\*, not actors — they are passive systems acted upon by the actors above.



\---



\## Tech Stack



| Layer | Technology |

|---|---|

| Smart Contracts | Solidity 0.8.x, Hardhat |

| Blockchain | Ethereum (Hardhat local node, chainId 31337) |

| Frontend | React 18, Vite, ethers.js v6 |

| Storage | IPFS via Pinata (v3 Files API) |

| Wallet | MetaMask + EIP-1193 provider |

| Testing | Hardhat + Mocha/Chai |

| Cryptography | `keccak256` content hashing, ECDSA signatures, on-chain `ecrecover` verification |



\---



\## Project Structure



146-Group-8/

├── smartcontracts/

│   ├── contracts/

│   │   └── DecentralizedVideo.sol

│   ├── scripts/

│   │   └── deploy.js

│   ├── test/

│   └── hardhat.config.js

├── frontend/

│   ├── src/

│   │   ├── pages/

│   │   │   ├── BrowsePage.jsx

│   │   │   ├── DashboardPage.jsx

│   │   │   └── PlayerPage.jsx

│   │   ├── components/

│   │   │   ├── Navbar.jsx

│   │   │   ├── WalletConnect.jsx

│   │   │   └── VideoCard.jsx

│   │   ├── context/

│   │   │   └── WalletContext.jsx

│   │   ├── hooks/

│   │   │   └── useContract.js

│   │   ├── services/

│   │   │   └── pinata.js

│   │   └── contract/

│   │       └── index.js

│   ├── .env

│   └── package.json

├── docs/screenshots/

└── README.md



\---



\## Running Locally



\### Prerequisites



\- Node.js v18 or later

\- MetaMask browser extension

\- A free Pinata account (https://app.pinata.cloud) for an IPFS API key



\### 1. Clone the repo



git clone https://github.com/CSUS146-SP26/146-Group-8.git

cd 146-Group-8



\### 2. Start the local blockchain (Terminal A)



cd smartcontracts

npm install

npx hardhat node



Leave this terminal running. The deploy script auto-runs on node startup, registering the contract at `0x5FbDB2315678afecb367f032d93F642f64180aa3`.



\### 3. Configure the frontend (Terminal B)



cd frontend

npm install



Create `frontend/.env`:



VITE\_PINATA\_JWT=<your-pinata-jwt-here>



The JWT must have \*\*V3 Resources → Files: Write\*\* permission.



\### 4. Start the frontend

npm run dev



Open `http://localhost:5173` in Chrome.



\### 5. MetaMask setup



\- Add a custom network: \*\*Localhost 8545\*\*, chainId \*\*31337\*\*

\- Import a Hardhat dev account (private keys are printed on node startup) — Account #0 has 10,000 test ETH

\- Connect via the \*\*Connect Wallet\*\* button in the navbar



\---



\## End-to-End Flow



1\. \*\*As Creator\*\* (Account #0):

&#x20;  - Dashboard → upload a file → sign with MetaMask → confirm tx

&#x20;  - Video appears on the Browse page tagged "live on-chain"

2\. \*\*As Viewer\*\* (switch to Account #1 in MetaMask):

&#x20;  - Click the video on Browse → \*\*Pay to Watch\*\* → confirm 0.01 ETH

&#x20;  - Player unlocks → file streams from `gateway.pinata.cloud`

&#x20;  - Optionally send a tip

3\. \*\*Back as Creator\*\*:

&#x20;  - Dashboard shows accumulated earnings → \*\*Withdraw to Wallet\*\*

&#x20;  - ETH lands in the wallet, on-chain balance resets to zero



\---



\## Performance



The platform's value vs. YouTube's 45% revenue cut is verifiable in raw transaction costs:



\- \*\*Upload (`uploadVideo`)\*\*: \~125,000 gas (one-time per video)

\- \*\*Pay-to-watch (`payToWatch`)\*\*: \~50,000 gas (per viewer)

\- \*\*Tip (`tipCreator`)\*\*: \~30,000 gas (per tip)

\- \*\*Withdraw (`withdrawEarnings`)\*\*: \~25,000 gas (per cashout)



At 10 gwei gas price and $3,000 ETH, a creator earning $1,000 in tips on YouTube loses \*\*$450\*\* to platform fees. On DecentTube, the same creator pays roughly \*\*$0.75 in gas\*\* and receives the full amount.



\---



\## Current Status



\- \[x] Solidity smart contract (`DecentralizedVideo.sol`)

\- \[x] ECDSA signature verification via `ecrecover`

\- \[x] Hardhat tests + automatic local deploy

\- \[x] React frontend (Browse, Dashboard, Player)

\- \[x] MetaMask integration with unified `WalletContext`

\- \[x] IPFS upload via Pinata v3 SDK

\- \[x] End-to-end signing → upload → on-chain registration flow

\- \[x] Pay-to-watch + tip + withdraw flows

\- \[ ] Sepolia testnet deployment (stretch)

\- \[ ] Decentralized ad monetization pool (stretch)

\- \[ ] DAO-based content moderation (stretch)



\---



\## License



Academic project — CSC 146, California State University, Sacramento, Spring 2026.




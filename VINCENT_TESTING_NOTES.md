# Vincent Testing Notes

## Tester
Vincent Lam

## Environment
- Repo: 146-Group-8
- Frontend: React + Vite
- Smart Contracts: Hardhat
- Wallet: MetaMask
- Network: Hardhat Local (31337)

## Setup Completed
- Installed dependencies
- Started Hardhat local node
- Deployed DecentralizedVideo contract
- Connected MetaMask to Hardhat Local
- Imported funded Hardhat account
- Connected wallet to frontend

## Successful Tests

### Success 1 - Upload Video
- Uploaded and registered Test Video on-chain
- MetaMask contract interaction confirmed
- Status: PASS

### Success 2 - Browse Page
- Browse page displayed 1 live on-chain uploaded video
- Test Video appeared successfully
- Status: PASS

## Bugs Found

### Bug 1 - Invalid Sample Videos
- payToWatch failed with "Video does not exist"
- Frontend sample cards did not match contract data

### Bug 2 - Error Persistence
- Old error message remained visible after navigating to Dashboard

### Bug 3 - UI Refresh Delay
- Uploaded content may require refresh to appear immediately

### Bug 4 - Wallet State Lost on Player Page
- Browse page shows connected wallet
- Player page says "Please connect your wallet first"

## Recommendations

- Store wallet connection globally with React Context
- Reconnect wallet on page load using eth_accounts
- Clear previous errors on route changes
- Remove mock sample data or sync IDs with contract

## Contribution Summary

Performed end-to-end frontend testing, validated upload flow, confirmed live on-chain browse integration, and identified multiple wallet/player state bugs.
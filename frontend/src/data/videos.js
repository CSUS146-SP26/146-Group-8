export const VIDEOS = [
  {
    id: 1,
    title: "Intro to Solidity Smart Contracts",
    creator: "0x1234567890abcdef1234567890abcdef12345678",
    price: "0.01",
    thumbnail: "https://picsum.photos/seed/sol/400/220",
    ipfsCid: "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco",
    duration: "12:34",
  },
  {
    id: 2,
    title: "Building a DApp with React and ethers.js",
    creator: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
    price: "0.02",
    thumbnail: "https://picsum.photos/seed/dapp/400/220",
    ipfsCid: "QmYwAPJzv5CZsnAzt8auV39s1234abcdef5678",
    duration: "24:10",
  },
  {
    id: 3,
    title: "IPFS and Decentralized Storage Explained",
    creator: "0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef",
    price: "0.005",
    thumbnail: "https://picsum.photos/seed/ipfs/400/220",
    ipfsCid: "QmZbj5ruYneZb8Hip6NuDULaTuyHuBjcUFBFxFpDQHQFuL",
    duration: "18:45",
  },
  {
    id: 4,
    title: "NFT Ownership with ERC-721 Tokens",
    creator: "0x1234567890abcdef1234567890abcdef12345678",
    price: "0.015",
    thumbnail: "https://picsum.photos/seed/nft/400/220",
    ipfsCid: "QmPZ9gcCEpqKTo6aq61g2nXGUhM4iCL3ewB6LDXZCtioEB",
    duration: "31:02",
  },
  {
    id: 5,
    title: "MetaMask Wallet Integration Tutorial",
    creator: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
    price: "0.008",
    thumbnail: "https://picsum.photos/seed/meta/400/220",
    ipfsCid: "QmT78zSuBmuS4z925WZfrqQ1qHaJ56DQaTfyMUF7F8ff5o",
    duration: "09:55",
  },
  {
    id: 6,
    title: "Ethereum Gas Fees and Optimization",
    creator: "0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef",
    price: "0.012",
    thumbnail: "https://picsum.photos/seed/gas/400/220",
    ipfsCid: "QmW2WQi7j6c7UgJTarActp7tDNikE4B2qXtFCfLPdsgaTQ",
    duration: "15:20",
  },
];

export function shortAddress(addr) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export const CONTRACT_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "name": "creator", "type": "address" },
      { "indexed": false, "name": "amount", "type": "uint256" }
    ],
    "name": "EarningsWithdrawn",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "name": "videoId", "type": "uint256" },
      { "indexed": true, "name": "from", "type": "address" },
      { "indexed": true, "name": "creator", "type": "address" },
      { "indexed": false, "name": "amount", "type": "uint256" }
    ],
    "name": "CreatorTipped",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "name": "videoId", "type": "uint256" },
      { "indexed": true, "name": "viewer", "type": "address" },
      { "indexed": false, "name": "amount", "type": "uint256" }
    ],
    "name": "VideoPurchased",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "name": "videoId", "type": "uint256" },
      { "indexed": true, "name": "creator", "type": "address" },
      { "indexed": false, "name": "cid", "type": "string" },
      { "indexed": false, "name": "price", "type": "uint256" }
    ],
    "name": "VideoUploaded",
    "type": "event"
  },
  {
    "inputs": [
      { "name": "viewer", "type": "address" },
      { "name": "videoId", "type": "uint256" }
    ],
    "name": "hasAccess",
    "outputs": [{ "name": "", "type": "bool" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "name": "videoId", "type": "uint256" }],
    "name": "payToWatch",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{ "name": "videoId", "type": "uint256" }],
    "name": "tipCreator",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "withdrawEarnings",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "name": "cid", "type": "string" },
      { "name": "contentHash", "type": "bytes32" },
      { "name": "signature", "type": "bytes" },
      { "name": "price", "type": "uint256" },
      { "name": "title", "type": "string" }
    ],
    "name": "uploadVideo",
    "outputs": [{ "name": "videoId", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "name": "videoId", "type": "uint256" }],
    "name": "getVideoMetadata",
    "outputs": [
      { "name": "", "type": "address" },
      { "name": "", "type": "string" },
      { "name": "", "type": "bytes32" },
      { "name": "", "type": "uint256" },
      { "name": "", "type": "string" },
      { "name": "", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "name": "", "type": "address" }],
    "name": "earnings",
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "nextVideoId",
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
];
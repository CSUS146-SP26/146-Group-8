// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DecentralizedVideo {
    // Define the Video struct
    struct Video {
        address creator;
        string  cid;
        bytes32 contentHash;
        uint256 price;
        string  title;
        uint256 viewCount;
    }

    address public owner;
    uint256 public nextVideoId;

    // Mapping to store videos by ID
    mapping(uint256 => Video) public videos;
    mapping(uint256 => mapping(address => bool)) public access;
    mapping(address => uint256) public earnings;

    // Events
    event VideoUploaded(uint256 indexed videoId, address indexed creator, string cid, uint256 price);
    event VideoPurchased(uint256 indexed videoId, address indexed viewer, uint256 amount);
    event CreatorTipped(uint256 indexed videoId, address indexed from, address indexed creator, uint256 amount);
    event EarningsWithdrawn(address indexed creator, uint256 amount);

    modifier videoExists(uint256 videoId) {
        require(videos[videoId].creator != address(0), "Video does not exist");
        _;
    }

    constructor() {
        owner = msg.sender;
    }
    // Creator uploads video onto the blockchain.
    function uploadVideo(
        string memory cid,
        bytes32 contentHash,
        uint256 price,
        string memory title
    ) public returns (uint256 videoId) {
        videoId = nextVideoId;
        videos[videoId] = Video(msg.sender, cid, contentHash, price, title, 0);
        nextVideoId++;
        emit VideoUploaded(videoId, msg.sender, cid, price);
    }
    // User pays to watch a video
    function payToWatch(uint256 videoId) public payable videoExists(videoId) {
        Video storage v = videos[videoId];
        require(msg.value >= v.price, "Insufficient payment");
        require(!access[videoId][msg.sender], "Already purchased");

        access[videoId][msg.sender] = true;
        earnings[v.creator] += msg.value;
        v.viewCount += 1;

        emit VideoPurchased(videoId, msg.sender, msg.value);
    }
    // Viewer sends a creator a tip
    function tipCreator(uint256 videoId) public payable videoExists(videoId) {
        require(msg.value > 0, "Tip must be greater than 0");
        address creator = videos[videoId].creator;
        earnings[creator] += msg.value;
        emit CreatorTipped(videoId, msg.sender, creator, msg.value);
    }
    // Creator withdraws earnings
    function withdrawEarnings() public {
        uint256 amount = earnings[msg.sender];
        require(amount > 0, "Nothing to withdraw");

        earnings[msg.sender] = 0;
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");

        emit EarningsWithdrawn(msg.sender, amount);
    }
    // checks if a viewer has access to a video
    function hasAccess(address viewer, uint256 videoId) public view returns (bool) {
        if (videos[videoId].creator == viewer) return true;
        return access[videoId][viewer];
    }
     // Get video metadata
    function getVideoMetadata(uint256 videoId) public view returns (
        address, string memory, bytes32, uint256, string memory, uint256
    ) {
        Video storage v = videos[videoId];
        return (v.creator, v.cid, v.contentHash, v.price, v.title, v.viewCount);
    }
}
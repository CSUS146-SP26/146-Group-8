// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

/**
 * @title DecentralizedVideo
 * @notice Pay-to-watch video platform with on-chain ownership via ECDSA signatures.
 * @dev Creators sign keccak256(contentHash || creatorAddress) off-chain.
 *      The contract verifies the signature with ecrecover before storing the video,
 *      cryptographically binding the content to its creator.
 */
contract DecentralizedVideo {
    using ECDSA for bytes32;
    using MessageHashUtils for bytes32;

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

    mapping(uint256 => Video) public videos;
    mapping(uint256 => mapping(address => bool)) public access;
    mapping(address => uint256) public earnings;

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

    /**
     * @notice Register a video on-chain after verifying the creator's signature.
     * @param cid          IPFS CID of the uploaded video file
     * @param contentHash  keccak256 of the raw video bytes (computed by the uploader)
     * @param signature    ECDSA signature over keccak256(contentHash || msg.sender),
     *                     produced via personal_sign / signer.signMessage()
     * @param price        Price in wei a viewer pays to unlock the video
     * @param title        Display title
     */
    function uploadVideo(
        string memory cid,
        bytes32 contentHash,
        bytes memory signature,
        uint256 price,
        string memory title
    ) public returns (uint256 videoId) {
        // Reconstruct the ownership fingerprint exactly as the frontend computes it.
        bytes32 fingerprint = keccak256(abi.encodePacked(contentHash, msg.sender));

        // Apply the EIP-191 prefix that personal_sign / signMessage adds,
        // then recover the signer and confirm it matches the caller.
        address signer = fingerprint.toEthSignedMessageHash().recover(signature);
        require(signer == msg.sender, "Invalid signature: signer != caller");

        videoId = nextVideoId;
        videos[videoId] = Video(msg.sender, cid, contentHash, price, title, 0);
        nextVideoId++;

        emit VideoUploaded(videoId, msg.sender, cid, price);
    }

    function payToWatch(uint256 videoId) public payable videoExists(videoId) {
        Video storage v = videos[videoId];
        require(msg.value >= v.price, "Insufficient payment");
        require(!access[videoId][msg.sender], "Already purchased");

        access[videoId][msg.sender] = true;
        earnings[v.creator] += msg.value;
        v.viewCount += 1;

        emit VideoPurchased(videoId, msg.sender, msg.value);
    }

    function tipCreator(uint256 videoId) public payable videoExists(videoId) {
        require(msg.value > 0, "Tip must be greater than 0");
        address creator = videos[videoId].creator;
        earnings[creator] += msg.value;
        emit CreatorTipped(videoId, msg.sender, creator, msg.value);
    }

    function withdrawEarnings() public {
        uint256 amount = earnings[msg.sender];
        require(amount > 0, "Nothing to withdraw");
        earnings[msg.sender] = 0;
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");
        emit EarningsWithdrawn(msg.sender, amount);
    }

    function hasAccess(address viewer, uint256 videoId) public view returns (bool) {
        if (videos[videoId].creator == viewer) return true;
        return access[videoId][viewer];
    }

    function getVideoMetadata(uint256 videoId) public view returns (
        address, string memory, bytes32, uint256, string memory, uint256
    ) {
        Video storage v = videos[videoId];
        return (v.creator, v.cid, v.contentHash, v.price, v.title, v.viewCount);
    }
}
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DecentralizedVideo", function () {
  let contract;
  let owner, creator, viewer, attacker;

  function buildFingerprint(contentHash, creatorAddress) {
    return ethers.keccak256(
      ethers.solidityPacked(["bytes32", "address"], [contentHash, creatorAddress])
    );
  }

  async function signFingerprint(signer, fingerprint) {
    return signer.signMessage(ethers.getBytes(fingerprint));
  }

  beforeEach(async function () {
    [owner, creator, viewer, attacker] = await ethers.getSigners();
    const Factory = await ethers.getContractFactory("DecentralizedVideo");
    contract = await Factory.deploy();
    await contract.waitForDeployment();
  });

  describe("Deployment", function () {
    it("sets the deployer as owner", async function () {
      expect(await contract.owner()).to.equal(owner.address);
    });

    it("starts with nextVideoId = 0", async function () {
      expect(await contract.nextVideoId()).to.equal(0);
    });
  });

  describe("uploadVideo with ECDSA signature verification", function () {
    const cid = "QmTestCID123abcDEF";
    const title = "My Test Video";
    const price = ethers.parseEther("0.01");
    let contentHash;

    beforeEach(function () {
      contentHash = ethers.keccak256(ethers.toUtf8Bytes("fake video bytes"));
    });

    it("accepts a valid signature from the creator", async function () {
      const fingerprint = buildFingerprint(contentHash, creator.address);
      const signature = await signFingerprint(creator, fingerprint);

      await expect(
        contract.connect(creator).uploadVideo(cid, contentHash, signature, price, title)
      ).to.emit(contract, "VideoUploaded").withArgs(0, creator.address, cid, price);

      expect(await contract.nextVideoId()).to.equal(1);

      const meta = await contract.getVideoMetadata(0);
      expect(meta[0]).to.equal(creator.address);
      expect(meta[1]).to.equal(cid);
      expect(meta[2]).to.equal(contentHash);
      expect(meta[3]).to.equal(price);
      expect(meta[4]).to.equal(title);
    });

    it("rejects a signature from a different signer (impersonation attempt)", async function () {
      const fingerprint = buildFingerprint(contentHash, creator.address);
      const wrongSig = await signFingerprint(attacker, fingerprint);

      await expect(
        contract.connect(creator).uploadVideo(cid, contentHash, wrongSig, price, title)
      ).to.be.revertedWith("Invalid signature: signer != caller");
    });

    it("rejects a signature over different content (tampering attempt)", async function () {
      const fingerprint = buildFingerprint(contentHash, creator.address);
      const signature = await signFingerprint(creator, fingerprint);

      const differentHash = ethers.keccak256(ethers.toUtf8Bytes("DIFFERENT video"));

      await expect(
        contract.connect(creator).uploadVideo(cid, differentHash, signature, price, title)
      ).to.be.revertedWith("Invalid signature: signer != caller");
    });
  });

  describe("payToWatch", function () {
    let videoId, price;

    beforeEach(async function () {
      const cid = "QmPayTest";
      const contentHash = ethers.keccak256(ethers.toUtf8Bytes("pay video"));
      price = ethers.parseEther("0.01");
      const fingerprint = buildFingerprint(contentHash, creator.address);
      const sig = await signFingerprint(creator, fingerprint);
      await contract.connect(creator).uploadVideo(cid, contentHash, sig, price, "Pay Video");
      videoId = 0;
    });

    it("grants access when viewer pays", async function () {
      await contract.connect(viewer).payToWatch(videoId, { value: price });
      expect(await contract.hasAccess(viewer.address, videoId)).to.equal(true);
    });

    it("credits the creator's earnings", async function () {
      await contract.connect(viewer).payToWatch(videoId, { value: price });
      expect(await contract.earnings(creator.address)).to.equal(price);
    });

    it("rejects insufficient payment", async function () {
      await expect(
        contract.connect(viewer).payToWatch(videoId, { value: ethers.parseEther("0.001") })
      ).to.be.revertedWith("Insufficient payment");
    });

    it("rejects double purchase", async function () {
      await contract.connect(viewer).payToWatch(videoId, { value: price });
      await expect(
        contract.connect(viewer).payToWatch(videoId, { value: price })
      ).to.be.revertedWith("Already purchased");
    });

    it("rejects payment for nonexistent video", async function () {
      await expect(
        contract.connect(viewer).payToWatch(99, { value: price })
      ).to.be.revertedWith("Video does not exist");
    });

    it("increments view count", async function () {
      await contract.connect(viewer).payToWatch(videoId, { value: price });
      const meta = await contract.getVideoMetadata(videoId);
      expect(meta[5]).to.equal(1);
    });
  });

  describe("tipCreator", function () {
    let videoId;

    beforeEach(async function () {
      const cid = "QmTipTest";
      const contentHash = ethers.keccak256(ethers.toUtf8Bytes("tip video"));
      const fingerprint = buildFingerprint(contentHash, creator.address);
      const sig = await signFingerprint(creator, fingerprint);
      await contract.connect(creator).uploadVideo(cid, contentHash, sig, ethers.parseEther("0.01"), "Tip Video");
      videoId = 0;
    });

    it("credits the creator with the tip", async function () {
      const tip = ethers.parseEther("0.005");
      await contract.connect(viewer).tipCreator(videoId, { value: tip });
      expect(await contract.earnings(creator.address)).to.equal(tip);
    });

    it("rejects zero tips", async function () {
      await expect(
        contract.connect(viewer).tipCreator(videoId, { value: 0 })
      ).to.be.revertedWith("Tip must be greater than 0");
    });
  });

  describe("withdrawEarnings", function () {
    beforeEach(async function () {
      const cid = "QmWithdrawTest";
      const contentHash = ethers.keccak256(ethers.toUtf8Bytes("withdraw video"));
      const price = ethers.parseEther("0.01");
      const fingerprint = buildFingerprint(contentHash, creator.address);
      const sig = await signFingerprint(creator, fingerprint);
      await contract.connect(creator).uploadVideo(cid, contentHash, sig, price, "Withdraw Video");
      await contract.connect(viewer).payToWatch(0, { value: price });
    });

    it("transfers earnings to the creator", async function () {
      const before = await ethers.provider.getBalance(creator.address);
      const tx = await contract.connect(creator).withdrawEarnings();
      const receipt = await tx.wait();
      const gasCost = receipt.gasUsed * receipt.gasPrice;
      const after = await ethers.provider.getBalance(creator.address);
      const expected = before + ethers.parseEther("0.01") - gasCost;
      expect(after).to.equal(expected);
    });

    it("zeroes out earnings after withdrawal", async function () {
      await contract.connect(creator).withdrawEarnings();
      expect(await contract.earnings(creator.address)).to.equal(0);
    });

    it("rejects withdrawal with zero balance", async function () {
      await expect(
        contract.connect(attacker).withdrawEarnings()
      ).to.be.revertedWith("Nothing to withdraw");
    });
  });
});
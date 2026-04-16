// How to run:
//   1. npx hardhat compile
//   2. Run all tests: npx hardhat test


const { expect } = require("chai");
const { ethers } = require("hardhat");

// Test the contract
describe("DecentralizedVideo", function () {
  let contract, creator, viewer;

  function fakeHash() {
    return ethers.keccak256(ethers.toUtf8Bytes("fake-video-bytes"));
  }

  // Runs before each test
  beforeEach(async () => {
    // Test accounts creator and viewer
    [creator, viewer] = await ethers.getSigners();

    const Factory = await ethers.getContractFactory("DecentralizedVideo");
    contract = await Factory.deploy();
    await contract.waitForDeployment();
  });

  // Test: creator can upload a video and data is stored correctly
  it("uploads a video", async () => {
    const price = ethers.parseEther("0.01");

    await expect(
      contract.connect(creator).uploadVideo("QmCID1", fakeHash(), price, "First Video")
    ).to.emit(contract, "VideoUploaded");

    // Verify the stored data
    const [vCreator, vCid, , vPrice, vTitle] = await contract.getVideoMetadata(0);
    expect(vCreator).to.equal(creator.address);
    expect(vCid).to.equal("QmCID1");
    expect(vPrice).to.equal(price);
    expect(vTitle).to.equal("First Video");
  });

  // Test: viewer pays ETH and gets access to watch
  it("lets a viewer pay to watch", async () => {
    const price = ethers.parseEther("0.02");
    await contract.connect(creator).uploadVideo("QmCID2", fakeHash(), price, "Paid");

    // Viewer pays the price 
    await expect(contract.connect(viewer).payToWatch(0, { value: price }))
      .to.emit(contract, "VideoPurchased");

    expect(await contract.hasAccess(viewer.address, 0)).to.equal(true);
    expect(await contract.earnings(creator.address)).to.equal(price);
  });

  // Test: underpayment and double purchase both get rejected
  it("rejects underpayment and double purchase", async () => {
    const price = ethers.parseEther("0.02");
    await contract.connect(creator).uploadVideo("QmCID3", fakeHash(), price, "X");

    await expect(
      contract.connect(viewer).payToWatch(0, { value: ethers.parseEther("0.001") })
    ).to.be.revertedWith("Insufficient payment");
    await contract.connect(viewer).payToWatch(0, { value: price });

    await expect(
      contract.connect(viewer).payToWatch(0, { value: price })
    ).to.be.revertedWith("Already purchased");
  });

  // Test: paying for a video that was never uploaded should fail
  it("rejects paying for a non-existent video", async () => {
    await expect(
      contract.connect(viewer).payToWatch(99, { value: ethers.parseEther("0.01") })
    ).to.be.revertedWith("Video does not exist");
  });

  // Test: viewer can tip video creator
  it("accepts tips", async () => {
    await contract.connect(creator).uploadVideo("QmCID4", fakeHash(), 0, "Free");
    const tip = ethers.parseEther("0.005");

       await expect(contract.connect(viewer).tipCreator(0, { value: tip }))
      .to.emit(contract, "CreatorTipped");

    expect(await contract.earnings(creator.address)).to.equal(tip);
  });

  // Test: creator can withdraw their earnings
  it("lets the creator withdraw earnings", async () => {
    const price = ethers.parseEther("0.03");
    await contract.connect(creator).uploadVideo("QmCID5", fakeHash(), price, "Y");
    await contract.connect(viewer).payToWatch(0, { value: price });

    const before = await ethers.provider.getBalance(creator.address);
    const tx = await contract.connect(creator).withdrawEarnings();
    const receipt = await tx.wait();
    const gas = receipt.gasUsed * receipt.gasPrice;
    const after = await ethers.provider.getBalance(creator.address);

    expect(after - before + gas).to.equal(price);

    // Second withdrawal should fail since balance is 0
    await expect(
      contract.connect(creator).withdrawEarnings()
    ).to.be.revertedWith("Nothing to withdraw");
  });
});

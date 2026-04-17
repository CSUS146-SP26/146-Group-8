import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../contract/index.js";

export function useContract() {
  const [contract, setContract] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [earnings, setEarnings] = useState("0");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize provider + contract on load
  useEffect(() => {
    if (!window.ethereum) return;
    const p = new ethers.BrowserProvider(window.ethereum);
    setProvider(p);
    const readOnly = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, p);
    setContract(readOnly);

    // Listen for account changes
    window.ethereum.on("accountsChanged", (accounts) => {
      setAccount(accounts[0] || null);
    });
  }, []);

  // Connect wallet
  async function connectWallet() {
    try {
      setError(null);
      const accounts = await provider.send("eth_requestAccounts", []);
      const s = await provider.getSigner();
      setSigner(s);
      setAccount(accounts[0]);
      // Reconnect contract with signer for write operations
      const c = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, s);
      setContract(c);
      return accounts[0];
    } catch (err) {
      setError("Wallet connection rejected.");
      return null;
    }
  }

  // Upload a video on-chain
  async function uploadVideo(cid, title, priceEth) {
    try {
      setLoading(true);
      setError(null);
      const priceWei = ethers.parseEther(priceEth.toString());
      // Compute contentHash = keccak256(cid + creator address)
      const contentHash = ethers.keccak256(
        ethers.solidityPacked(["string", "address"], [cid, account])
      );
      const tx = await contract.uploadVideo(cid, contentHash, priceWei, title);
      const receipt = await tx.wait();
      console.log("Video uploaded, tx:", receipt.hash);
      return receipt;
    } catch (err) {
      setError(err.message || "Upload failed.");
      return null;
    } finally {
      setLoading(false);
    }
  }

  // Pay to watch a video
  async function payToWatch(videoId, priceWei) {
    try {
      setLoading(true);
      setError(null);
      const tx = await contract.payToWatch(videoId, { value: priceWei });
      const receipt = await tx.wait();
      console.log("Payment confirmed, tx:", receipt.hash);
      return receipt;
    } catch (err) {
      setError(err.message || "Payment failed.");
      return null;
    } finally {
      setLoading(false);
    }
  }

  // Tip a creator
  async function tipCreator(videoId, tipEth) {
    try {
      setLoading(true);
      setError(null);
      const tipWei = ethers.parseEther(tipEth.toString());
      const tx = await contract.tipCreator(videoId, { value: tipWei });
      const receipt = await tx.wait();
      console.log("Tip sent, tx:", receipt.hash);
      return receipt;
    } catch (err) {
      setError(err.message || "Tip failed.");
      return null;
    } finally {
      setLoading(false);
    }
  }

  // Withdraw earnings
  async function withdrawEarnings() {
    try {
      setLoading(true);
      setError(null);
      const tx = await contract.withdrawEarnings();
      const receipt = await tx.wait();
      console.log("Withdrawn, tx:", receipt.hash);
      await fetchEarnings();
      return receipt;
    } catch (err) {
      setError(err.message || "Withdraw failed.");
      return null;
    } finally {
      setLoading(false);
    }
  }

  // Check if viewer has access
  async function checkAccess(videoId) {
    if (!account || !contract) return false;
    try {
      return await contract.hasAccess(account, videoId);
    } catch {
      return false;
    }
  }

  // Fetch on-chain earnings for connected wallet
  const fetchEarnings = useCallback(async () => {
    if (!account || !contract) return;
    try {
      const raw = await contract.earnings(account);
      setEarnings(ethers.formatEther(raw));
    } catch {}
  }, [account, contract]);

  useEffect(() => {
    if (account) fetchEarnings();
  }, [account, fetchEarnings]);

  // Fetch all videos from chain
  async function fetchVideos() {
    if (!contract) return [];
    try {
      const count = await contract.nextVideoId();
      const videos = [];
      for (let i = 0; i < Number(count); i++) {
        const [creator, cid, contentHash, price, title, viewCount] =
          await contract.getVideoMetadata(i);
        videos.push({
          id: i,
          creator,
          ipfsCid: cid,
          contentHash,
          price: ethers.formatEther(price),
          priceWei: price,
          title,
          viewCount: Number(viewCount),
          thumbnail: `https://picsum.photos/seed/${cid.slice(0, 6)}/400/220`,
          duration: "—",
        });
      }
      return videos;
    } catch (err) {
      console.error("fetchVideos error:", err);
      return [];
    }
  }

  return {
    account,
    contract,
    earnings,
    loading,
    error,
    connectWallet,
    uploadVideo,
    payToWatch,
    tipCreator,
    withdrawEarnings,
    checkAccess,
    fetchVideos,
    fetchEarnings,
  };
}

import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../contract/index.js";
import { useWallet } from "../context/WalletContext";

/**
 * useContract: read+write ethers Contract bound to the connected wallet.
 *
 * Reads account/signer/provider from WalletContext (single source of truth).
 * Returns the same API as before so existing pages don't need changes,
 * plus a new signContentOwnership helper for Phase 5's upload signing flow.
 */
export function useContract() {
  const { account, provider, signer } = useWallet();
  const [contract, setContract] = useState(null);
  const [earnings, setEarnings] = useState("0");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Build the contract instance whenever wallet state changes.
  // Use signer for writes when connected; fall back to provider for read-only.
  useEffect(() => {
    if (signer) {
      setContract(new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer));
    } else if (provider) {
      setContract(new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider));
    } else {
      setContract(null);
    }
  }, [signer, provider]);

  /**
   * Sign the ownership fingerprint for a video upload.
   * Frontend computes keccak256(contentHash || creator), then asks MetaMask
   * to sign it with personal_sign. Contract verifies via ecrecover.
   */
  async function signContentOwnership(contentHash) {
    if (!signer || !account) throw new Error("Wallet not connected");
    const fingerprint = ethers.keccak256(
      ethers.solidityPacked(["bytes32", "address"], [contentHash, account])
    );
    const signature = await signer.signMessage(ethers.getBytes(fingerprint));
    return { fingerprint, signature };
  }

  async function uploadVideo(cid, contentHash, signature, title, priceEth) {
    try {
      setLoading(true);
      setError(null);
      const priceWei = ethers.parseEther(priceEth.toString());
      const tx = await contract.uploadVideo(cid, contentHash, signature, priceWei, title);
      const receipt = await tx.wait();
      console.log("Video uploaded, tx:", receipt.hash);
      return receipt;
    } catch (err) {
      console.error("uploadVideo error:", err);
      setError(err.shortMessage || err.message || "Upload failed.");
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function payToWatch(videoId, priceWei) {
    try {
      setLoading(true);
      setError(null);
      const tx = await contract.payToWatch(videoId, { value: priceWei });
      const receipt = await tx.wait();
      console.log("Payment confirmed, tx:", receipt.hash);
      return receipt;
    } catch (err) {
      console.error("payToWatch error:", err);
      setError(err.shortMessage || err.message || "Payment failed.");
      return null;
    } finally {
      setLoading(false);
    }
  }

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
      console.error("tipCreator error:", err);
      setError(err.shortMessage || err.message || "Tip failed.");
      return null;
    } finally {
      setLoading(false);
    }
  }

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
      console.error("withdrawEarnings error:", err);
      setError(err.shortMessage || err.message || "Withdraw failed.");
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function checkAccess(videoId) {
    if (!account || !contract) return false;
    try {
      return await contract.hasAccess(account, videoId);
    } catch {
      return false;
    }
  }

  const fetchEarnings = useCallback(async () => {
    if (!account || !contract) return;
    try {
      const raw = await contract.earnings(account);
      setEarnings(ethers.formatEther(raw));
    } catch (err) {
      console.error("fetchEarnings error:", err);
    }
  }, [account, contract]);

  useEffect(() => {
    if (account && contract) fetchEarnings();
  }, [account, contract, fetchEarnings]);

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
    uploadVideo,
    signContentOwnership,
    payToWatch,
    tipCreator,
    withdrawEarnings,
    checkAccess,
    fetchVideos,
    fetchEarnings,
  };
}
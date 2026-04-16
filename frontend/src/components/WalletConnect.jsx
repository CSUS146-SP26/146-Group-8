import { useState, useEffect } from "react";
import { ethers } from "ethers";

export default function WalletConnect({ onAccountChange }) {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("connectedAccount");
    if (saved) reconnect(saved);
  }, []);

  async function reconnect(savedAccount) {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.listAccounts();
      const match = accounts.find(a => a.address.toLowerCase() === savedAccount.toLowerCase());
      if (match) {
        const bal = await provider.getBalance(match.address);
        setAccount(match.address);
        setBalance(ethers.formatEther(bal));
        if (onAccountChange) onAccountChange(match.address);
      }
    } catch {}
  }

  async function connectWallet() {
    setError(null);
    if (!window.ethereum) { setError("MetaMask not detected."); return; }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const address = accounts[0];
      const bal = await provider.getBalance(address);
      setAccount(address);
      setBalance(ethers.formatEther(bal));
      localStorage.setItem("connectedAccount", address);
      if (onAccountChange) onAccountChange(address);
    } catch { setError("Connection rejected."); }
  }

  function disconnect() {
    setAccount(null); setBalance(null);
    localStorage.removeItem("connectedAccount");
    if (onAccountChange) onAccountChange(null);
  }

  const short = (addr) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  return (
    <div>
      {account ? (
        <div style={styles.connected}>
          <div style={styles.walletInfo}>
            <span style={styles.dot} />
            <span style={styles.address}>{short(account)}</span>
            <span style={styles.divider}>|</span>
            <span style={styles.balance}>{parseFloat(balance).toFixed(4)} ETH</span>
          </div>
          <button style={styles.disconnectBtn} onClick={disconnect}>Disconnect</button>
        </div>
      ) : (
        <button style={styles.connectBtn} onClick={connectWallet}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="7" width="20" height="14" rx="2"/>
            <path d="M16 3H8L2 7h20l-6-4z"/>
            <circle cx="17" cy="14" r="1" fill="currentColor"/>
          </svg>
          Connect Wallet
        </button>
      )}
      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
}

const styles = {
  connected: {
    display: "flex", alignItems: "center", gap: "8px",
    background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "10px", padding: "6px 6px 6px 12px",
  },
  walletInfo: { display: "flex", alignItems: "center", gap: "8px" },
  dot: { width: "7px", height: "7px", borderRadius: "50%", background: "#10b981", flexShrink: 0 },
  address: { fontSize: "13px", fontWeight: "500", color: "#f1f0ff", fontFamily: "'JetBrains Mono', monospace" },
  divider: { color: "rgba(255,255,255,0.15)", fontSize: "12px" },
  balance: { fontSize: "12px", color: "#8b8aa3", fontFamily: "'JetBrains Mono', monospace" },
  disconnectBtn: {
    background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.2)",
    borderRadius: "7px", padding: "4px 10px", fontSize: "12px", fontWeight: "500",
    cursor: "pointer", color: "#f87171", fontFamily: "'Space Grotesk', sans-serif", transition: "all 0.2s",
  },
  connectBtn: {
    background: "#6366f1", color: "#fff", border: "none", borderRadius: "10px",
    padding: "9px 18px", fontSize: "13px", fontWeight: "600", cursor: "pointer",
    fontFamily: "'Space Grotesk', sans-serif", display: "flex", alignItems: "center",
    gap: "7px", transition: "all 0.2s", letterSpacing: "0.01em",
  },
  error: { color: "#f87171", fontSize: "12px", marginTop: "6px" },
};

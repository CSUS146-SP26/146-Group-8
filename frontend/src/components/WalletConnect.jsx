import { useState, useEffect } from "react";
import { ethers } from "ethers";

export default function WalletConnect() {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState(null);

  // Auto-reconnect if wallet was previously connected
  useEffect(() => {
    const saved = localStorage.getItem("connectedAccount");
    if (saved) reconnect(saved);
  }, []);

  async function reconnect(savedAccount) {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.listAccounts();
      const match = accounts.find(
        (a) => a.address.toLowerCase() === savedAccount.toLowerCase()
      );
      if (match) {
        const bal = await provider.getBalance(match.address);
        setAccount(match.address);
        setBalance(ethers.formatEther(bal));
      }
    } catch {}
  }

  async function connectWallet() {
    setError(null);
    if (!window.ethereum) {
      setError("MetaMask not detected. Please install it first.");
      return;
    }
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      const address = accounts[0];
      const bal = await provider.getBalance(address);
      setAccount(address);
      setBalance(ethers.formatEther(bal));
      localStorage.setItem("connectedAccount", address);
    } catch (err) {
      setError("Connection rejected.");
    }
  }

  function disconnect() {
    setAccount(null);
    setBalance(null);
    localStorage.removeItem("connectedAccount");
  }

  function shortAddress(addr) {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  }

  return (
    <div style={styles.container}>
      {account ? (
        <div style={styles.connected}>
          <div style={styles.info}>
            <span style={styles.dot} />
            <span style={styles.address}>{shortAddress(account)}</span>
            <span style={styles.balance}>
              {parseFloat(balance).toFixed(4)} ETH
            </span>
          </div>
          <button style={styles.disconnectBtn} onClick={disconnect}>
            Disconnect
          </button>
        </div>
      ) : (
        <button style={styles.connectBtn} onClick={connectWallet}>
          Connect Wallet
        </button>
      )}
      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "6px",
  },
  connectBtn: {
    background: "#2563EB",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "10px 20px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },
  connected: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    background: "#f1f5f9",
    borderRadius: "8px",
    padding: "8px 14px",
  },
  info: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  dot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#22c55e",
    display: "inline-block",
  },
  address: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#1e3a5f",
  },
  balance: {
    fontSize: "13px",
    color: "#555",
  },
  disconnectBtn: {
    background: "transparent",
    border: "1px solid #ccc",
    borderRadius: "6px",
    padding: "4px 10px",
    fontSize: "12px",
    cursor: "pointer",
    color: "#555",
  },
  error: {
    color: "#dc2626",
    fontSize: "12px",
    margin: 0,
  },
};

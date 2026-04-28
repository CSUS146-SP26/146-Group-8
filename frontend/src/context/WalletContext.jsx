import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";

/**
 * WalletContext: single source of truth for the connected MetaMask wallet.
 *
 * Why this exists:
 *   Previously WalletConnect (Navbar) and useContract (pages) each kept their
 *   own `account` state. Connecting in one didn't update the other, which is
 *   why PlayerPage said "please connect your wallet first" even after the
 *   navbar showed a connected address. Bug 4 from VINCENT_TESTING_NOTES.md.
 *
 * Now: every component reads useWallet() and gets the same account/signer.
 */

const WalletContext = createContext(null);

export function WalletProvider({ children }) {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [error, setError] = useState(null);

  // Refresh signer + balance for the active address.
  const refreshFor = useCallback(async (addr) => {
    if (!window.ethereum || !addr) return;
    try {
      const p = new ethers.BrowserProvider(window.ethereum);
      const s = await p.getSigner();
      const bal = await p.getBalance(addr);
      setProvider(p);
      setSigner(s);
      setBalance(ethers.formatEther(bal));
    } catch (err) {
      console.error("refreshFor failed:", err);
    }
  }, []);

  // Auto-reconnect on mount if MetaMask still has authorization for this site.
  useEffect(() => {
    if (!window.ethereum) return;

    const p = new ethers.BrowserProvider(window.ethereum);
    setProvider(p);

    (async () => {
      try {
        // listAccounts() does NOT prompt — only returns already-authorized accounts.
        const accounts = await p.listAccounts();
        const remembered = localStorage.getItem("connectedAccount");
        if (accounts.length > 0 && remembered) {
          const match = accounts.find(
            (a) => a.address.toLowerCase() === remembered.toLowerCase()
          );
          if (match) {
            setAccount(match.address);
            await refreshFor(match.address);
          }
        }
      } catch (err) {
        console.error("Auto-reconnect failed:", err);
      }
    })();

    // Listen for account switches in MetaMask.
    const handleAccountsChanged = async (accounts) => {
      if (accounts.length === 0) {
        // User disconnected from MetaMask
        setAccount(null);
        setSigner(null);
        setBalance(null);
        localStorage.removeItem("connectedAccount");
      } else {
        const newAccount = accounts[0];
        setAccount(newAccount);
        localStorage.setItem("connectedAccount", newAccount);
        await refreshFor(newAccount);
      }
    };

    // Reload on chain change (best practice — MetaMask docs recommend this).
    const handleChainChanged = () => {
      window.location.reload();
    };

    window.ethereum.on("accountsChanged", handleAccountsChanged);
    window.ethereum.on("chainChanged", handleChainChanged);

    return () => {
      if (window.ethereum?.removeListener) {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, [refreshFor]);

  async function connect() {
    setError(null);
    if (!window.ethereum) {
      setError("MetaMask not detected. Please install MetaMask.");
      return null;
    }
    try {
      const p = provider || new ethers.BrowserProvider(window.ethereum);
      const accounts = await p.send("eth_requestAccounts", []);
      const addr = accounts[0];
      setProvider(p);
      setAccount(addr);
      localStorage.setItem("connectedAccount", addr);
      await refreshFor(addr);
      return addr;
    } catch (err) {
      console.error("Connect failed:", err);
      setError("Connection rejected.");
      return null;
    }
  }

  function disconnect() {
    setAccount(null);
    setSigner(null);
    setBalance(null);
    localStorage.removeItem("connectedAccount");
  }

  const value = {
    provider,
    signer,
    account,
    balance,
    error,
    connect,
    disconnect,
    refreshBalance: () => account && refreshFor(account),
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) {
    throw new Error("useWallet must be used inside <WalletProvider>");
  }
  return ctx;
}
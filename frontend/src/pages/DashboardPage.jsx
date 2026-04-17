import { useState } from "react";
import { ethers } from "ethers";
import { shortAddress } from "../data/videos";

export default function DashboardPage({ contractHook, onUploadSuccess }) {
  const { account, uploadVideo, withdrawEarnings, earnings, loading, error } = contractHook;
  const [form, setForm] = useState({ title: "", price: "", cid: "" });
  const [uploaded, setUploaded] = useState(false);
  const [withdrawn, setWithdrawn] = useState(false);
  const [localError, setLocalError] = useState(null);

  async function handleUpload(e) {
    e.preventDefault();
    setLocalError(null);
    if (!account) { setLocalError("Connect your wallet first."); return; }
    if (!form.title || !form.price || !form.cid) { setLocalError("Please fill in all fields."); return; }
    const receipt = await uploadVideo(form.cid, form.title, form.price);
    if (receipt) {
      setUploaded(true);
      setForm({ title: "", price: "", cid: "" });
      if (onUploadSuccess) onUploadSuccess();
      setTimeout(() => setUploaded(false), 3000);
    }
  }

  async function handleWithdraw() {
    const receipt = await withdrawEarnings();
    if (receipt) { setWithdrawn(true); setTimeout(() => setWithdrawn(false), 3000); }
  }

  const displayError = localError || error;

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.pageTitle}>Creator Dashboard</h1>
        <p style={styles.pageSub}>
          {account ? shortAddress(account) : "Connect wallet to manage your content"}
        </p>
      </div>

      {/* Stats */}
      <div style={styles.statsGrid}>
        {[
          { label: "Pending earnings", value: `${parseFloat(earnings).toFixed(4)} ETH`, color: "#10b981" },
          { label: "Network", value: "Localhost:8545", color: "#6366f1" },
          { label: "Contract", value: "Deployed ✓", color: "#818cf8" },
          { label: "Status", value: account ? "Connected" : "Disconnected", color: account ? "#10b981" : "#ef4444" },
        ].map(({ label, value, color }) => (
          <div key={label} style={styles.statCard}>
            <p style={styles.statLabel}>{label}</p>
            <p style={{ ...styles.statValue, color }}>{value}</p>
          </div>
        ))}
      </div>

      <div style={styles.twoCol}>
        {/* Upload form */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>Upload video</h2>
            <span style={styles.cardSub}>Register on-chain via smart contract</span>
          </div>

          <form onSubmit={handleUpload} style={styles.form}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Video title</label>
              <input
                style={styles.input}
                type="text"
                placeholder="Enter a title..."
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>IPFS CID</label>
              <input
                style={styles.input}
                type="text"
                placeholder="QmXoypizjW3WknFiJnKLwHCnL72..."
                value={form.cid}
                onChange={(e) => setForm({ ...form, cid: e.target.value })}
              />
              <span style={styles.fieldHint}>Paste the IPFS CID of your uploaded video</span>
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Price (ETH)</label>
              <input
                style={styles.input}
                type="number"
                step="0.001"
                min="0.001"
                placeholder="0.01"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>

            <button
              type="submit"
              style={{ ...styles.submitBtn, ...((!account || loading) ? { opacity: 0.5 } : {}) }}
              disabled={!account || loading}
            >
              {loading ? "Registering on-chain..." : "Upload & Register on Chain"}
            </button>

            {!account && <p style={styles.walletWarning}>Connect your wallet to upload</p>}
            {displayError && <p style={styles.errorMsg}>{displayError}</p>}
            {uploaded && (
              <div style={styles.successMsg}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                Video registered on-chain!
              </div>
            )}
          </form>
        </div>

        {/* Earnings */}
        <div>
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>Earnings</h2>
              <span style={styles.cardSub}>Accumulated on-chain</span>
            </div>
            <div style={styles.earningsDisplay}>
              <span style={styles.earningsValue}>{parseFloat(earnings).toFixed(4)}</span>
              <span style={styles.earningsEth}>ETH</span>
            </div>
            <button
              style={{ ...styles.withdrawBtn, ...(loading || parseFloat(earnings) === 0 ? { opacity: 0.5 } : {}) }}
              onClick={handleWithdraw}
              disabled={loading || parseFloat(earnings) === 0}
            >
              {loading ? "Processing..." : "Withdraw to wallet"}
            </button>
            {withdrawn && (
              <div style={styles.successMsg}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                ETH sent to your wallet!
              </div>
            )}
          </div>

          <div style={{ ...styles.card, marginTop: "16px" }}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>How it works</h2>
            </div>
            {[
              { step: "1", text: "Paste your IPFS CID and set a price" },
              { step: "2", text: "Contract computes keccak256(CID + address)" },
              { step: "3", text: "Video registered on-chain — immutable" },
              { step: "4", text: "Viewers pay ETH to unlock your content" },
              { step: "5", text: "Withdraw earnings anytime to your wallet" },
            ].map(({ step, text }) => (
              <div key={step} style={styles.stepRow}>
                <div style={styles.stepNum}>{step}</div>
                <p style={styles.stepText}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#0a0a0f", padding: "32px" },
  header: { marginBottom: "28px" },
  pageTitle: { fontSize: "28px", fontWeight: "700", color: "#f1f0ff", letterSpacing: "-0.5px", marginBottom: "4px" },
  pageSub: { fontSize: "14px", color: "#4a4963", fontFamily: "'JetBrains Mono', monospace" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "28px" },
  statCard: { background: "#16161f", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px", padding: "18px 20px" },
  statLabel: { fontSize: "12px", color: "#4a4963", marginBottom: "6px" },
  statValue: { fontSize: "16px", fontWeight: "700", letterSpacing: "-0.3px" },
  twoCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", alignItems: "start" },
  card: { background: "#16161f", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "24px" },
  cardHeader: { marginBottom: "20px" },
  cardTitle: { fontSize: "15px", fontWeight: "600", color: "#f1f0ff", marginBottom: "2px" },
  cardSub: { fontSize: "12px", color: "#4a4963" },
  form: { display: "flex", flexDirection: "column", gap: "16px" },
  fieldGroup: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "12px", fontWeight: "500", color: "#8b8aa3", letterSpacing: "0.03em" },
  input: { background: "#0d0d14", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", color: "#f1f0ff", fontFamily: "'Space Grotesk', sans-serif", fontSize: "14px", padding: "10px 14px", outline: "none" },
  fieldHint: { fontSize: "11px", color: "#4a4963" },
  submitBtn: { background: "#6366f1", color: "#fff", border: "none", borderRadius: "10px", padding: "12px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif", transition: "all 0.2s" },
  walletWarning: { fontSize: "12px", color: "#f59e0b", textAlign: "center" },
  errorMsg: { fontSize: "12px", color: "#f87171", textAlign: "center" },
  successMsg: { display: "flex", alignItems: "center", gap: "6px", justifyContent: "center", color: "#10b981", fontSize: "13px" },
  earningsDisplay: { display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "16px" },
  earningsValue: { fontSize: "36px", fontWeight: "700", color: "#10b981", letterSpacing: "-1px" },
  earningsEth: { fontSize: "16px", color: "#4a4963", fontWeight: "600" },
  withdrawBtn: { width: "100%", background: "rgba(16,185,129,0.15)", color: "#10b981", border: "1px solid rgba(16,185,129,0.3)", borderRadius: "10px", padding: "11px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif", transition: "all 0.2s" },
  stepRow: { display: "flex", alignItems: "flex-start", gap: "12px", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" },
  stepNum: { width: "22px", height: "22px", borderRadius: "50%", background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "700", color: "#818cf8", flexShrink: 0 },
  stepText: { fontSize: "13px", color: "#8b8aa3", lineHeight: "1.5", paddingTop: "2px" },
};

import { useState } from "react";
import { VIDEOS, shortAddress } from "../data/videos";

const MY_VIDEOS = VIDEOS.slice(0, 2).map((v) => ({
  ...v,
  earnings: (Math.random() * 0.1).toFixed(4),
  views: Math.floor(Math.random() * 200 + 10),
}));

export default function DashboardPage({ account }) {
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawn, setWithdrawn] = useState(false);
  const [form, setForm] = useState({ title: "", price: "", file: null });

  const totalEarnings = MY_VIDEOS.reduce((sum, v) => sum + parseFloat(v.earnings), 0).toFixed(4);

  function handleUpload(e) {
    e.preventDefault();
    if (!account) return;
    setUploading(true);
    setTimeout(() => { setUploading(false); setUploaded(true); setTimeout(() => setUploaded(false), 3000); }, 2500);
  }

  function handleWithdraw() {
    setWithdrawing(true);
    setTimeout(() => { setWithdrawing(false); setWithdrawn(true); setTimeout(() => setWithdrawn(false), 3000); }, 1800);
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.pageTitle}>Creator Dashboard</h1>
          <p style={styles.pageSub}>
            {account ? shortAddress(account) : "Connect wallet to manage your content"}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div style={styles.statsGrid}>
        {[
          { label: "Total videos", value: MY_VIDEOS.length, icon: "▶", color: "#6366f1" },
          { label: "Total earnings", value: `${totalEarnings} ETH`, icon: "◈", color: "#10b981" },
          { label: "Total views", value: MY_VIDEOS.reduce((s, v) => s + v.views, 0), icon: "◉", color: "#f59e0b" },
          { label: "Pending payout", value: `${totalEarnings} ETH`, icon: "⬡", color: "#818cf8" },
        ].map(({ label, value, icon, color }) => (
          <div key={label} style={styles.statCard}>
            <div style={{ ...styles.statIcon, color }}>{icon}</div>
            <div>
              <p style={styles.statLabel}>{label}</p>
              <p style={{ ...styles.statValue, color }}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.twoCol}>
        {/* Upload form */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.cardTitle}>Upload video</h2>
            <span style={styles.cardSub}>IPFS + on-chain registration</span>
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
                required
              />
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
                required
              />
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Video file</label>
              <div style={styles.fileUpload}
                onClick={() => document.getElementById("fileInput").click()}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4a4963" strokeWidth="1.5">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <p style={styles.fileText}>
                  {form.file ? form.file.name : "Click to select video"}
                </p>
                <p style={styles.fileSubtext}>Will be uploaded to IPFS</p>
                <input
                  id="fileInput" type="file" accept="video/*"
                  style={{ display: "none" }}
                  onChange={(e) => setForm({ ...form, file: e.target.files[0] })}
                />
              </div>
            </div>

            <button
              type="submit"
              style={{ ...styles.submitBtn, ...((!account || uploading) ? { opacity: 0.5 } : {}) }}
              disabled={!account || uploading}
            >
              {uploading ? "Uploading to IPFS..." : "Upload & Register on Chain"}
            </button>

            {!account && (
              <p style={styles.walletWarning}>Connect your wallet to upload</p>
            )}
            {uploaded && (
              <div style={styles.successMsg}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                Video uploaded and registered on-chain!
              </div>
            )}
          </form>
        </div>

        {/* My videos + withdraw */}
        <div style={styles.rightCol}>
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>Earnings</h2>
              <span style={styles.cardSub}>Accumulated ETH</span>
            </div>
            <div style={styles.earningsDisplay}>
              <span style={styles.earningsValue}>{totalEarnings}</span>
              <span style={styles.earningsEth}>ETH</span>
            </div>
            <button
              style={{ ...styles.withdrawBtn, ...(withdrawing ? { opacity: 0.6 } : {}) }}
              onClick={handleWithdraw}
              disabled={withdrawing}
            >
              {withdrawing ? "Processing..." : "Withdraw to wallet"}
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

          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>My videos</h2>
            </div>
            {MY_VIDEOS.map((video) => (
              <div key={video.id} style={styles.videoRow}>
                <img src={video.thumbnail} alt={video.title} style={styles.videoThumb} />
                <div style={styles.videoRowInfo}>
                  <p style={styles.videoRowTitle}>{video.title}</p>
                  <div style={styles.videoRowMeta}>
                    <span style={styles.videoRowStat}>{video.views} views</span>
                    <span style={styles.videoRowEarnings}>{video.earnings} ETH</span>
                  </div>
                </div>
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
  statCard: {
    background: "#16161f", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "12px",
    padding: "18px 20px", display: "flex", alignItems: "center", gap: "14px",
  },
  statIcon: { fontSize: "22px", lineHeight: 1 },
  statLabel: { fontSize: "12px", color: "#4a4963", marginBottom: "4px" },
  statValue: { fontSize: "18px", fontWeight: "700", letterSpacing: "-0.3px" },
  twoCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", alignItems: "start" },
  card: {
    background: "#16161f", border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "14px", padding: "24px", marginBottom: "16px",
  },
  cardHeader: { marginBottom: "20px" },
  cardTitle: { fontSize: "15px", fontWeight: "600", color: "#f1f0ff", marginBottom: "2px" },
  cardSub: { fontSize: "12px", color: "#4a4963" },
  form: { display: "flex", flexDirection: "column", gap: "16px" },
  fieldGroup: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "12px", fontWeight: "500", color: "#8b8aa3", letterSpacing: "0.03em" },
  input: {
    background: "#0d0d14", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px",
    color: "#f1f0ff", fontFamily: "'Space Grotesk', sans-serif", fontSize: "14px",
    padding: "10px 14px", outline: "none", transition: "border-color 0.2s",
  },
  fileUpload: {
    background: "#0d0d14", border: "1px dashed rgba(255,255,255,0.1)", borderRadius: "10px",
    padding: "24px", display: "flex", flexDirection: "column", alignItems: "center",
    gap: "6px", cursor: "pointer", transition: "border-color 0.2s",
  },
  fileText: { fontSize: "13px", color: "#8b8aa3", fontWeight: "500" },
  fileSubtext: { fontSize: "11px", color: "#4a4963" },
  submitBtn: {
    background: "#6366f1", color: "#fff", border: "none", borderRadius: "10px",
    padding: "12px", fontSize: "14px", fontWeight: "600", cursor: "pointer",
    fontFamily: "'Space Grotesk', sans-serif", transition: "all 0.2s",
  },
  walletWarning: { fontSize: "12px", color: "#f59e0b", textAlign: "center" },
  successMsg: {
    display: "flex", alignItems: "center", gap: "6px", justifyContent: "center",
    color: "#10b981", fontSize: "13px",
  },
  rightCol: {},
  earningsDisplay: { display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "16px" },
  earningsValue: { fontSize: "36px", fontWeight: "700", color: "#10b981", letterSpacing: "-1px" },
  earningsEth: { fontSize: "16px", color: "#4a4963", fontWeight: "600" },
  withdrawBtn: {
    width: "100%", background: "rgba(16,185,129,0.15)", color: "#10b981",
    border: "1px solid rgba(16,185,129,0.3)", borderRadius: "10px", padding: "11px",
    fontSize: "14px", fontWeight: "600", cursor: "pointer",
    fontFamily: "'Space Grotesk', sans-serif", transition: "all 0.2s",
  },
  videoRow: {
    display: "flex", gap: "12px", alignItems: "center",
    padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.04)",
  },
  videoThumb: { width: "64px", height: "40px", objectFit: "cover", borderRadius: "6px", flexShrink: 0 },
  videoRowInfo: { flex: 1, minWidth: 0 },
  videoRowTitle: {
    fontSize: "13px", fontWeight: "500", color: "#f1f0ff", marginBottom: "4px",
    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
  },
  videoRowMeta: { display: "flex", gap: "10px" },
  videoRowStat: { fontSize: "11px", color: "#4a4963" },
  videoRowEarnings: { fontSize: "11px", color: "#10b981", fontFamily: "'JetBrains Mono', monospace" },
};

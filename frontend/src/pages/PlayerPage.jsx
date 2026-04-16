import { useState } from "react";
import { shortAddress } from "../data/videos";

export default function PlayerPage({ video, account, onBack }) {
  const [hasAccess, setHasAccess] = useState(false);
  const [paying, setPaying] = useState(false);
  const [tipping, setTipping] = useState(false);
  const [tipAmount, setTipAmount] = useState("0.001");
  const [tipSent, setTipSent] = useState(false);
  const [error, setError] = useState(null);

  async function handlePayToWatch() {
    if (!account) { setError("Please connect your wallet first."); return; }
    setError(null); setPaying(true);
    setTimeout(() => { setPaying(false); setHasAccess(true); }, 2000);
  }

  async function handleTip() {
    if (!account) { setError("Please connect your wallet first."); return; }
    setError(null); setTipping(true);
    setTimeout(() => {
      setTipping(false); setTipSent(true);
      setTimeout(() => setTipSent(false), 3000);
    }, 1500);
  }

  return (
    <div style={styles.page}>
      <button style={styles.backBtn} onClick={onBack}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="m15 18-6-6 6-6"/>
        </svg>
        Back
      </button>

      <div style={styles.layout}>
        {/* Left: Video */}
        <div style={styles.left}>
          {hasAccess ? (
            <div style={styles.player}>
              <div style={styles.playerInner}>
                <div style={styles.playerGlow} />
                <svg width="52" height="52" viewBox="0 0 24 24" fill="none" style={{ marginBottom: "16px" }}>
                  <circle cx="12" cy="12" r="10" stroke="rgba(99,102,241,0.4)" strokeWidth="1"/>
                  <polygon points="10,8 16,12 10,16" fill="#6366f1"/>
                </svg>
                <p style={styles.playerText}>Streaming from IPFS</p>
                <p style={styles.playerCid}>{video.ipfsCid.slice(0, 24)}...</p>
              </div>
            </div>
          ) : (
            <div style={styles.locked}>
              <img src={video.thumbnail} alt={video.title} style={styles.lockedThumb} />
              <div style={styles.lockedOverlay}>
                <div style={styles.lockCircle}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </div>
                <p style={styles.lockLabel}>Pay to unlock this video</p>
                <p style={styles.lockPrice}>{video.price} ETH</p>
                <button
                  style={{ ...styles.payBtn, ...(paying ? styles.payBtnLoading : {}) }}
                  onClick={handlePayToWatch}
                  disabled={paying}
                >
                  {paying ? (
                    <><span style={styles.spinner} /> Processing...</>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="2" y="7" width="20" height="14" rx="2"/>
                        <circle cx="17" cy="14" r="1" fill="currentColor"/>
                      </svg>
                      Pay {video.price} ETH
                    </>
                  )}
                </button>
                {error && <p style={styles.error}>{error}</p>}
              </div>
            </div>
          )}

          <div style={styles.videoMeta}>
            <div style={styles.accessBadge}>
              <span style={{ ...styles.accessDot, background: hasAccess ? "#10b981" : "#ef4444" }} />
              <span style={{ color: hasAccess ? "#10b981" : "#ef4444", fontSize: "12px", fontWeight: "600" }}>
                {hasAccess ? "Unlocked" : "Locked"}
              </span>
            </div>
            <h2 style={styles.videoTitle}>{video.title}</h2>
            <div style={styles.creatorRow}>
              <div style={styles.creatorAvatar}>
                {video.creator.slice(2, 4).toUpperCase()}
              </div>
              <div>
                <p style={styles.creatorLabel}>Creator</p>
                <p style={styles.creatorAddr}>{shortAddress(video.creator)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Sidebar */}
        <div style={styles.sidebar}>
          {/* Video Info */}
          <div style={styles.sideCard}>
            <h3 style={styles.sideTitle}>Video info</h3>
            {[
              { label: "Price", value: `${video.price} ETH`, accent: true },
              { label: "Duration", value: video.duration },
              { label: "Storage", value: "IPFS" },
              { label: "Network", value: "Ethereum" },
              { label: "Content hash", value: "On-chain ✓" },
            ].map(({ label, value, accent }) => (
              <div key={label} style={styles.infoRow}>
                <span style={styles.infoLabel}>{label}</span>
                <span style={{ ...styles.infoValue, ...(accent ? styles.infoAccent : {}) }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Tip */}
          <div style={styles.sideCard}>
            <h3 style={styles.sideTitle}>Tip the creator</h3>
            <p style={styles.tipDesc}>Send ETH directly — no platform cut.</p>
            <div style={styles.tipRow}>
              <input
                style={styles.tipInput}
                type="number"
                step="0.001"
                min="0.001"
                value={tipAmount}
                onChange={(e) => setTipAmount(e.target.value)}
              />
              <span style={styles.tipEth}>ETH</span>
            </div>
            <button
              style={{ ...styles.tipBtn, ...(tipping ? { opacity: 0.6 } : {}) }}
              onClick={handleTip}
              disabled={tipping}
            >
              {tipping ? "Sending..." : "Send Tip"}
            </button>
            {tipSent && (
              <div style={styles.tipSuccess}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
                Tip sent successfully!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#0a0a0f", padding: "24px 32px" },
  backBtn: {
    display: "inline-flex", alignItems: "center", gap: "6px",
    background: "transparent", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "8px", padding: "7px 14px", fontSize: "13px", fontWeight: "500",
    cursor: "pointer", color: "#8b8aa3", fontFamily: "'Space Grotesk', sans-serif",
    transition: "all 0.2s", marginBottom: "24px",
  },
  layout: { display: "grid", gridTemplateColumns: "1fr 300px", gap: "28px", alignItems: "start" },
  left: {},
  player: {
    borderRadius: "16px", overflow: "hidden",
    border: "1px solid rgba(99,102,241,0.2)",
    background: "#0d0d14",
  },
  playerInner: {
    height: "380px", display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center", position: "relative",
  },
  playerGlow: {
    position: "absolute", top: "50%", left: "50%",
    transform: "translate(-50%, -50%)",
    width: "300px", height: "200px",
    background: "radial-gradient(ellipse, rgba(99,102,241,0.08) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  playerText: { fontSize: "15px", color: "#8b8aa3", marginBottom: "8px", position: "relative" },
  playerCid: { fontSize: "11px", color: "#4a4963", fontFamily: "'JetBrains Mono', monospace", position: "relative" },
  locked: { position: "relative", borderRadius: "16px", overflow: "hidden", height: "380px" },
  lockedThumb: { width: "100%", height: "100%", objectFit: "cover", filter: "blur(8px) brightness(0.3)" },
  lockedOverlay: {
    position: "absolute", inset: 0, display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center", gap: "12px",
  },
  lockCircle: {
    width: "56px", height: "56px", borderRadius: "50%",
    background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  lockLabel: { color: "#8b8aa3", fontSize: "14px", margin: 0 },
  lockPrice: { color: "#f1f0ff", fontSize: "28px", fontWeight: "700", margin: 0, letterSpacing: "-0.5px" },
  payBtn: {
    display: "inline-flex", alignItems: "center", gap: "8px",
    background: "#6366f1", color: "#fff", border: "none", borderRadius: "10px",
    padding: "12px 28px", fontSize: "15px", fontWeight: "600", cursor: "pointer",
    fontFamily: "'Space Grotesk', sans-serif", transition: "all 0.2s", marginTop: "4px",
  },
  payBtnLoading: { opacity: 0.7 },
  spinner: {
    width: "14px", height: "14px", border: "2px solid rgba(255,255,255,0.3)",
    borderTopColor: "#fff", borderRadius: "50%",
    display: "inline-block",
  },
  error: { color: "#f87171", fontSize: "13px", margin: 0 },
  videoMeta: { marginTop: "20px" },
  accessBadge: {
    display: "inline-flex", alignItems: "center", gap: "6px",
    marginBottom: "12px",
  },
  accessDot: { width: "7px", height: "7px", borderRadius: "50%" },
  videoTitle: { fontSize: "22px", fontWeight: "700", color: "#f1f0ff", letterSpacing: "-0.3px", marginBottom: "16px" },
  creatorRow: { display: "flex", alignItems: "center", gap: "12px" },
  creatorAvatar: {
    width: "40px", height: "40px", borderRadius: "10px",
    background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.25)",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: "12px", fontWeight: "700", color: "#818cf8",
    fontFamily: "'JetBrains Mono', monospace",
  },
  creatorLabel: { fontSize: "11px", color: "#4a4963", marginBottom: "2px" },
  creatorAddr: { fontSize: "13px", color: "#8b8aa3", fontFamily: "'JetBrains Mono', monospace" },
  sidebar: { display: "flex", flexDirection: "column", gap: "16px" },
  sideCard: {
    background: "#16161f", border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "14px", padding: "20px",
  },
  sideTitle: { fontSize: "13px", fontWeight: "600", color: "#f1f0ff", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "0.06em" },
  infoRow: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "9px 0", borderBottom: "1px solid rgba(255,255,255,0.04)",
  },
  infoLabel: { fontSize: "13px", color: "#4a4963" },
  infoValue: { fontSize: "13px", color: "#8b8aa3", fontWeight: "500" },
  infoAccent: { color: "#818cf8", fontFamily: "'JetBrains Mono', monospace" },
  tipDesc: { fontSize: "13px", color: "#4a4963", lineHeight: "1.5", marginBottom: "14px" },
  tipRow: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" },
  tipInput: {
    flex: 1, background: "#0d0d14", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "8px", color: "#f1f0ff", fontFamily: "'JetBrains Mono', monospace",
    fontSize: "14px", padding: "9px 12px", outline: "none",
  },
  tipEth: { fontSize: "13px", color: "#4a4963", fontWeight: "600" },
  tipBtn: {
    width: "100%", background: "#059669", color: "#fff", border: "none",
    borderRadius: "10px", padding: "11px", fontSize: "14px", fontWeight: "600",
    cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif", transition: "all 0.2s",
  },
  tipSuccess: {
    display: "flex", alignItems: "center", gap: "6px",
    color: "#10b981", fontSize: "13px", marginTop: "10px", justifyContent: "center",
  },
};

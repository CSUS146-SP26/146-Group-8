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
    if (!account) {
      setError("Please connect your wallet first.");
      return;
    }
    setError(null);
    setPaying(true);
    // Simulated delay — will be replaced with real contract call
    setTimeout(() => {
      setPaying(false);
      setHasAccess(true);
    }, 2000);
  }

  async function handleTip() {
    if (!account) {
      setError("Please connect your wallet first.");
      return;
    }
    setError(null);
    setTipping(true);
    // Simulated delay — will be replaced with real contract call
    setTimeout(() => {
      setTipping(false);
      setTipSent(true);
      setTimeout(() => setTipSent(false), 3000);
    }, 1500);
  }

  return (
    <div style={styles.page}>
      <button style={styles.backBtn} onClick={onBack}>
        ← Back to browse
      </button>

      <div style={styles.layout}>
        {/* Video area */}
        <div style={styles.videoSection}>
          {hasAccess ? (
            <div style={styles.playerBox}>
              <div style={styles.fakePlayer}>
                <span style={styles.playIcon}>▶</span>
                <p style={styles.playText}>Video streaming from IPFS</p>
                <p style={styles.cid}>CID: {video.ipfsCid.slice(0, 20)}...</p>
              </div>
            </div>
          ) : (
            <div style={styles.lockedBox}>
              <img
                src={video.thumbnail}
                alt={video.title}
                style={styles.lockedThumb}
              />
              <div style={styles.lockOverlay}>
                <div style={styles.lockIcon}>🔒</div>
                <p style={styles.lockText}>
                  Pay {video.price} ETH to unlock this video
                </p>
                <button
                  style={styles.payBtn}
                  onClick={handlePayToWatch}
                  disabled={paying}
                >
                  {paying ? "Processing..." : `Pay ${video.price} ETH to Watch`}
                </button>
                {error && <p style={styles.error}>{error}</p>}
              </div>
            </div>
          )}

          <div style={styles.videoMeta}>
            <h2 style={styles.videoTitle}>{video.title}</h2>
            <p style={styles.creatorLine}>
              Creator:{" "}
              <span style={styles.creatorAddr}>
                {shortAddress(video.creator)}
              </span>
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div style={styles.sidebar}>
          <div style={styles.tipCard}>
            <h3 style={styles.tipTitle}>Tip the Creator</h3>
            <p style={styles.tipDesc}>
              Show your support by sending ETH directly to the creator.
            </p>
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
              style={styles.tipBtn}
              onClick={handleTip}
              disabled={tipping}
            >
              {tipping ? "Sending..." : "Send Tip"}
            </button>
            {tipSent && (
              <p style={styles.tipSuccess}>Tip sent successfully!</p>
            )}
          </div>

          <div style={styles.infoCard}>
            <h3 style={styles.infoTitle}>Video Info</h3>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Price</span>
              <span style={styles.infoValue}>{video.price} ETH</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Duration</span>
              <span style={styles.infoValue}>{video.duration}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Storage</span>
              <span style={styles.infoValue}>IPFS</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.infoLabel}>Access</span>
              <span
                style={{
                  ...styles.infoValue,
                  color: hasAccess ? "#16a34a" : "#dc2626",
                  fontWeight: "600",
                }}
              >
                {hasAccess ? "Unlocked" : "Locked"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f9fafb",
    padding: "24px 32px",
  },
  backBtn: {
    background: "transparent",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    padding: "8px 16px",
    fontSize: "13px",
    cursor: "pointer",
    color: "#374151",
    marginBottom: "20px",
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "1fr 300px",
    gap: "24px",
    alignItems: "start",
  },
  videoSection: {},
  playerBox: {
    borderRadius: "12px",
    overflow: "hidden",
    background: "#000",
  },
  fakePlayer: {
    height: "360px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#111",
    color: "#fff",
  },
  playIcon: {
    fontSize: "48px",
    marginBottom: "12px",
  },
  playText: {
    margin: "0 0 8px",
    fontSize: "16px",
    color: "#e5e7eb",
  },
  cid: {
    margin: 0,
    fontSize: "11px",
    color: "#6b7280",
    fontFamily: "monospace",
  },
  lockedBox: {
    position: "relative",
    borderRadius: "12px",
    overflow: "hidden",
  },
  lockedThumb: {
    width: "100%",
    height: "360px",
    objectFit: "cover",
    display: "block",
    filter: "blur(6px) brightness(0.4)",
  },
  lockOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
  },
  lockIcon: {
    fontSize: "40px",
  },
  lockText: {
    color: "#fff",
    fontSize: "15px",
    margin: 0,
    textAlign: "center",
  },
  payBtn: {
    background: "#2563EB",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "12px 24px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
  },
  error: {
    color: "#fca5a5",
    fontSize: "13px",
    margin: 0,
  },
  videoMeta: {
    marginTop: "16px",
  },
  videoTitle: {
    margin: "0 0 8px",
    fontSize: "20px",
    fontWeight: "700",
    color: "#111",
  },
  creatorLine: {
    margin: 0,
    fontSize: "13px",
    color: "#6b7280",
  },
  creatorAddr: {
    fontFamily: "monospace",
    color: "#2563EB",
  },
  sidebar: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  tipCard: {
    background: "#fff",
    borderRadius: "12px",
    padding: "20px",
    border: "1px solid #e5e7eb",
  },
  tipTitle: {
    margin: "0 0 8px",
    fontSize: "15px",
    fontWeight: "600",
    color: "#111",
  },
  tipDesc: {
    margin: "0 0 16px",
    fontSize: "13px",
    color: "#6b7280",
    lineHeight: "1.5",
  },
  tipRow: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "12px",
  },
  tipInput: {
    flex: 1,
    padding: "8px 12px",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    outline: "none",
  },
  tipEth: {
    fontSize: "13px",
    color: "#6b7280",
    fontWeight: "500",
  },
  tipBtn: {
    width: "100%",
    background: "#059669",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    padding: "10px",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
  },
  tipSuccess: {
    margin: "8px 0 0",
    color: "#059669",
    fontSize: "13px",
    textAlign: "center",
  },
  infoCard: {
    background: "#fff",
    borderRadius: "12px",
    padding: "20px",
    border: "1px solid #e5e7eb",
  },
  infoTitle: {
    margin: "0 0 12px",
    fontSize: "15px",
    fontWeight: "600",
    color: "#111",
  },
  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 0",
    borderBottom: "1px solid #f3f4f6",
  },
  infoLabel: {
    fontSize: "13px",
    color: "#6b7280",
  },
  infoValue: {
    fontSize: "13px",
    color: "#111",
    fontWeight: "500",
  },
};

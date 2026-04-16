import { useState } from "react";
import { shortAddress } from "../data/videos";

export default function VideoCard({ video, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{ ...styles.card, ...(hovered ? styles.cardHovered : {}) }}
      onClick={() => onClick(video)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={styles.thumbWrap}>
        <img
          src={video.thumbnail}
          alt={video.title}
          style={{ ...styles.thumb, transform: hovered ? "scale(1.05)" : "scale(1)" }}
        />
        <div style={styles.thumbOverlay} />
        <div style={styles.topRow}>
          <span style={styles.priceBadge}>{video.price} ETH</span>
        </div>
        <div style={styles.bottomRow}>
          <span style={styles.duration}>{video.duration}</span>
          {hovered && (
            <div style={styles.playBtn}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                <polygon points="5,3 19,12 5,21" />
              </svg>
            </div>
          )}
        </div>
      </div>
      <div style={styles.info}>
        <h3 style={styles.title}>{video.title}</h3>
        <div style={styles.meta}>
          <span style={styles.creatorDot} />
          <span style={styles.creator}>{shortAddress(video.creator)}</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "#16161f",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "14px",
    overflow: "hidden",
    cursor: "pointer",
    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  cardHovered: {
    border: "1px solid rgba(99, 102, 241, 0.3)",
    transform: "translateY(-4px)",
    boxShadow: "0 16px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(99,102,241,0.1)",
  },
  thumbWrap: { position: "relative", overflow: "hidden", height: "176px" },
  thumb: {
    width: "100%", height: "100%", objectFit: "cover", display: "block",
    transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  thumbOverlay: {
    position: "absolute", inset: 0,
    background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 50%)",
  },
  topRow: { position: "absolute", top: "10px", left: "10px", right: "10px", display: "flex" },
  priceBadge: {
    background: "rgba(99, 102, 241, 0.9)", color: "#fff",
    fontSize: "11px", fontWeight: "700", padding: "3px 8px",
    borderRadius: "6px", letterSpacing: "0.03em",
  },
  bottomRow: {
    position: "absolute", bottom: "10px", left: "10px", right: "10px",
    display: "flex", justifyContent: "space-between", alignItems: "center",
  },
  duration: {
    background: "rgba(0,0,0,0.65)", color: "#fff", fontSize: "11px",
    fontWeight: "500", padding: "2px 6px", borderRadius: "4px",
    fontFamily: "'JetBrains Mono', monospace",
  },
  playBtn: {
    width: "32px", height: "32px", background: "rgba(99, 102, 241, 0.9)",
    borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
  },
  info: { padding: "14px 16px" },
  title: {
    fontSize: "14px", fontWeight: "600", color: "#f1f0ff",
    lineHeight: "1.45", marginBottom: "8px",
    display: "-webkit-box", WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical", overflow: "hidden",
  },
  meta: { display: "flex", alignItems: "center", gap: "6px" },
  creatorDot: { width: "6px", height: "6px", borderRadius: "50%", background: "#6366f1", flexShrink: 0 },
  creator: { fontSize: "12px", color: "#8b8aa3", fontFamily: "'JetBrains Mono', monospace" },
};

import { shortAddress } from "../data/videos";

export default function VideoCard({ video, onClick }) {
  return (
    <div style={styles.card} onClick={() => onClick(video)}>
      <div style={styles.thumbnailWrapper}>
        <img src={video.thumbnail} alt={video.title} style={styles.thumbnail} />
        <span style={styles.duration}>{video.duration}</span>
        <div style={styles.priceTag}>
          <span style={styles.priceText}>{video.price} ETH</span>
        </div>
      </div>
      <div style={styles.info}>
        <h3 style={styles.title}>{video.title}</h3>
        <p style={styles.creator}>{shortAddress(video.creator)}</p>
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "#fff",
    borderRadius: "12px",
    overflow: "hidden",
    border: "1px solid #e5e7eb",
    cursor: "pointer",
    transition: "transform 0.15s, box-shadow 0.15s",
    onMouseEnter: (e) => {
      e.currentTarget.style.transform = "translateY(-4px)";
    },
  },
  thumbnailWrapper: {
    position: "relative",
    width: "100%",
  },
  thumbnail: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
    display: "block",
  },
  duration: {
    position: "absolute",
    bottom: "8px",
    right: "8px",
    background: "rgba(0,0,0,0.75)",
    color: "#fff",
    fontSize: "11px",
    padding: "2px 6px",
    borderRadius: "4px",
  },
  priceTag: {
    position: "absolute",
    top: "8px",
    left: "8px",
    background: "#2563EB",
    borderRadius: "6px",
    padding: "3px 8px",
  },
  priceText: {
    color: "#fff",
    fontSize: "11px",
    fontWeight: "600",
  },
  info: {
    padding: "12px",
  },
  title: {
    margin: "0 0 6px",
    fontSize: "14px",
    fontWeight: "600",
    color: "#111",
    lineHeight: "1.4",
  },
  creator: {
    margin: 0,
    fontSize: "12px",
    color: "#6b7280",
    fontFamily: "monospace",
  },
};

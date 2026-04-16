import { useState } from "react";
import { VIDEOS } from "../data/videos";
import VideoCard from "../components/VideoCard";

export default function BrowsePage({ onSelectVideo }) {
  const [search, setSearch] = useState("");

  const filtered = VIDEOS.filter((v) =>
    v.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <h1 style={styles.logo}>DecentTube</h1>
          <p style={styles.tagline}>Decentralized video. Owned by creators.</p>
        </div>
      </div>

      <div style={styles.searchWrapper}>
        <input
          style={styles.search}
          type="text"
          placeholder="Search videos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <p style={styles.empty}>No videos found.</p>
      ) : (
        <div style={styles.grid}>
          {filtered.map((video) => (
            <VideoCard key={video.id} video={video} onClick={onSelectVideo} />
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f9fafb",
    padding: "0 0 40px",
  },
  header: {
    background: "#1e3a5f",
    padding: "20px 32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {},
  logo: {
    margin: 0,
    color: "#fff",
    fontSize: "24px",
    fontWeight: "700",
    letterSpacing: "-0.5px",
  },
  tagline: {
    margin: "4px 0 0",
    color: "#93c5fd",
    fontSize: "13px",
  },
  searchWrapper: {
    padding: "24px 32px 8px",
  },
  search: {
    width: "100%",
    maxWidth: "480px",
    padding: "10px 16px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "20px",
    padding: "20px 32px",
  },
  empty: {
    textAlign: "center",
    color: "#9ca3af",
    marginTop: "60px",
    fontSize: "15px",
  },
};

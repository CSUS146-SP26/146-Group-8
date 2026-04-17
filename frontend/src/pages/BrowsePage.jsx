import { useState } from "react";
import { VIDEOS } from "../data/videos";
import VideoCard from "../components/VideoCard";

const FILTERS = ["All", "0–0.01 ETH", "0.01–0.02 ETH", "0.02+ ETH"];

export default function BrowsePage({ onSelectVideo, chainVideos = [] }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  // Use on-chain videos if available, else fall back to mock data
  const source = chainVideos.length > 0 ? chainVideos : VIDEOS;

  const filtered = source.filter((v) => {
    const matchSearch = v.title.toLowerCase().includes(search.toLowerCase());
    const price = parseFloat(v.price);
    const matchFilter =
      filter === "All" ||
      (filter === "0–0.01 ETH" && price <= 0.01) ||
      (filter === "0.01–0.02 ETH" && price > 0.01 && price <= 0.02) ||
      (filter === "0.02+ ETH" && price > 0.02);
    return matchSearch && matchFilter;
  });

  return (
    <div style={styles.page}>
      <div style={styles.hero}>
        <div style={styles.heroGlow} />
        <div style={styles.heroContent}>
          <div style={styles.heroBadge}>
            <span style={styles.heroBadgeDot} />
            {chainVideos.length > 0 ? "Live on Ethereum" : "Powered by Ethereum"}
          </div>
          <h1 style={styles.heroTitle}>
            Own your content.<br />
            <span style={styles.heroAccent}>Earn directly.</span>
          </h1>
          <p style={styles.heroSub}>
            Decentralized video platform where creators keep 100% of revenue.
          </p>
        </div>
      </div>

      <div style={styles.controls}>
        <div style={styles.searchWrap}>
          <svg style={styles.searchIcon} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8b8aa3" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            style={styles.search}
            type="text"
            placeholder="Search videos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div style={styles.filters}>
          {FILTERS.map((f) => (
            <button
              key={f}
              style={{ ...styles.filterBtn, ...(filter === f ? styles.filterActive : {}) }}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.statsBar}>
        <span style={styles.statsText}>
          {filtered.length} video{filtered.length !== 1 ? "s" : ""} available
          {chainVideos.length > 0 && <span style={styles.liveTag}> · live on-chain</span>}
        </span>
        <div style={styles.statsRight}>
          <span style={styles.statItem}><span style={styles.statDot} />Live on Ethereum</span>
          <span style={styles.statItem}><span style={{ ...styles.statDot, background: "#10b981" }} />IPFS Storage</span>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={styles.empty}>
          <div style={styles.emptyIcon}>🔍</div>
          <p style={styles.emptyText}>No videos found</p>
          <p style={styles.emptySubtext}>Try a different search or filter</p>
        </div>
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
  page: { minHeight: "100vh", background: "#0a0a0f" },
  hero: { position: "relative", padding: "60px 32px 48px", overflow: "hidden", borderBottom: "1px solid rgba(255,255,255,0.05)" },
  heroGlow: { position: "absolute", top: "-60px", left: "50%", transform: "translateX(-50%)", width: "600px", height: "300px", background: "radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 70%)", pointerEvents: "none" },
  heroContent: { position: "relative", maxWidth: "600px" },
  heroBadge: { display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)", borderRadius: "999px", padding: "4px 12px", fontSize: "12px", color: "#818cf8", fontWeight: "500", marginBottom: "20px" },
  heroBadgeDot: { width: "6px", height: "6px", borderRadius: "50%", background: "#6366f1" },
  heroTitle: { fontSize: "42px", fontWeight: "700", color: "#f1f0ff", lineHeight: "1.15", letterSpacing: "-1px", marginBottom: "14px" },
  heroAccent: { background: "linear-gradient(135deg, #6366f1, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  heroSub: { fontSize: "16px", color: "#8b8aa3", lineHeight: "1.6", maxWidth: "460px" },
  controls: { padding: "20px 32px", display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap", borderBottom: "1px solid rgba(255,255,255,0.04)" },
  searchWrap: { position: "relative", flex: "1", minWidth: "240px", maxWidth: "400px" },
  searchIcon: { position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" },
  search: { width: "100%", background: "#16161f", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "10px", color: "#f1f0ff", fontFamily: "'Space Grotesk', sans-serif", fontSize: "14px", padding: "10px 14px 10px 36px", outline: "none" },
  filters: { display: "flex", gap: "6px", flexWrap: "wrap" },
  filterBtn: { background: "transparent", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "8px", padding: "7px 14px", fontSize: "12px", fontWeight: "500", color: "#8b8aa3", cursor: "pointer", fontFamily: "'Space Grotesk', sans-serif", transition: "all 0.2s" },
  filterActive: { background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.35)", color: "#818cf8" },
  statsBar: { padding: "12px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.04)" },
  statsText: { fontSize: "13px", color: "#4a4963" },
  liveTag: { color: "#10b981" },
  statsRight: { display: "flex", gap: "20px" },
  statItem: { display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#4a4963" },
  statDot: { width: "6px", height: "6px", borderRadius: "50%", background: "#6366f1" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px", padding: "24px 32px" },
  empty: { display: "flex", flexDirection: "column", alignItems: "center", padding: "80px 32px" },
  emptyIcon: { fontSize: "40px", marginBottom: "16px" },
  emptyText: { fontSize: "18px", fontWeight: "600", color: "#f1f0ff", marginBottom: "6px" },
  emptySubtext: { fontSize: "14px", color: "#8b8aa3" },
};

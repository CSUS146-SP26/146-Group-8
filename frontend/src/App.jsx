import { useState } from "react";
import WalletConnect from "./components/WalletConnect";
import BrowsePage from "./pages/BrowsePage";
import PlayerPage from "./pages/PlayerPage";

export default function App() {
  const [account, setAccount] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  return (
    <div style={styles.app}>
      {/* Top navbar */}
      <nav style={styles.nav}>
        <span
          style={styles.navLogo}
          onClick={() => setSelectedVideo(null)}
        >
          DecentTube
        </span>
        <WalletConnect onAccountChange={setAccount} />
      </nav>

      {/* Page routing */}
      {selectedVideo ? (
        <PlayerPage
          video={selectedVideo}
          account={account}
          onBack={() => setSelectedVideo(null)}
        />
      ) : (
        <BrowsePage onSelectVideo={setSelectedVideo} />
      )}
    </div>
  );
}

const styles = {
  app: {
    minHeight: "100vh",
    background: "#f9fafb",
    fontFamily: "Arial, sans-serif",
  },
  nav: {
    background: "#1e3a5f",
    padding: "14px 32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  navLogo: {
    color: "#fff",
    fontSize: "20px",
    fontWeight: "700",
    cursor: "pointer",
    letterSpacing: "-0.5px",
  },
};
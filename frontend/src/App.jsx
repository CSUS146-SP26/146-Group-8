import { useState } from "react";
import Navbar from "./components/Navbar";
import BrowsePage from "./pages/BrowsePage";
import PlayerPage from "./pages/PlayerPage";
import DashboardPage from "./pages/DashboardPage";

export default function App() {
  const [account, setAccount] = useState(null);
  const [page, setPage] = useState("browse");
  const [selectedVideo, setSelectedVideo] = useState(null);

  function handleSelectVideo(video) {
    setSelectedVideo(video);
    setPage("player");
  }

  function handleNavigate(dest) {
    setPage(dest);
    setSelectedVideo(null);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", fontFamily: "'Space Grotesk', sans-serif" }}>
      <Navbar page={page === "player" ? "browse" : page} onNavigate={handleNavigate} />

      {page === "browse" && (
        <BrowsePage onSelectVideo={handleSelectVideo} />
      )}
      {page === "player" && selectedVideo && (
        <PlayerPage
          video={selectedVideo}
          account={account}
          onBack={() => handleNavigate("browse")}
        />
      )}
      {page === "dashboard" && (
        <DashboardPage account={account} />
      )}
    </div>
  );
}

import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import BrowsePage from "./pages/BrowsePage";
import PlayerPage from "./pages/PlayerPage";
import DashboardPage from "./pages/DashboardPage";
import { useContract } from "./hooks/useContract";

export default function App() {
  const [page, setPage] = useState("browse");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [chainVideos, setChainVideos] = useState([]);

  const contractHook = useContract();
  const { account, connectWallet, fetchVideos } = contractHook;

  useEffect(() => { loadVideos(); }, [account]);

  async function loadVideos() {
    const videos = await fetchVideos();
    if (videos.length > 0) setChainVideos(videos);
  }

  function handleSelectVideo(video) {
    setSelectedVideo(video);
    setPage("player");
  }

  function handleNavigate(dest) {
    setPage(dest);
    setSelectedVideo(null);
    if (dest === "browse") loadVideos();
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", fontFamily: "'Space Grotesk', sans-serif" }}>
      <Navbar
        page={page === "player" ? "browse" : page}
        onNavigate={handleNavigate}
        account={account}
        onConnect={connectWallet}
      />
      {page === "browse" && (
        <BrowsePage onSelectVideo={handleSelectVideo} chainVideos={chainVideos} />
      )}
      {page === "player" && selectedVideo && (
        <PlayerPage video={selectedVideo} contractHook={contractHook} onBack={() => handleNavigate("browse")} />
      )}
      {page === "dashboard" && (
        <DashboardPage contractHook={contractHook} onUploadSuccess={loadVideos} />
      )}
    </div>
  );
}

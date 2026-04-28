import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import BrowsePage from "./pages/BrowsePage";
import PlayerPage from "./pages/PlayerPage";
import DashboardPage from "./pages/DashboardPage";
import { useContract } from "./hooks/useContract";
import { useWallet } from "./context/WalletContext";

export default function App() {
  const [page, setPage] = useState("browse");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [chainVideos, setChainVideos] = useState([]);

  const { account } = useWallet();
  const contractHook = useContract();
  const { fetchVideos } = contractHook;

  useEffect(() => {
    loadVideos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  async function loadVideos() {
    try {
      const videos = await fetchVideos();
      setChainVideos(videos || []);
    } catch (err) {
      console.error("Failed to load blockchain videos:", err);
      setChainVideos([]);
    }
  }

  function handleNavigate(newPage) {
    setPage(newPage);
    if (newPage === "browse") {
      setSelectedVideo(null);
      loadVideos();
    }
  }

  function handleSelectVideo(video) {
    setSelectedVideo(video);
    setPage("player");
  }

  return (
    <div>
      <Navbar currentPage={page} onNavigate={handleNavigate} />

      {page === "browse" && (
        <BrowsePage
          chainVideos={chainVideos}
          onSelectVideo={handleSelectVideo}
        />
      )}

      {page === "player" && selectedVideo && (
        <PlayerPage
          video={selectedVideo}
          contractHook={contractHook}
          onBack={() => handleNavigate("browse")}
        />
      )}

      {page === "dashboard" && (
        <DashboardPage
          contractHook={contractHook}
          onUploadSuccess={loadVideos}
        />
      )}
    </div>
  );
}
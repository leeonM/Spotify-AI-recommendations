import Navbar from "./components/Navbar";
import SearchSpotify from "./components/SearchSpotify";

function App() {
  return (
    <div className="h-[100vh] overflow-scroll bg-black text-[#1DB954]">
      <Navbar />
      <SearchSpotify />
    </div>
  );
}

export default App;

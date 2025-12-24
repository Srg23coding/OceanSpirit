import { useState, useEffect } from "react";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import AdCard from "../components/AdCard";

function Home({ user, setUser }) {
  const [query, setQuery] = useState("");
  const [ads, setAds] = useState([]);

  useEffect(() => {
    const storedAds = JSON.parse(localStorage.getItem("ads")) || [];
    setAds(storedAds);
  }, []);

  const filteredAds = ads.filter(ad =>
    ad.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <Header user={user} setUser={setUser} />
      <SearchBar onSearch={setQuery} />
      <div className="ads-list">
        {filteredAds.map(ad => (
          <AdCard key={ad.id} ad={ad} />
        ))}
      </div>
    </>
  );
}

export default Home;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Home from "./pages/Home";
import AdPage from "./pages/AdPage";
import Auth from "./pages/Auth";
import PostAd from "./pages/PostAd";
import MyAds from "./pages/MyAds";
import EditAd from "./pages/EditAd";

function App() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home user={user} setUser={setUser} />} />
        <Route path="/ad/:id" element={<AdPage user={user} setUser={setUser} />} />
        <Route path="/login" element={<Auth setUser={setUser} />} />
        <Route path="/post" element={<PostAd user={user} setUser={setUser} />} />
        <Route path="/my-ads" element={<MyAds user={user} setUser={setUser} />} />
        <Route path="/edit/:id" element={<EditAd user={user} />} />
      </Routes>
    </Router>
  );
}

export default App;

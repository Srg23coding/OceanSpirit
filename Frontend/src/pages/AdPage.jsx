import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "../components/Header";
import "./AdPage.css";

function AdPage({ user, setUser }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ad, setAd] = useState(null);

  useEffect(() => {
    const ads = JSON.parse(localStorage.getItem("ads")) || [];
    const currentAd = ads.find(a => a.id === Number(id));
    if (!currentAd) {
      navigate("/"); // если объявления нет, возвращаем на главную
      return;
    }
    setAd(currentAd);
  }, [id, navigate]);

  if (!ad) return null;

  const handleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if (!favorites.includes(ad.id)) {
      favorites.push(ad.id);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      alert("Добавлено в избранное");
    } else {
      alert("Уже в избранном");
    }
  };

  const handleMessage = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    // Тут можно открыть чат или переход к чату с продавцом
    alert(`Открываем чат с продавцом: ${ad.seller}`);
  };

  return (
    <>
      <Header user={user} setUser={setUser} />

      <div className="ad-page-container">
        <div className="ad-image">
          <img src={ad.image} alt={ad.title} />
        </div>

        <div className="ad-details">
          <h2>{ad.title}</h2>
          <p className="ad-description">{ad.description}</p>
          <p className="ad-price">{ad.price} ₽</p>
          <p className="ad-seller">Продавец: {ad.seller}</p>

          <div className="ad-actions">
            <button className="btn-message" onClick={handleMessage}>
              Написать
            </button>
            <button className="btn-favorite" onClick={handleFavorite}>
              ❤ В избранное
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdPage;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import AdCard from "../components/AdCard";

function MyAds({ user, setUser }) {
  const [ads, setAds] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    const allAds = JSON.parse(localStorage.getItem("ads")) || [];
    const myAds = allAds.filter(ad => ad.seller === user.login);
    setAds(myAds);
  }, [user]);

  const handleDelete = (id) => {
    if (!window.confirm("Удалить это объявление?")) return;

    // Удаляем из localStorage
    let allAds = JSON.parse(localStorage.getItem("ads")) || [];
    allAds = allAds.filter(ad => ad.id !== id);
    localStorage.setItem("ads", JSON.stringify(allAds));

    // Обновляем состояние компонента
    setAds(prevAds => prevAds.filter(ad => ad.id !== id));
  };

  if (!user) {
    return (
      <>
        <Header user={user} setUser={setUser} />
        <p style={{ textAlign: "center", marginTop: "50px" }}>
          Сначала войдите в аккаунт!
        </p>
      </>
    );
  }

  return (
    <>
      <Header user={user} setUser={setUser} />
      <div
        className="my-ads-list"
        style={{ maxWidth: "800px", margin: "40px auto" }}
      >
        {ads.length > 0 ? (
          ads.map(ad => (
            <div key={ad.id} style={{ position: "relative" }}>
              <AdCard ad={ad} />

              {/* Кнопки управления */}
              <div
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  display: "flex",
                  gap: "8px"
                }}
              >
                <button
                  style={{
                    backgroundColor: "#00aaff",
                    color: "#fff",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    cursor: "pointer"
                  }}
                  onClick={() => navigate(`/edit/${ad.id}`)}
                >
                  Редактировать
                </button>

                <button
                  style={{
                    backgroundColor: "#ff4d4f",
                    color: "#fff",
                    border: "none",
                    padding: "6px 12px",
                    borderRadius: "6px",
                    cursor: "pointer"
                  }}
                  onClick={() => handleDelete(ad.id)}
                >
                  Удалить
                </button>
              </div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: "center" }}>
            У вас ещё нет объявлений.
          </p>
        )}
      </div>
    </>
  );
}

export default MyAds;

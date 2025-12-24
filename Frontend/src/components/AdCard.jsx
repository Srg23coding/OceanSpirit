import { useNavigate } from "react-router-dom";
import "./AdCard.css";

function AdCard({ ad }) {
  const navigate = useNavigate();

  return (
    <div className="ad-card" onClick={() => navigate(`/ad/${ad.id}`)}>
      <img src={ad.image} alt={ad.title} />

      <div className="ad-info">
        <h3>{ad.title}</h3>
        <p>{ad.description}</p>
        <span className="price">{ad.price} ₽</span>
        <p className="seller">Продавец: {ad.seller}</p>

        <div className="ad-actions">
          <button
            onClick={(e) => {
              e.stopPropagation(); // чтобы клик по кнопке не открывал страницу
              alert(`Открываем чат с продавцом: ${ad.seller}`);
            }}
          >
            Написать
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              alert("Добавлено в избранное");
            }}
          >
            ❤
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdCard;

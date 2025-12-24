import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./EditAd.css";

function EditAd({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(""); // добавляем состояние для картинки
  const [preview, setPreview] = useState(""); // превью для формы

  useEffect(() => {
    const ads = JSON.parse(localStorage.getItem("ads")) || [];
    const ad = ads.find((a) => a.id === Number(id));

    if (!ad || ad.seller !== user?.login) {
      navigate("/");
      return;
    }

    setTitle(ad.title);
    setDescription(ad.description);
    setPrice(ad.price);
    setImage(ad.image || "");
    setPreview(ad.image || "");
  }, [id, user, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result); // base64
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const ads = JSON.parse(localStorage.getItem("ads")) || [];
    const updatedAds = ads.map((ad) =>
      ad.id === Number(id)
        ? { ...ad, title, description, price, image }
        : ad
    );

    localStorage.setItem("ads", JSON.stringify(updatedAds));
    navigate("/my-ads");
  };

  return (
    <div className="edit-container">
      <h2>Редактировать объявление</h2>

      <form onSubmit={handleSubmit} className="edit-form">
        <input
          className="edit-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Название"
          required
        />

        <textarea
          className="edit-textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Описание"
          required
        />

        <input
          className="edit-input"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Цена"
          required
        />

        <div className="image-upload">
          {preview && <img src={preview} alt="Превью" className="image-preview" />}
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>

        <div className="edit-actions">
          <button type="submit" className="edit-save">
            Сохранить
          </button>

          <button
            type="button"
            className="edit-cancel"
            onClick={() => navigate("/my-ads")}
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditAd;

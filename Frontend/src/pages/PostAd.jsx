import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "./PostAd.css";

function PostAd({ user, setUser }) {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [preview, setPreview] = useState("");

  if (!user) {
    navigate("/login");
    return null;
  }

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
    const newAd = {
      id: Date.now(),
      title,
      description,
      price,
      image,
      seller: user.login,
    };

    ads.push(newAd);
    localStorage.setItem("ads", JSON.stringify(ads));
    navigate("/my-ads");
  };

  return (
    <>
      <Header user={user} setUser={setUser} />
      <div className="post-container">
        <h2>Разместить объявление</h2>
        <form onSubmit={handleSubmit} className="post-form">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Название"
            required
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Описание"
            required
          />

          <input
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

          <button type="submit" className="post-save">
            Разместить
          </button>
        </form>
      </div>
    </>
  );
}

export default PostAd;

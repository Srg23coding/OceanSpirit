import { useNavigate } from "react-router-dom";
import "./Header.css";
import logo from "../assets/logo.png";

function Header({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (!window.confirm("Выйти из аккаунта?")) return;
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <header className="header">
      <nav className="nav">
        {/* Левая часть */}
        <div className="nav-left">
          <button onClick={() => navigate("/chats")}>Чаты</button>
          <button onClick={() => navigate("/post")}>Разместить</button>
        </div>

        {/* Логотип по центру */}
        <div className="logo" onClick={() => navigate("/")}>
          <img src={logo} alt="OceanSpirit" />
        </div>

        {/* Правая часть */}
        <div className="nav-right">
          <button onClick={() => navigate("/my-ads")}>Мои объявления</button>
          {user ? (
            <span className="user-login" onClick={handleLogout} title="Выйти из аккаунта">
              {user.login}
            </span>
          ) : (
            <button onClick={() => navigate("/login")}>Вход</button>
          )}
        </div>
      </nav>
      
    </header>
  );
}

export default Header;

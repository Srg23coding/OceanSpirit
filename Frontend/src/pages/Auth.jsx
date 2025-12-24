import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import "./Auth.css";

function Auth({ setUser }) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (isRegister) {
      const exists = users.find(u => u.login === login);
      if (exists) {
        alert("Пользователь уже существует");
        return;
      }

      users.push({ login, password });
      localStorage.setItem("users", JSON.stringify(users));

      const user = { login };
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      navigate("/");
    } else {
      const user = users.find(
        u => u.login === login && u.password === password
      );

      if (!user) {
        alert("Неверный логин или пароль");
        return;
      }

      const currentUser = { login };
      localStorage.setItem("user", JSON.stringify(currentUser));
      setUser(currentUser);
      navigate("/");
    }
  };

  return (
    <>
      <Header user={JSON.parse(localStorage.getItem("user"))} setUser={setUser} />
      <div className="auth">
        <h2>{isRegister ? "Регистрация" : "Вход"}</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Логин"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">
            {isRegister ? "Зарегистрироваться" : "Войти"}
          </button>
        </form>

        <p className="switch">
          {isRegister ? "Уже есть аккаунт?" : "Нет аккаунта?"}
          <span onClick={() => setIsRegister(!isRegister)}>
            {isRegister ? " Войти" : " Зарегистрироваться"}
          </span>
        </p>
      </div>
    </>
  );
}

export default Auth;

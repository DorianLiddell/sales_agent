import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

import "../../assets/styles/components/Auth/_LoginPage.scss";

export default function LoginPage() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (authLogin(login, password)) {
      navigate("/map", { replace: true });
    } else {
      setError("Неверный логин или пароль");
    }
  };

  return (
    <div className="login-page">
      <div className="login-page__card">
        <h2 className="login-page__title">Вход</h2>

        <form onSubmit={handleSubmit} className="login-page__form">
          <input
            type="text"
            placeholder="Логин"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            className="login-page__input"
            required
            autoComplete="username"
          />

          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-page__input"
            required
            autoComplete="current-password"
          />

          {error && <p className="login-page__error">{error}</p>}

          <button type="submit" className="login-page__button">
            Войти
          </button>
        </form>

        <p className="login-page__hint">
          Подсказка: логин <strong>test</strong>, пароль <strong>test</strong>
        </p>
      </div>
    </div>
  );
}
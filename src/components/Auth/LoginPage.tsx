import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login: authLogin } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (authLogin (login, password)) {
            navigate('/map');
        } else {
            setError('Неверный логин или пароль');
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: '100px auto', padding: 20}}>
            <h2>Вход</h2>
            <form onSubmit={handleSubmit}>
                <input
                placeholder="Логин"
                value={login}
                onChange={e => setLogin(e.target.value)}
                style={{display: 'block', width: '100%', marginBottom: 10, padding: 10}}
                />
                <input 
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ display: 'block', width: '100%', marginBottom: 10, padding: 10 }}
                />
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <button type="submit" style={{ padding: '10px 20px' }}>
                    Войти
                </button>
            </form>
            <p style={{ marginTop: 20, fontSize: 14 }}>
                Подсказка: логин <b>test</b>, пароль <b>test</b>
            </p>
        </div>
    );
}
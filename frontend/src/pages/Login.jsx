import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import './Login.css';
import './auth.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');

  // Валидаторы
  const validateUsername = (value) => {
    if (!/^[a-zA-Z][a-zA-Z0-9]{3,19}$/.test(value)) {
      return 'Логин должен содержать от 4 до 20 символов, начинаться с буквы и содержать только латинские буквы и цифры.';
    }
    return '';
  };

  const validatePassword = (value) => {
    if (value.length < 6) {
      return 'Пароль должен содержать не менее 6 символов.';
    }
    if (!/[A-Z]/.test(value)) {
      return 'Пароль должен содержать хотя бы одну заглавную букву.';
    }
    if (!/\d/.test(value)) {
      return 'Пароль должен содержать хотя бы одну цифру.';
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      return 'Пароль должен содержать хотя бы один специальный символ (!@#$%^&*(),.?":{}|<>).';
    }
    return '';
  };


  // Получаем CSRF-токен при загрузке компонента
  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        await fetch(`${import.meta.env.VITE_SERVER_URL}/api/login/`, {
          method: 'GET',
          credentials: 'include',
        });
        const token = getCookie('csrftoken');
        setCsrfToken(token);
      } catch (err) {
        console.error('Ошибка при получении CSRF-токена:', err);
      }
    };
    
    fetchCsrfToken();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Проверка валидатора для соответствующего поля
    switch (name) {
      case 'username':
        setValidationErrors(prev => ({ ...prev, username: validateUsername(value) }));
        break;
      case 'password':
        setValidationErrors(prev => ({ ...prev, password: validatePassword(value) }));
        break;
      default:
        break;
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationErrors({});
    setServerError('');
    setLoading(true);

    try {
      // Получаем актуальный CSRF-токен из кук
      const currentToken = getCookie('csrftoken');
      
      if (!currentToken) {
        throw new Error('CSRF-токен не найден. Пожалуйста, обновите страницу.');
      }

      console.log('Используемый CSRF-токен:', currentToken);
      
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/login/`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': currentToken,
        },
        body: JSON.stringify(formData)
      });

      // if (response.status === 403) {
      //   throw new Error('Ошибка авторизации: отказано в доступе (403). Возможно, проблема с CSRF-токеном.');
      // }

      const data = await response.json();

      if (response.ok) {
        navigate('/dashboard');
      } else {
        setServerError(data.error || 'Произошла ошибка при входе');
      }
    } catch (error) {
      console.error('Ошибка при входе:', error);
      setServerError(error.message || 'Произошла ошибка при подключении к серверу');
    } finally {
      setLoading(false);
    }
  };

  // Функция для получения значения cookie по имени
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };

  return (
    <div className="login-container">
      <h2>Вход в систему</h2>
      {serverError && (
        <div className="error-message general-error">
          {serverError}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Логин:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className={validationErrors.username ? "error-input" : ""}
            required
          />
          {validationErrors.username && (
            <div className="error-message">{validationErrors.username}</div>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="password">Пароль:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={validationErrors.password ? "error-input" : ""}
            required
          />
          {validationErrors.password && (
            <div className="error-message">{validationErrors.password}</div>
          )}
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Вход...' : 'Войти'}
        </button>
        <div className="auth-links">
          <p>Нет аккаунта? <Link to="/register">Зарегистрироваться</Link></p>
        </div>
      </form>
      <Link to="/" className="back-button">
        <span className="back-arrow">←</span> На главную
      </Link>
    </div>
  );
};

export default Login;
  
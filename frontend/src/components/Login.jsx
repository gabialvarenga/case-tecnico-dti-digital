import { useState } from 'react';
import { api } from '../services/api';
import './Login.css';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Preencha todos os campos');
      return;
    }

    if (username.length < 3) {
      setError('Username deve ter no mínimo 3 caracteres');
      return;
    }

    if (password.length < 4) {
      setError('Senha deve ter no mínimo 4 caracteres');
      return;
    }

    setLoading(true);

    try {
      let userData;
      if (isRegister) {
        userData = await api.register(username, password);
        alert('Cadastro realizado com sucesso! Faça login.');
        setIsRegister(false);
        setPassword('');
      } else {
        userData = await api.login(username, password);
        onLogin(userData);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>📚 Sistema de Gestão Escolar</h1>
          <p>{isRegister ? 'Criar nova conta' : 'Entre com suas credenciais'}</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-alert">{error}</div>}

          <div className="form-group">
            <label htmlFor="username">Usuário</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Digite seu usuário (mín. 3 caracteres)"
              required
              minLength={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha (mín. 4 caracteres)"
              required
              minLength={4}
            />
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Processando...' : isRegister ? 'Cadastrar' : 'Entrar'}
          </button>
        </form>

        <div className="login-footer">
          <button
            type="button"
            className="btn-link"
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
          >
            {isRegister ? 'Já tem conta? Fazer login' : 'Não tem conta? Cadastre-se'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;

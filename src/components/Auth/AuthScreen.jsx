import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import styles from './AuthScreen.module.css';

const AuthScreen = () => {
  const { login } = useContext(AuthContext);
  const [isLogin, setIsLogin] = useState(true);
  
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    
    try {
      const res = await fetch(`http://localhost:3001${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Erro de autenticação');
      }
      
      login(data.usuario, data.token);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h2>{isLogin ? 'Bem-vindo de volta!' : 'Crie sua conta!'}</h2>
          <p>
            {isLogin ? 'Faça o login para acessar suas tarefas.' : 'Preencha os dados abaixo e junte-se a nós.'}
          </p>
        </div>

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        <form className={styles.form} onSubmit={handleSubmit}>
          {!isLogin && (
            <div className={styles.formGroup}>
              <label className={styles.label}>Nome</label>
              <div className={styles.inputWrapper}>
                <User size={18} className={styles.icon} />
                <input
                  name="nome"
                  type="text"
                  required
                  className={styles.input}
                  value={formData.nome}
                  onChange={handleChange}
                  placeholder="Seu nome completo"
                />
              </div>
            </div>
          )}
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Email</label>
            <div className={styles.inputWrapper}>
              <Mail size={18} className={styles.icon} />
              <input
                name="email"
                type="email"
                required
                className={styles.input}
                value={formData.email}
                onChange={handleChange}
                placeholder="seu@email.com"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Senha</label>
            <div className={styles.inputWrapper}>
              <Lock size={18} className={styles.icon} />
              <input
                name="senha"
                type="password"
                required
                className={styles.input}
                value={formData.senha}
                onChange={handleChange}
                placeholder="••••••••"
              />
            </div>
          </div>

          <button type="submit" className={styles.submitBtn}>
            {isLogin ? 'Entrar' : 'Cadastrar'}
            <ArrowRight className={styles.submitIcon} size={18} />
          </button>
        </form>

        <div className={styles.footer}>
          <p className={styles.footerText}>
            {isLogin ? 'Não tem uma conta?' : 'Já possui conta?'}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className={styles.switchBtn}
              type="button"
            >
              {isLogin ? 'Cadastre-se' : 'Faça o Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;

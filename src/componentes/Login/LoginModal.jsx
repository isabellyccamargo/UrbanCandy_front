import React, { useState } from 'react';
import { loginUser } from '../../Services/Api';
import { Link } from 'react-router-dom';
import './LoginModal.css';

const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({ ...prev, [name]: value }));
    };

    const handleClose = () => {
        setCredentials({ email: '', password: '' });
        setError('');
        setShowPass(false);
        onClose();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const data = await loginUser(credentials.email, credentials.password);
            localStorage.setItem('user', JSON.stringify(data));
            onLoginSuccess(data);
            handleClose();
        } catch (err) {
            setError(err.mensagem || 'E-mail ou senha inválidos');
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <button className="close-x" onClick={handleClose}>&times;</button>

                <div className="modal-header">
                    <h2>Entrar na Conta</h2>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    {error && <p className="error-message-login">{error}</p>}

                    <div className="form-group">
                        <label>E-mail</label>
                        <input
                            name="email"
                            type="email"
                            value={credentials.email}
                            onChange={handleChange}
                            placeholder="exemplo@email.com"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Senha</label>
                        <div className="password-wrapper-modal">
                            <input
                                name="password"
                                type={showPass ? "text" : "password"}
                                value={credentials.password}
                                onChange={handleChange}
                                required
                            />
                            <span
                                className="toggle-pass-modal"
                                onClick={() => setShowPass(!showPass)}
                            >
                                {showPass ? "Ocultar" : "Mostrar"}
                            </span>
                        </div>
                    </div>

                    <button type="submit" className="btn-entrar">Entrar</button>
                </form>

                <p className="footer-text">
                    Não tem cadastro?
                    <Link to="/perfil" onClick={handleClose}> Crie sua conta aqui</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginModal;
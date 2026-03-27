import React, { useState } from 'react';
import { loginUser } from '../../Services/Api';
import { Link } from 'react-router-dom';
import { useCart } from '../../Hooks/UseCart';
import { Button } from '../Button/Button';
import { toast } from 'react-toastify';
import { useAuth } from '../../Hooks/AuthContext';
import { setHeaderToken } from '../../Services/Api';
import './LoginModal.css';

const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
    const { login } = useAuth();
    const { syncCart } = useCart();
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const idToast = toast.loading("Autenticando...");

        try {
            const data = await loginUser(credentials.email, credentials.password);

            if (data.token) {
                localStorage.setItem('@UrbanCandy:token', data.token);
                setHeaderToken(data.token);
            }

            const profile = data.user;
            login(profile);

            if (data.id_people) {
                await syncCart(data.id_people);
            }

            toast.update(idToast, {
                render: `Bem-vindo(a), ${profile?.nome || 'Candy Lover'}! 🍬`,
                type: "success",
                isLoading: false,
                autoClose: 3000
            });

            onLoginSuccess(profile);
            handleClose();
        } catch (err) {
            const msgErro = err.response?.data?.mensagem || 'E-mail ou senha inválidos';

            toast.update(idToast, {
                render: msgErro,
                type: "error",
                isLoading: false,
                autoClose: 3000
            });

            setError(msgErro);
        }
    };

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

                    <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: '10px' }}>
                        <Button type="submit" variant="primary">
                            Entrar
                        </Button>
                    </div>
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
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Users } from 'lucide-react';
import LoginModal from '../../componentes/Login/LoginModal';
import { Button } from '../Button/Button';
import { toast } from 'react-toastify';
import { useAuth } from '../../Hooks/AuthContext';
import './Header.css';
import { useCart } from "../../Hooks/UseCart";

export const Header = () => {
  const {
    user,
    setUser,
    logout,
    isLoginModalOpen,
    setIsLoginModalOpen
  } = useAuth();

  const { setIsCartOpen, cart, clearCart } = useCart();

  const navigate = useNavigate();
  const [intendedPath, setIntendedPath] = useState(null);

  const handleProtectedLink = (e, path) => {
    e.preventDefault();
    if (!user) {
      setIntendedPath(path);
      setIsLoginModalOpen(true);
    } else {
      navigate(path);
    }
  };

  const handleLogout = () => {
    toast.info("Até logo! Sua sessão foi encerrada. 👋", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });

    // 2. Limpa os dados (como você já fazia)
    localStorage.removeItem('@UrbanCandy:user');
    localStorage.removeItem('@UrbanCandy:token');
    clearCart();
    setUser(null);

    // 3. Redireciona para a Home
    logout();
    navigate('/');
  };



  return (
    <header className="main-header">
      <div className="header-container">
        <Link to="/" className="logo-area">
          <img src="/src/assets/logo.png" alt="SugarBeat Logo" className="logo-image" />
        </Link>

        <div className="header-actions">
          <div className="icon-btn" onClick={() => setIsCartOpen(true)} style={{ cursor: 'pointer' }}>
            <ShoppingCart size={24} color="#5D4037" />
            <span className="cart-badge">{cart.items.length}</span>
          </div>

          <div className="user-menu-container">
            <div className="user-menu-trigger">
              <User size={24} color="#5D4037" />
              {user && (
                <span>Olá, {user.nome?.split(' ')[0] || 'Usuário'}</span>
              )}
              <span className="arrow-down">▼</span>
            </div>

            <div className="dropdown-menu">
              <a href="#" onClick={(e) => handleProtectedLink(e, '/perfil')} className="dropdown-item">
                Meu Perfil
              </a>
              <a href="#" onClick={(e) => handleProtectedLink(e, '/pedidos')} className="dropdown-item">
                Meus Pedidos
              </a>
              <a href="#" onClick={(e) => handleProtectedLink(e, '/admin')} className="dropdown-item">
                Área Administrador
              </a>
              <hr />
              {user ? (
                <Button onClick={handleLogout} variant="primary">
                  Sair
                </Button>
              ) : (
                <Button onClick={() => setIsLoginModalOpen(true)} variant="primary">
                  Entrar
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => {
          setIsLoginModalOpen(false);
          setIntendedPath(null); // Limpa ao fechar
        }}
        onLoginSuccess={(userData) => {
          setUser(userData);
          setIsLoginModalOpen(false);

          // 3. LÓGICA DE REDIRECIONAMENTO DINÂMICO:
          // Se ele clicou em algo específico, vai para lá. 
          // Se não (clicou só em 'Entrar'), vai para a Home ou Checkout.
          if (intendedPath) {
            navigate(intendedPath);
            setIntendedPath(null); // Limpa o estado
          } else {
            navigate('/'); // Ou para onde preferir como padrão
          }
        }}
      />
    </header>
  );
};
import React, {  useState } from 'react'; 
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Users } from 'lucide-react';
import LoginModal from '../../componentes/Login/LoginModal';
import { Button } from '../Button/Button';
import './Header.css';
import { useCart } from "../../Hooks/UseCart";

export const Header = () => {
  const { setIsCartOpen, cart, isLoginModalOpen, setIsLoginModalOpen, clearCart } = useCart();
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('@UrbanCandy:user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('login') === 'true') {
      setIsLoginModalOpen(true);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [setIsLoginModalOpen]);

  const handleProtectedLink = (e, path) => {
    e.preventDefault();
    if (!user) {
      setIsLoginModalOpen(true);
    } else {
      navigate(path);
    }
  };
  const handleLogout = () => {
    localStorage.removeItem('@UrbanCandy:user');
    localStorage.removeItem('@UrbanCandy:token');
    clearCart();
    setUser(null);
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
                <span>Olá, {user?.nome?.split(' ')[0] || 'Usuário'}</span>
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
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={(userData) => {
          setUser(userData);
          setIsLoginModalOpen(false);
          navigate('/checkout');
        }}
      />
    </header>
  );
};
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Users } from 'lucide-react';
import LoginModal from '../../componentes/Login/LoginModal';
import './Header.css';

export const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const handleProtectedLink = (e, path) => {
    e.preventDefault();
    if (!user) {
      setIsModalOpen(true);
    } else {
      navigate(path);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
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
          <Link to="/carrinho" className="icon-btn">
            <ShoppingCart size={24} color="#5D4037" />
            <span className="cart-badge">0</span>
          </Link>

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

              {user?.administrator === '1' && (
                <Link to="/admin" className="dropdown-item">Área do Administrador</Link>
              )}

              <hr />
              {user ? (
                <button onClick={handleLogout} className="dropdown-item logout">Sair</button>
              ) : (
                <button onClick={() => setIsModalOpen(true)} className="dropdown-item">Entrar</button>
              )}
            </div>
          </div>
        </div>
      </div>

      <LoginModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLoginSuccess={(userData) => setUser(userData)}
      />
    </header>
  );
};
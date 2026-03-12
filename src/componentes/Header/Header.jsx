import { Link } from 'react-router-dom';
import { ShoppingCart, User } from 'lucide-react'; 
import './Header.css';

export const Header = () => {
  return (
    <header className="main-header">
      <div className="header-container">
        {}
        <Link to="/" className="logo-area">
          <img src="/src/assets/logo.png" alt="SugarBeat Logo" className="logo-image" />
        </Link>

        {}
        <div className="header-actions">
          <Link to="/carrinho" className="icon-btn">
            <ShoppingCart size={24} color="#5D4037" />
            <span className="cart-badge">0</span> {}
          </Link>

          <div className="user-menu-container">
            <div className="user-menu-trigger">
              <User size={24} color="#5D4037" />
              <span className="arrow-down">▼</span>
            </div>
            
            {}
            <div className="dropdown-menu">
              <Link to="/perfil" className="dropdown-item">Meu Perfil</Link>
              <Link to="/pedidos" className="dropdown-item">Meus Pedidos</Link>
              <Link to="/admin" className="dropdown-item">Área do Administrador</Link>
              <hr />
              <button className="dropdown-item logout">Sair</button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
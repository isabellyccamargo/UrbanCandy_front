import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './componentes/Header/Header';
import Home from './pages/Home/Home';
import { MenuByCategory } from './pages/Menu/MenuByCategory';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cardapio/:categoryName" element={<MenuByCategory />} />
        <Route path="/carrinho" element={<div>Página do Carrinho</div>} />
        <Route path="/perfil" element={<div>Página do Perfil</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
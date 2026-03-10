import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './componentes/Header/Header';
import  Home  from './pages/Home/Home'; 

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/carrinho" element={<div>Página do Carrinho</div>} />
        <Route path="/perfil" element={<div>Página do Perfil</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
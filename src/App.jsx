import { Routes, Route } from 'react-router-dom';
import { Header } from './componentes/Header/Header';
import Home from './pages/Home/Home';
import { MenuByCategory } from './pages/Menu/MenuByCategory';
import { Footer } from './componentes/Footer/Footer';
import MyData from './pages/MeusDados/MyData';
import { CartModal } from './componentes/Cart/CartModal';
import Checkout from './pages/Checkout/Checkout';
import { AdminLayout } from './pages/Admin/AdminLayout';
import { Categorias } from './pages/Admin/Categories/CategoriesList';
import { CategoriesForm } from './pages/Admin/Categories/CategoriesForm';

function App() {
  return (
    <Routes>
      {/* 1. ROTAS DA LOJA (COM HEADER E FOOTER) */}
      <Route path="/" element={
        <>
          <Header />
          <CartModal />
          <Home />
          <Footer />
        </>
      } />

      <Route path="/cardapio/:categoryName" element={
        <>
          <Header />
          <CartModal />
          <MenuByCategory />
          <Footer />
        </>
      } />

      <Route path="/perfil" element={
        <>
          <Header />
          <MyData />
          <Footer />
        </>
      } />

      <Route path="/checkout" element={
        <>
          <Header />
          <Checkout />
          <Footer />
        </>
      } />

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<div>Dashboard em breve</div>} />
        <Route path="categorias" element={<Categorias />} />
        <Route path="categorias/form" element={<CategoriesForm />} />
      </Route>
    </Routes>
  );
}

export default App;
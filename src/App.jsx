import { Routes, Route } from 'react-router-dom';
import { Header } from './componentes/Header/Header';
import Home from './pages/Home/Home';
import { MenuByCategory } from './pages/Menu/MenuByCategory';
import { Footer } from './componentes/Footer/Footer';
import MyData from './pages/MyData/MyData';
import {MyOrders} from './pages/MyOrders/MyOrders';
import { CartModal } from './componentes/Cart/CartModal';
import Checkout from './pages/Checkout/Checkout';
import { AdminLayout } from './pages/Admin/AdminLayout';
import { Categorias } from './pages/Admin/Categories/CategoriesList';
import { CategoriesForm } from './pages/Admin/Categories/CategoriesForm';
import Dashboard from './pages/Admin/Dashboard/Dashboard';
import ProductList from './pages/Admin/Products/ProductsList';
import ProductsForm from './pages/Admin/Products/ProductsForm';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="colored"
      />
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

        <Route path="/pedidos" element={
          <>
            <Header />
            <MyOrders />
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
          <Route index element={<Dashboard />} />
          <Route path="categorias" element={<Categorias />} />
          <Route path="categorias/form" element={<CategoriesForm />} />

          <Route path="produtos" element={<ProductList />} />

          {/* 2. ADICIONE ESTA LINHA: Rota para NOVO produto */}
          <Route path="produtos/form" element={<ProductsForm />} />

          {/* Rota para EDITAR produto (com ID) */}
          <Route path="produtos/form/:id" element={<ProductsForm />} />
        </Route>
      </Routes>
    </>
  );
}


export default App;
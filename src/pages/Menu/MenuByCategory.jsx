import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductsByCategory } from '../../Services/Api';
import { getAllCategory } from '../../Services/Api';
import { CardProduct } from '../../componentes/CardProduct/CardProduct';
import { NavLink } from 'react-router-dom';
import './MenuByCategory.css';

export const MenuByCategory = () => {
  const { categoryName } = useParams();
  const [categoriesMenu, setCategoriesMenu] = useState([])
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategory()
        const listaDeCategorias = response.data?.data || response.data || response;
        setCategoriesMenu(listaDeCategorias);
      } catch (err) {
        console.error("Erro ao buscar categorias", err);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await getProductsByCategory(categoryName);
        const rawData = response.data?.data || response.data || response;

        if (Array.isArray(rawData)) {
          setProducts(rawData);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error("Erro ao carregar categoria:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (categoryName) {
      fetchProducts();
    }
    window.scrollTo(0, 0);
  }, [categoryName]);

  return (
    <main className="menu-container">

      <nav className="category-nav">
        <ul>
          {categoriesMenu.map((cat) => (
            <li key={cat.id_category}>
              <NavLink
                to={`/cardapio/${cat.name_category.toLowerCase()}`} 
                className={({ isActive }) => isActive ? "active-link" : ""}
              >
                {cat.name_category} 
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <header className="menu-header">
        <h1 style={{ textTransform: 'capitalize' }}>{categoryName}</h1>

        <div className="divider"></div>
        <h2 className="menu-subtitle">Escolha seu sabor favorito</h2>
      </header>

      {loading ? (
        <div className="loading">Carregando doces...</div>
      ) : (
        <section className="products-grid">
          {products.length > 0 ? (
            products.map((product) => (
              <CardProduct key={product.id_product} product={product} showDescription={true} />
            ))
          ) : (
            <p className="no-products">Nenhum doce encontrado nesta categoria.</p>
          )}
        </section>
      )}
    </main>
  );
};
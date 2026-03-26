import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductsByCategory, getAllCategory } from '../../Services/Api';
import { CardProduct } from '../../componentes/CardProduct/CardProduct';
import { NavLink } from 'react-router-dom';
import { toast } from 'react-toastify'; // Importação do Toast
import './MenuByCategory.css';

export const MenuByCategory = () => {
  const { categoryName } = useParams();
  const [categoriesMenu, setCategoriesMenu] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategory();
        const listaDeCategorias = response.data?.data || response.data || response;
        setCategoriesMenu(listaDeCategorias);
      } catch (err) {
        console.error("Erro ao buscar categorias", err);
        toast.error("Não conseguimos carregar o menu de categorias. 🍫");
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
          if (rawData.length === 0) {
            toast.info(`Ainda não temos doces na categoria ${categoryName}. Volte logo! ✨`);
          }
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error("Erro ao carregar categoria:", err);
        setProducts([]);
        toast.error(`Ops! Erro ao carregar os doces de ${categoryName}. 🍬`);
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
    <main className="menu-container animate-entrance">
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
        <div className="loading-container">
          <div className="candy-loader"></div> 
          <p>Buscando as melhores opções para você...</p>
        </div>
      ) : (
        <section className="products-grid">
          {products.length > 0 ? (
            products.map((product) => (
              <CardProduct 
                key={product.id_product} 
                product={product} 
                showDescription={true} 
              />
            ))
          ) : (
            <div className="no-products-feedback">
              <p>Nenhum doce encontrado nesta categoria. ✨</p>
              <span className="hint">Que tal explorar outras categorias acima?</span>
            </div>
          )}
        </section>
      )}
    </main>
  );
};
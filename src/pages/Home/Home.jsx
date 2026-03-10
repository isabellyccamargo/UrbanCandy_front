import { useEffect, useState } from 'react';
import { getFeaturedProducts } from '../../Services/api';
import { CardProduct } from '../../componentes/CardProduct/CardProduct';
import './Home.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getFeaturedProducts();
        // Acessando data.data conforme seu código anterior
        const onlyFeatured = data.data.filter(p => Number(p.featured) === 1);
        setProducts(onlyFeatured);
      } catch {
        setError("Não foi possível carregar os produtos.");
      }
    };
    fetchItems();
  }, []);

  return (
    <section className="highlights-section">
      <div className="highlights-header">
        <h2>Destaques da Casa</h2>
        <p>Os produtos mais amados pelos nossos clientes</p>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="carousel-container">
        <div className="products-slider">
          {/* Renderizamos a lista duas vezes ([...products, ...products]) para o loop infinito visual */}
          {[...products, ...products].map((product, index) => (
            <CardProduct key={`${product.id_product}-${index}`} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Home;
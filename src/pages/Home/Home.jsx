import { useEffect, useState, useRef } from 'react';
import { getFeaturedProducts } from '../../Services/api';
import { CardProduct } from '../../componentes/CardProduct/CardProduct';
import './Home.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const carouselRef = useRef(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getFeaturedProducts();
        const onlyFeatured = data.data.filter(p => Number(p.featured) === 1);
        setProducts(onlyFeatured);
      } catch {
        setError("Não foi possível carregar os produtos.");
      }
    };
    fetchItems();
  }, []);

  useEffect(() => {
    if (products.length > 0) {
      const timer = setInterval(() => {
        if (carouselRef.current) {
          const { scrollLeft, offsetWidth, scrollWidth } = carouselRef.current;
          if (scrollLeft + offsetWidth >= scrollWidth - 5) {
            carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            carouselRef.current.scrollBy({ left: 350, behavior: 'smooth' });
          }
        }
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [products]);

  return (
    <section className="highlights-section">
      <div className="highlights-header">
        <h2>Destaques da Casa</h2>
        <p>Os produtos mais amados pelos nossos clientes</p>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="products-grid" ref={carouselRef}>
        {products.map((product) => (
          <CardProduct key={product.id_product} product={product} />
        ))}
      </div>
    </section>
  );
};

export default Home;
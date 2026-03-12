import { useEffect, useState } from 'react';
import { getFeaturedProducts } from '../../Services/api';
import { CardProduct } from '../../componentes/CardProduct/CardProduct';
import { CategoryCard } from '../../componentes/Category/CategoryCard';
import './Home.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const fotosDasCategorias = {
    "Brigadeiros": "Brigadeiro.jpg",
    "Cookies": "CookieChocolate.jpg",
    "Brownies": "BrownieNutella.jpg"
  };

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await getFeaturedProducts();
        const rawData = response.data ? response.data : response;

        if (Array.isArray(rawData)) {
          setProducts(rawData.filter(p => Number(p.featured) === 1));

          const listaUnica = [];
          const jaAdicionadas = new Set();

          rawData.forEach(p => {
            const categoryName = typeof p.category === 'object' ? p.category.name_category : p.category;

            if (!jaAdicionadas.has(categoryName)) {
              jaAdicionadas.add(categoryName);
              listaUnica.push({
                name: categoryName,
                image: fotosDasCategorias[categoryName] || p.image
              });
            }
          });
          setCategories(listaUnica);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchItems();
  }, []);

  return (
    <main className="home-container">
      <section className="highlights-section">
        <div className="highlights-header">
          <h2>Destaques da Casa</h2>
          <p>Os produtos mais amados pelos nossos clientes</p>
        </div>

        <div className="carousel-container">
          <div className="products-slider">
            {[...products, ...products].map((product, index) => (
              <div className="slider-item" key={`${product.id_product}-${index}`}>
                <CardProduct product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="categories-section">
        <div className="categories-header"> 
          <h2>Nosso Cardápio</h2>
          <p>Escolha sua categoria favorita e descubra os sabores</p>
        </div>

        <div className="categories-grid">
          {categories.map((cat, index) => (
            <CategoryCard
              key={index}
              title={cat.name_category || cat.name || cat}
              image={cat.image}
            />
          ))}
        </div>
      </section>

    </main>
  );
};

export default Home;
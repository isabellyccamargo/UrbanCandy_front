import { useEffect, useState } from 'react';
import { getFeaturedProducts } from '../../Services/api';
import { CardProduct } from '../../componentes/CardProduct/CardProduct';
import { CategoryCard } from '../../componentes/Category/CategoryCard';
import { FeatureCard } from '../../componentes/Featured/FeaturedCard';
import imgIngredientes from '../../assets/ingredientes.png';
import imgComAmor from '../../assets/comAmor.png';
import sabor from '../../assets/sabor.png';
import entrega from '../../assets/entrega.png';
import sobre1 from '../../assets/sobre1.png';
import sobre2 from '../../assets/sobre2.png';
import sobre3 from '../../assets/sobre3.png';
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

      <section className="features-section">
        <div className="categories-header">
          <h2>Por que escolher nossos produtos?</h2>
          <p>Qualidade, sabor e carinho em cada mordida</p>
        </div>

        <div className="features-grid">
          <FeatureCard
            icon="verified"
            title="Ingredientes Premium"
            description="Utilizamos apenas ingredientes de primeira qualidade, selecionados cuidadosamente."
            image={imgIngredientes}
          />
          <FeatureCard
            icon="favorite"
            title="Feito com Amor"
            description="Cada doce é preparado artesanalmente, com carinho e dedicação em cada detalhe."
            image={imgComAmor}
          />
          <FeatureCard
            icon="local_shipping"
            title="Entrega Rápida"
            description="Entregas ágeis e seguras para você receber seus doces fresquinhos."
            image={entrega}
          />
          <FeatureCard
            icon="star"
            title="Sabor Inigualável"
            description="Receitas exclusivas que conquistam o paladar mais exigente."
            image={sabor}
          />
        </div>
      </section>

      <section className="about-section">
        <div className="about-container">

          <div className="about-text">
            <h2>Doces feitos com <span>amor e dedicação</span></h2>
            <p>
              Na Urban Candy, cada doce é uma obra de arte artesanal. Utilizamos apenas ingredientes
              premium e receitas exclusivas para criar momentos doces inesquecíveis.
            </p>
            <p>
              Desde brigadeiros gourmet até brownies irresistíveis, nossos produtos são perfeitos
              para presentear ou se presentear.
            </p>
            <div className="about-buttons">
              <button className="btn-filled">Fazer Pedido</button>
              <button className="btn-outline">Ver Cardápio</button>
            </div>
          </div>

          <div className="about-image-grid">
            <div className="img-box top-left">
              <img src={sobre1} alt="Brigadeiros" />
            </div>

            <div className="img-box main-right">
              <img src={sobre2} alt="Bolo de chocolate" />
            </div>

            <div className="img-box bottom-left">
              <img src={sobre3} alt="Brownie com frutas" />
            </div>
          </div>

        </div>
      </section>

    </main>
  );
};

export default Home;
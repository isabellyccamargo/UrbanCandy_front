import { useEffect, useState } from 'react';
import { getFeaturedProducts } from '../../Services/Api';
import { CardProduct } from '../../componentes/CardProduct/CardProduct';
import { CategoryCard } from '../../componentes/Category/CategoryCard';
import { FeatureCard } from '../../componentes/Featured/FeaturedCard';
import { Link } from 'react-router-dom';
import { FEATURES, CATEGORY_IMAGES } from './HomeData'; 
import sobre1 from '../../assets/sobre1.png';
import sobre2 from '../../assets/sobre2.png';
import sobre3 from '../../assets/sobre3.png';
import './Home.css';

const SectionHeader = ({ title, sub }) => (
  <div className="categories-header">
    <h2>{title}</h2>
    <p>{sub}</p>
  </div>
);
const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const response = await getFeaturedProducts();
        const rawData = response?.data || response || [];
        if (!Array.isArray(rawData)) return;

        setProducts(rawData.filter(p => Number(p.featured) === 1));

        const uniqueCategories = Array.from(new Set(rawData.map(p =>
          p.category?.name_category || p.category || "Geral"
        ))).map(name => ({
          name,
          image: CATEGORY_IMAGES[name] || rawData.find(p => (p.category?.name_category || p.category) === name)?.image
        }));

        setCategories(uniqueCategories);
      } catch (err) {
        console.error("Erro na Home:", err);
      }
    };
    loadHomeData();
  }, []);

  return (
    <main className="home-container">
      <section className="highlights-section">
        <SectionHeader title="Destaques da Casa" sub="Os produtos mais amados pelos nossos clientes" />
        <div className="carousel-container">
          <div className="products-slider">
            {[...products, ...products].map((p, i) => (
              <div className="slider-item" key={`${p.id_product}-${i}`}><CardProduct product={p} /></div>
            ))}
          </div>
        </div>
      </section>

      <section className="categories-section">
        <SectionHeader title="Nosso Cardápio" sub="Escolha sua categoria favorita e descubra os sabores" />
        <div className="categories-grid">
          {categories.map((cat, i) => (
            <CategoryCard key={i} title={cat.name} image={cat.image} />
          ))}
        </div>
      </section>

      <section className="features-section">
        <SectionHeader title="Por que nos escolher?" sub="Qualidade, sabor e carinho em cada mordida" />
        <div className="features-grid">
          {FEATURES.map((f, i) => <FeatureCard key={i} {...f} />)}
        </div>
      </section>

      <section className="about-section">
        <div className="about-container">
          <div className="about-text">
            <h2>Doces feitos com <span>amor e dedicação</span></h2>
            <p>Na Urban Candy, cada doce é uma obra de arte artesanal. Utilizamos ingredientes premium e receitas exclusivas.</p>
            <div className="about-buttons">
              <Link to="/cardapio/brigadeiros" className="btn-filled">Fazer Pedido</Link>
              <Link to="/cardapio/brigadeiros" className="btn-outline">Ver Cardápio</Link>
            </div>
          </div>

          <div className="about-image-grid">
            <div className="img-box top-left"><img src={sobre1} alt="Doce 1" /></div>
            <div className="img-box main-right"><img src={sobre2} alt="Doce 2" /></div>
            <div className="img-box bottom-left"><img src={sobre3} alt="Doce 3" /></div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
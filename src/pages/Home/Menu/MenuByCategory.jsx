import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getFeaturedProducts } from '../../../Services/api'; 
import { CardProduct } from '../../../componentes/CardProduct/CardProduct';

export const MenuByCategory = () => {
  const { categoryName } = useParams(); 
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getFeaturedProducts();
      const filtered = data.data.filter(
        p => p.category.toLowerCase() === categoryName.toLowerCase()
      );
      setProducts(filtered);
    };
    fetchProducts();
  }, [categoryName]);

  return (
    <section className="menu-section">
      <h2>Produtos: {categoryName}</h2>
      <div className="products-grid">
        {products.map(p => <CardProduct key={p.id_product} product={p} />)}
      </div>
    </section>
  );
};
import { Button } from '../Button/Button';
import './CardProduct.css';

export const CardProduct = ({ product, showDescription = false }) => {
  const baseImgUrl = "http://localhost:3030/uploads/";

  return (
    <div className="product-card">
      <img
        src={`${baseImgUrl}${product.image}`}
        alt={product.name}
        className="product-image"
      />
      <div className="product-info">
        <h3>{product.name}</h3>
        {showDescription && (
          <p className="product-description">{product.description}</p>
        )}

        { }
        <div className="product-footer">
          <p className="product-price">
            {Number(product.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </p>

          <Button variant="primary">
            Adicionar
          </Button>
        </div>
      </div>
    </div>
  );
};
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFeaturedProducts, deleteProduct } from '../../../Services/Api';
import { Button } from '../../../componentes/Button/Button';
import './ProductsList.css';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    const loadProducts = async (page = 1) => {
        try {
            setLoading(true);
            const response = await getFeaturedProducts(page, 6);
            const { data, totalPages: total } = response.data;
            setProducts(data || []);
            setTotalPages(total || 1);
        } catch (error) {
            console.error("Erro ao buscar produtos:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
loadProducts(currentPage);
    }, [currentPage]);

    const handleDelete = async (id) => {
        if (window.confirm("Deseja realmente excluir este produto?")) {
            try {
                await deleteProduct(id);
                loadProducts(currentPage);
            } catch {
                alert("Erro ao excluir produto.");
            }
        }
    };

    return (
        <div className="admin-page animate-entrance">
            <header className="admin-header">
                <div>
                    <h1>Produtos</h1>
                    <p>Gerencie todos os doces da sua vitrine</p>
                </div>
                <Button variant="primary" onClick={() => navigate('/admin/produtos/form')}>
                    + Novo Produto
                </Button>
            </header>

            <section className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Imagem</th>
                            <th>Nome / Descrição</th>
                            <th>Categoria</th>
                            <th>Preço</th>
                            <th>Destaque</th>
                            <th style={{ textAlign: 'right' }}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="7">Carregando...</td></tr>
                        ) : products.length > 0 ? (
                            products.map((product) => (
                                <tr key={product.id_product}>
                                    <td>#{product.id_product}</td>
                                    <td>
                                        <img
                                            src={`http://localhost:3030/uploads/${product.image}`}
                                            alt={product.name}
                                            className="product-img-table"
                                            onError={(e) => { e.target.src = 'https://via.placeholder.com/40?text=Doce'; }}
                                        />
                                    </td>
                                    <td>
                                        <div className="product-info-cell">
                                            <strong>{product.name}</strong>
                                            <span className="product-desc-short">{product.description}</span>
                                        </div>
                                    </td>
                                    <td>{product.category?.name_category || 'Geral'}</td>
                                    <td>{Number(product.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                    <td>
                                        {product.featured ? (
                                            <span className="badge featured">Sim</span>
                                        ) : (
                                            <span className="badge normal">Não</span>
                                        )}
                                    </td>
                                    <td style={{ textAlign: 'right' }}>
                                        <button
                                            className="btn-edit"
                                            onClick={() => navigate(`/admin/produtos/form/${product.id_product}`, { state: { produto: product } })}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className="btn-delete"
                                            onClick={() => handleDelete(product.id_product)}
                                        >
                                            Excluir
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="7" style={{ textAlign: 'center' }}>Nenhum produto encontrado.</td></tr>
                        )}
                    </tbody>
                </table>

                <div className="pagination-controls">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => prev - 1)}
                    >
                        Anterior
                    </button>

                    <span>Página {currentPage} de {totalPages}</span>

                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                    >
                        Próximo
                    </button>
                </div>
            </section>
        </div>
    );
};

export default ProductList;
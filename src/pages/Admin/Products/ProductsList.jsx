import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProducts, deleteProduct } from '../../../Services/Api';
import { Button } from '../../../componentes/Button/Button';
import './ProductsList.css';
import { toast } from 'react-toastify';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [showModal, setShowModal] = useState(false);
    const [idParaDeletar, setIdParaDeletar] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        loadProducts(currentPage);
    }, [currentPage]);

    const loadProducts = async (page = 1) => {
        try {
            setLoading(true);
            const response = await getAllProducts(page, 6);
            const { data, totalPages: total } = response.data;
            setProducts(data || []);
            setTotalPages(total || 1);
        } catch (error) {
            console.error("Erro ao buscar produtos:", error);
            toast.error("Não foi possível carregar a lista de produtos. 🍬");
        } finally {
            setLoading(false);
        }
    };

    const confirmarExclusao = async () => {
        try {
            await deleteProduct(idParaDeletar);
            toast.success("Produto removido com sucesso! ✨", { theme: "colored" });
            loadProducts(currentPage);
        } catch (err) {
            const msgErro = err.response?.data?.message || 'Erro ao excluir produto.';
            toast.error(msgErro, { theme: "colored" });
        } finally {
            setShowModal(false);
            setIdParaDeletar(null);
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
                                            onClick={() => {
                                                setIdParaDeletar(product.id_product);
                                                setShowModal(true);
                                            }}
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

                {/* Paginação */}
                <div className="pagination-controls">
                    <Button variant="secondary" disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} >
                        Anterior
                    </Button>

                    <span>Página {currentPage} de {totalPages}</span>

                    <Button variant="secondary" disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => prev + 1)}>
                        Próximo
                    </Button>
                </div>
            </section>


            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-confirmacao">
                        <h3>Confirmar Exclusão</h3>
                        <p>Deseja realmente excluir este produto? Esta ação não pode ser desfeita.</p>
                        <div className="modal-buttons">
                            <Button
                                variant="secondary"
                                onClick={() => setShowModal(false)}
                            >
                                Cancelar
                            </Button>

                            <Button
                                variant="primary"
                                onClick={confirmarExclusao}
                            >
                                Sim, Excluir
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductList;
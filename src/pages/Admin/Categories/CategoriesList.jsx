import React, { useState, useEffect } from 'react';
import { Button } from '../../../componentes/Button/Button';
import { useNavigate } from 'react-router-dom';
import api, { getAllCategory } from '../../../Services/Api'; 
import { toast } from 'react-toastify';

import './CategoriesList.css';

export const Categorias = () => {
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // 1. Estados de Paginação (Padronizado com Produtos)
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [showModal, setShowModal] = useState(false);
    const [idParaDeletar, setIdParaDeletar] = useState(null);

    const navigate = useNavigate();

    // 2. Carga de dados observando a página atual
    const carregarCategorias = async (page = 1) => {
        try {
            setLoading(true);
            // Enviando page e size (6) para manter o padrão
            const response = await getAllCategory(page, 6); 
            
            // Ajuste aqui conforme o retorno do seu Back-end (data e totalPages)
            const { data, totalPages: total } = response.data;
            
            setCategorias(data || []);
            setTotalPages(total || 1);
        } catch (error) {
            console.error("Erro ao carregar categorias:", error);
            toast.error("Erro ao buscar categorias do servidor. 🍬", { theme: "colored" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarCategorias(currentPage);
    }, [currentPage]);

    const handleExcluir = (id) => {
        setIdParaDeletar(id);
        setShowModal(true);
    };

    const confirmarExclusao = async () => {
        const idToast = toast.loading("Removendo categoria...");
        try {
            await api.delete(`/categoria/excluir/${idParaDeletar}`);

            toast.update(idToast, {
                render: "Categoria removida com sucesso! ✨",
                type: "success",
                isLoading: false,
                autoClose: 2000,
                theme: "colored"
            });

            carregarCategorias(currentPage); 
        } catch (err) {
            const msgErro = err.response?.data?.message || 'Erro ao excluir categoria.';
            toast.update(idToast, {
                render: msgErro,
                type: "error",
                isLoading: false,
                autoClose: 3000,
                theme: "colored"
            });
        } finally {
            setShowModal(false);
            setIdParaDeletar(null);
        }
    };

    return (
        <div className="admin-page animate-entrance">
            <header className="admin-header">
                <div>
                    <h1>Categorias</h1>
                    <p>Gerencie as categorias de produtos do seu sistema</p>
                </div>
                <Button variant="primary" onClick={() => navigate('/admin/categorias/form')}>
                    + Nova Categoria
                </Button>
            </header>

            <section className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome da Categoria</th>
                            <th style={{ textAlign: 'right' }}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="3">Carregando categorias...</td></tr>
                        ) : categorias.length > 0 ? (
                            categorias.map(cat => (
                                <tr key={cat.id_category}>
                                    <td>#{cat.id_category}</td>
                                    <td>{cat.name_category}</td>
                                    <td style={{ textAlign: 'right' }}>
                                        <button
                                            className="btn-edit"
                                            onClick={() => navigate('/admin/categorias/form', { state: { categoria: cat } })}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className="btn-delete"
                                            onClick={() => handleExcluir(cat.id_category)}
                                        >
                                            Excluir
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="3" style={{ textAlign: 'center' }}>Nenhuma categoria encontrada.</td></tr>
                        )}
                    </tbody>
                </table>

                {/* 3. Controles de Paginação (Idêntico ao de Produtos) */}
                <div className="pagination-controls">
                    <Button 
                        variant="secondary" 
                        disabled={currentPage === 1} 
                        onClick={() => setCurrentPage(prev => prev - 1)}
                    >
                        Anterior
                    </Button>

                    <span>Página {currentPage} de {totalPages}</span>

                    <Button 
                        variant="secondary" 
                        disabled={currentPage === totalPages} 
                        onClick={() => setCurrentPage(prev => prev + 1)}
                    >
                        Próximo
                    </Button>
                </div>
            </section>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-confirmacao">
                        <h3>Confirmar Exclusão</h3>
                        <p>Deseja realmente excluir esta categoria? Esta ação não pode ser desfeita.</p>
                        <div className="modal-buttons">
                            <Button variant="secondary" onClick={() => setShowModal(false)}>
                                Cancelar
                            </Button>
                            <Button variant="primary" onClick={confirmarExclusao}>
                                Sim, Excluir
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
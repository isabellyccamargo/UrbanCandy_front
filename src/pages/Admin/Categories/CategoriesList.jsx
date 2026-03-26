import React, { useState, useEffect } from 'react';
import { Button } from '../../../componentes/Button/Button';
import { useNavigate } from 'react-router-dom';
import api, { getAllCategory } from '../../../Services/Api'; // Importe api e getAllCategory
import { toast } from 'react-toastify'; // Faltava este import

import './CategoriesList.css';

export const Categorias = () => {
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // 1. Estados para o Modal que faltavam
    const [showModal, setShowModal] = useState(false);
    const [idParaDeletar, setIdParaDeletar] = useState(null);
    
    const navigate = useNavigate();

    const carregarCategorias = async () => {
        try {
            setLoading(true);
            const response = await getAllCategory();
            setCategorias(response.data || []);
        } catch (error) {
            console.error("Erro ao carregar categorias:", error);
            toast.error("Erro ao buscar categorias do servidor. 🍬", { theme: "colored" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarCategorias();
    }, []);

    // 2. Função que abre o modal (chamada pelo botão da tabela)
    const handleExcluir = (id) => {
        setIdParaDeletar(id);
        setShowModal(true);
    };

    // 3. Função que deleta de fato (chamada pelo botão "Sim" do modal)
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

            carregarCategorias(); // Recarrega a lista após deletar
        } catch (err) {
            console.error("Erro na exclusão:", err);
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
                {loading ? (
                    <p style={{ padding: '20px' }}>Carregando categorias...</p>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nome da Categoria</th>
                                <th style={{ textAlign: 'right' }}>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categorias.length > 0 ? (
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
                                <tr>
                                    <td colSpan="3" style={{ textAlign: 'center' }}>
                                        Nenhuma categoria encontrada.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </section>

            {/* 4. JSX DO MODAL (Igual ao de produtos) */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-confirmacao">
                        <h3>Confirmar Exclusão</h3>
                        <p>Deseja realmente excluir esta categoria? Esta ação não pode ser desfeita.</p>
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
import React, { useState, useEffect } from 'react';
import { Button } from '../../../componentes/Button/Button';
import { useNavigate } from 'react-router-dom';
import { getAllCategory } from '../../../Services/Api';
import api from '../../../Services/Api';

import './CategoriesList.css';

export const Categorias = () => {
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const carregarCategorias = async () => {
        try {
            setLoading(true);
            const response = await getAllCategory();
            setCategorias(response.data || []);
        } catch (error) {
            console.error("Erro ao carregar categorias:", error);
            alert("Erro ao buscar categorias do servidor.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        carregarCategorias();
    }, []);

    const handleExcluir = async (id) => {
        if (window.confirm("Tem certeza que deseja excluir esta categoria?")) {
            try {
                await api.delete(`/categoria/excluir/${id}`);
                alert("Categoria excluída com sucesso!");
                carregarCategorias();
            } catch (error) {
                console.error("Erro ao excluir:", error);
                alert("Não foi possível excluir a categoria.");
            }
        }
    };

    return (
        <div className="admin-page">
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
                    <p>Carregando categorias...</p>
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
                                            <button className="btn-edit" onClick={() => navigate('/admin/categorias/form', { state: { categoria: cat } })}>
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
        </div>
    );
};
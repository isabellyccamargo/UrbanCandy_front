import React, { useState, useEffect } from 'react'; 
import { useNavigate, useLocation } from 'react-router-dom'; 
import api, { createCategory } from '../../../Services/Api'; 
import './CategoriesForm.css';

export const CategoriesForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    
    const categoriaParaEditar = location.state?.categoria;

    const [nameCategory, setNameCategory] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (categoriaParaEditar) {
            setNameCategory(categoriaParaEditar.name_category);
        }
    }, [categoriaParaEditar]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (categoriaParaEditar) {
                await api.put(`/categoria/atualizar/${categoriaParaEditar.id_category}`, { 
                    name_category: nameCategory 
                });
                alert('Categoria atualizada com sucesso!');
            } else {
                await createCategory({ name_category: nameCategory });
                alert('Categoria criada com sucesso!');
            }

            navigate('/admin/categorias');
        } catch (error) {
            console.error("Erro ao salvar:", error);
            alert(error.response?.data?.message || "Erro ao conectar com o servidor.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="category-form-container">
            <h1 className="form-title">
                {categoriaParaEditar ? 'Editar Categoria' : 'Nova Categoria'}
            </h1>
            <p className="form-subtitle">
                {categoriaParaEditar ? 'Altere o nome da categoria selecionada' : 'Preencha o nome da nova categoria para o sistema'}
            </p>

            <form onSubmit={handleSubmit} className="category-card-form">
                <div className="input-group">
                    <label>Nome da Categoria</label>
                    <input
                        type="text"
                        placeholder="Ex: Brigadeiros, Cookies..."
                        value={nameCategory}
                        onChange={(e) => setNameCategory(e.target.value)}
                        required
                        autoFocus
                    />
                </div>

                <div className="form-actions">
                    <button
                        type="button"
                        className="btn-cancel"
                        onClick={() => navigate('/admin/categorias')}
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="btn-save"
                        disabled={loading}
                    >
                        {loading ? 'Salvando...' : (categoriaParaEditar ? 'Salvar Alterações' : 'Salvar')}
                    </button>
                </div>
            </form>
        </div>
    );
};
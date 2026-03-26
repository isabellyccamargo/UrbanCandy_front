import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api, { createCategory } from '../../../Services/Api';
import { toast } from 'react-toastify';
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

        if (!nameCategory.trim()) {
            toast.warning("O nome da categoria é obrigatório! ✍️", { theme: "colored" });
            return;
        }

        setLoading(true);
        const idToast = toast.loading(categoriaParaEditar ? "Atualizando categoria..." : "Criando categoria...");

        try {
            if (categoriaParaEditar) {
                await api.put(`/categoria/atualizar/${categoriaParaEditar.id_category}`, {
                    name_category: nameCategory
                });

                toast.update(idToast, {
                    render: "Categoria atualizada com sucesso! ✨",
                    type: "success",
                    isLoading: false,
                    autoClose: 2000,
                    theme: "colored"
                });
            } else {
                await createCategory({ name_category: nameCategory });

                toast.update(idToast, {
                    render: "Categoria criada com sucesso! 🍫",
                    type: "success",
                    isLoading: false,
                    autoClose: 2000,
                    theme: "colored"
                });
            }

            // Delay para o usuário ler a mensagem antes de sair da tela
            setTimeout(() => {
                navigate('/admin/categorias');
            }, 1500);

        } catch (error) {
            console.error("Erro ao salvar:", error);

            let msgErro = "Erro ao conectar com o servidor.";

            if (error.response) {
                const { status, data } = error.response;

                // Se for o erro de duplicidade (mesmo vindo em HTML)
                if (status === 409 || (typeof data === 'string' && data.includes("CATEGORY_ALREADY_EXISTS"))) {
                    msgErro = "Essa categoria já existe! Escolha outro nome. 🍫";
                }
                else if (data && data.message) {
                    msgErro = data.message;
                }
            }

            // Transforma o loading em erro
            toast.update(idToast, {
                render: msgErro,
                type: "error",
                isLoading: false,
                autoClose: 3000,
                theme: "colored"
            });
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
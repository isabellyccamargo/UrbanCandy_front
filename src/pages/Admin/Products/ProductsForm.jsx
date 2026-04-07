import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAllCategory, createProduct, updateProduct } from '../../../Services/Api';
import './ProductsForm.css';
import { Button } from '../../../componentes/Button/Button';
import { toast } from 'react-toastify'; // Importação do Toast

const ProductsForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const produtoParaEditar = location.state?.produto;

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [idCategory, setIdCategory] = useState('');
    const [description, setDescription] = useState('');
    const [featured, setFeatured] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState(null);

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const res = await getAllCategory();
                const data = res.data?.data || res.data || res;

                if (Array.isArray(data)) {
                    setCategories(data);
                } else {
                    console.error("A API não retornou um array:", data);
                    setCategories([]);
                }
            } catch (error) {
                console.error(error);
                toast.error("Erro ao carregar categorias.");
                setCategories([]);
            }
        };
        loadCategories();


        if (produtoParaEditar) {
            setName(produtoParaEditar.name);
            setPrice(produtoParaEditar.price);
            setIdCategory(produtoParaEditar.id_category);
            setDescription(produtoParaEditar.description || '');
            setFeatured(produtoParaEditar.featured || false);
            setPreview(`http://localhost:3030/uploads/${produtoParaEditar.image}`);
        }
    }, [produtoParaEditar]);

    const handleFile = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', Math.max(0, parseFloat(price)));
        formData.append('id_category', idCategory);
        formData.append('description', description);
        formData.append('featured', featured);

        if (imageFile) formData.append('image', imageFile);

        try {
            if (produtoParaEditar) {
                await updateProduct(produtoParaEditar.id_product, formData);
                toast.success("Produto atualizado com sucesso! 🍫", { theme: "colored" });
            } else {
                await createProduct(formData);
                toast.success("Produto salvo com sucesso! ✨", { theme: "colored" });
            }
            navigate('/admin/produtos');
        } catch (err) {
            const msgErro = err.response?.data?.message || 'Erro ao salvar produto.';
            toast.error(msgErro, { theme: "colored" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="category-form-container">
            <h1 className="form-title">{produtoParaEditar ? 'Editar Doce' : 'Novo Doce'}</h1>
            <p className="form-subtitle">Cadastre as delícias da UrbanCandy no sistema</p>

            <form onSubmit={handleSubmit} className="category-card-form">
                <div className="product-layout-split">

                    {/* COLUNA DA ESQUERDA: CAMPOS TEXTUAIS */}
                    <div className="fields-column">
                        <div className="input-group">
                            <label>Nome do Produto</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                        </div>

                        <div className="input-group">
                            <label>Descrição Curta</label>
                            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required maxLength="255" />
                        </div>

                        <div className="input-row" style={{ display: 'flex', gap: '20px' }}>
                            <div className="input-group" style={{ flex: 1 }}>
                                <label>Preço (R$)</label>
                                <input type="number" step="0.01" min="0" value={price} onChange={(e) => setPrice(e.target.value)} required />
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Categoria</label>
                            <select className="custom-select" value={idCategory} onChange={(e) => setIdCategory(e.target.value)} required>
                                <option value="">Selecione...</option>
                                {categories.map(cat => (
                                    <option key={cat.id_category} value={cat.id_category}>{cat.name_category}</option>
                                ))}
                            </select>
                        </div>

                        <div className="featured-toggle-box" onClick={() => setFeatured(!featured)}>
                            <div className={`custom-check ${featured ? 'active' : ''}`}>
                                {featured && "✓"}
                            </div>
                            <span>Produto em Destaque na vitrine?</span>
                        </div>
                    </div>

                    {/* COLUNA DA DIREITA: IMAGEM */}
                    <div className="image-column">
                        <label>Imagem do Produto</label>
                        <div className="image-dropzone" onClick={() => document.getElementById('fileInput').click()}>
                            {preview ? (
                                <img src={preview} alt="Preview" className="img-preview-full" />
                            ) : (
                                <div className="upload-msg">
                                    <i>+</i>
                                    <p>Selecionar Foto</p>
                                </div>
                            )}
                            <input id="fileInput" type="file" onChange={handleFile} accept="image/*" style={{ display: 'none' }} />
                        </div>
                    </div>
                </div>

                <div className="form-actions" style={{ marginTop: '30px' }}>
                    <Button type="button" variant="secondary" onClick={() => navigate('/admin/produtos')}>
                        Cancelar
                    </Button>

                    <Button type="submit" variant="primary" disabled={loading}>
                        {loading ? 'Salvando...' : 'Salvar Produto'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ProductsForm;
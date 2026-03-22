import React, { useEffect, useState } from 'react';
import { getUserProfile, createUser, updateUser } from '../../Services/Api';
import { Button } from '../../componentes/Button/Button';
import './MyData.css';

const FormField = ({ label, name, value, onChange, type = "text", required, ...props }) => (
    <div className="form-group">
        <label>{label} {required && <span style={{ color: 'red' }}>*</span>}</label>
        <input name={name} type={type} value={value} onChange={onChange} required={required} {...props} />
    </div>
);

const MeusDados = ({ onOpenLogin }) => {
    const [formData, setFormData] = useState({
        name: '', email: '', cpf: '', telephone: '', password: '', confirmPassword: '',
        cep: '', city: '', neighborhood: '', road: '', number: '', complement: ''
    });

    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const handleCepBlur = async (e) => {
        const cep = e.target.value.replace(/\D/g, '');
        if (cep.length !== 8) return;
        try {
            const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await res.json();
            if (!data.erro) {
                setFormData(prev => ({
                    ...prev, road: data.logradouro || '', neighborhood: data.bairro || '', city: data.localidade || ''
                }));
            }
        } catch { console.error("Erro CEP"); }
    };

    useEffect(() => {
        (async () => {
            const storedUser = JSON.parse(localStorage.getItem('@UrbanCandy:user'));
            if (storedUser?.id_user) {
                try {
                    const res = await getUserProfile(storedUser.id_user);
                    if (res) {
                        const person = res.people || {};
                        const addr = person.address || person.Addresses?.[0] || {};
                        setFormData(prev => ({ ...prev, ...person, email: res.email, ...addr }));
                        setIsEditMode(true);
                    }
                } catch { setError("Erro ao carregar perfil."); }
            }
            setLoading(false);
        })();
    }, []);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const requiredFields = ['name', 'email', 'cpf', 'cep', 'city', 'road', 'number'];
        const emptyFields = requiredFields.filter(field => !formData[field]?.toString().trim());

        if (emptyFields.length > 0) {
            return setError(`Os seguintes campos são obrigatórios: ${emptyFields.join(', ')}`);
        }

        if (!isEditMode || formData.password) {
            if (formData.password !== formData.confirmPassword) {
                return setError("As senhas não coincidem.");
            }
        }

        const cleanData = {
            ...formData,
            cep: formData.cep.replace(/\D/g, ''),
            number: parseInt(formData.number, 10)
        };

        try {
            const id = JSON.parse(localStorage.getItem('user'))?.id_user;
            if (isEditMode) {
                await updateUser(id, { password: formData.password || undefined }, cleanData);
                alert("Perfil atualizado!");
            } else {
                await createUser(cleanData);
                alert("Cadastro realizado! Agora faça login para acessar sua conta.");

                if (onOpenLogin) {
                    onOpenLogin();
                }
            }
        } catch (err) {
            setError(err.response?.data?.mensagem || "Erro ao salvar. Verifique se os dados estão corretos.");
        }
    };

    if (loading) return <div className="loading">Carregando...</div>;

    return (
        <div className="meus-dados-container">
            <header className="header-perfil">
                <h1>{isEditMode ? 'Meus Dados' : 'Criar Conta'}</h1>
            </header>

            {error && <div className="error-banner">{error}</div>}

            <form onSubmit={handleSubmit} className="grid-form">
                <h2 className='section-title'>Dados Pessoais</h2>
                <div className="form-row triple-row">
                    <FormField label="Nome" name="name" value={formData.name} onChange={handleChange} required />
                    <FormField label="CPF" name="cpf" value={formData.cpf} onChange={handleChange} readOnly={isEditMode} required />
                    <FormField label="Telefone" name="telephone" value={formData.telephone} onChange={handleChange} />
                </div>

                <div className="form-row triple-row">
                    <FormField label="E-mail" name="email" value={formData.email} onChange={handleChange} readOnly={isEditMode} required />
                    {!isEditMode && (
                        <>
                            <div className="form-group">
                                <label>Senha <span style={{ color: 'red' }}>*</span></label>
                                <div className="input-container-simples">
                                    <input name="password" type={showPass ? "text" : "password"} value={formData.password} onChange={handleChange} className="input-com-botao" required />
                                    <span className="texto-mostrar" onClick={() => setShowPass(!showPass)}>
                                        {showPass ? "Ocultar" : "Mostrar"}
                                    </span>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Confirmar Senha <span style={{ color: 'red' }}>*</span></label>
                                <div className="input-container-simples">
                                    <input name="confirmPassword" type={showConfirm ? "text" : "password"} value={formData.confirmPassword} onChange={handleChange} className="input-com-botao" required />
                                    <span className="texto-mostrar" onClick={() => setShowConfirm(!showConfirm)}>
                                        {showConfirm ? "Ocultar" : "Mostrar"}
                                    </span>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <h2 className='section-title'>Endereço</h2>
                <div className="form-row address-main-row">
                    <FormField label="CEP" name="cep" value={formData.cep} onChange={handleChange} onBlur={handleCepBlur} required maxLength="9" />
                    <FormField label="Cidade" name="city" value={formData.city} onChange={handleChange} required />
                    <FormField label="Bairro" name="neighborhood" value={formData.neighborhood} onChange={handleChange} />
                </div>

                <div className="form-row address-street-row">
                    <FormField label="Rua" name="road" value={formData.road} onChange={handleChange} required className="street-field" />
                    <FormField label="Número" name="number" value={formData.number} onChange={handleChange} required type="number" />
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: '30px', maxHeight: '100px' }}>
                    <Button type="submit" variant="primary">
                        {isEditMode ? 'Salvar Alterações' : 'Finalizar Cadastro'}
                    </Button>
                </div>
            </form >
        </div >
    );
};

export default MeusDados;
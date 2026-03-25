import React, { useEffect, useState } from 'react';
import { getUserProfile, createUser, updateUser } from '../../Services/Api';
import { Button } from '../../componentes/Button/Button';


import './MyData.css';

const FormField = ({ label, name, value, onChange, type = "text", required, ...props }) => (
    <div className="form-group">
        <label>{label} {required && <span style={{ color: 'red' }}>*</span>}</label>
        <input name={name} type={type} value={value || ''} onChange={onChange} required={required} {...props} />
    </div>
);

const MeusDados = () => {
    const [formData, setFormData] = useState({
        name: '', email: '', cpf: '', telephone: '', password: '', confirmPassword: '',
        cep: '', city: '', neighborhood: '', road: '', number: '', complement: ''
    });

    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const applyCPFMask = (v) => v.replace(/\D/g, '').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2').slice(0, 14);
    const applyPhoneMask = (v) => v.replace(/\D/g, '').replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2').replace(/(-\d{4})\d+?$/, '$1').slice(0, 15);
    const applyCEPMask = (v) => v.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2').slice(0, 9);

    const handleChange = (e) => {
        const { name, value } = e.target;
        let maskedValue = value;
        if (name === 'cpf') maskedValue = applyCPFMask(value);
        if (name === 'telephone') maskedValue = applyPhoneMask(value);
        if (name === 'cep') maskedValue = applyCEPMask(value);
        setFormData(prev => ({ ...prev, [name]: maskedValue }));
    };

    const handleCepBlur = async (e) => {
        const cep = e.target.value.replace(/\D/g, '');
        if (cep.length !== 8) return;
        try {
            const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await res.json();
            if (!data.erro) {
                setFormData(prev => ({ ...prev, road: data.logradouro, neighborhood: data.bairro, city: data.localidade }));
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
                        setFormData({
                            ...formData,
                            ...person,
                            ...addr,
                            email: res.email,
                            cpf: person.cpf ? applyCPFMask(person.cpf) : '',
                            telephone: person.telephone ? applyPhoneMask(person.telephone) : '',
                            cep: addr.cep ? applyCEPMask(addr.cep) : ''
                        });
                        setIsEditMode(true);
                    }
                } catch { setError("Erro ao carregar perfil."); }
            }
            setLoading(false);
        })();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validação básica de confirmação de senha (opcional, mas recomendado)
        if (!isEditMode && formData.password !== formData.confirmPassword) {
            setError("As senhas não coincidem.");
            return;
        }

        const rawCpf = formData.cpf.replace(/\D/g, '');
        const rawPhone = formData.telephone.replace(/\D/g, '');
        const rawCep = formData.cep.replace(/\D/g, '');

        const payload = {
            name: formData.name,
            email: formData.email,
            cpf: rawCpf,
            telephone: rawPhone,
            password: formData.password,
            cep: rawCep,
            city: formData.city,
            neighborhood: formData.neighborhood,
            road: formData.road,
            number: formData.number,
            complement: formData.complement || ""
        };

        try {
            if (isEditMode) {
                const storedUser = JSON.parse(localStorage.getItem('@UrbanCandy:user'));
                await updateUser(
                    storedUser.id_user,
                    { email: formData.email, password: formData.password || undefined },
                    {
                        name: formData.name,
                        cpf: rawCpf,
                        telephone: rawPhone,
                        cep: rawCep,
                        city: formData.city,
                        neighborhood: formData.neighborhood,
                        road: formData.road,
                        number: formData.number,
                        complement: formData.complement
                    }
                );
                alert("Perfil atualizado com sucesso!");
            } else {
                // 1. Cria o usuário no backend
                await createUser(payload);

                // 2. Avisa o usuário
                alert("Cadastro realizado com sucesso! Redirecionando para o login...");

                // 3. O SEGREDO: Redireciona para a Home com o sinalizador na URL
                // Isso fará a página recarregar e o Header abrir o Modal
                window.location.href = '/?login=true';
            }
        } catch (err) {
            console.error("Erro no cadastro:", err);
            const msgErro = err.toString().includes('INVALID_PASSWORD')
                ? "Senha fraca! Use letras maiúsculas, números e símbolos."
                : (err.mensagem || "Erro ao salvar. Verifique se o e-mail ou CPF já existem.");
            setError(msgErro);
        }
    }

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
                    <FormField label="CPF" name="cpf" value={formData.cpf} onChange={handleChange} readOnly={isEditMode} required maxLength="14" />
                    <FormField label="Telefone" name="telephone" value={formData.telephone} onChange={handleChange} maxLength="15" />
                </div>

                <div className="form-row triple-row">
                    <FormField label="E-mail" name="email" value={formData.email} onChange={handleChange} readOnly={isEditMode} required />
                    {!isEditMode && (
                        <>
                            <div className="form-group">
                                <label>Senha <span style={{ color: 'red' }}>*</span></label>
                                <div className="input-container-simples">
                                    <input name="password" type={showPass ? "text" : "password"} value={formData.password} onChange={handleChange} className="input-com-botao" required />
                                    <span className="texto-mostrar" onClick={() => setShowPass(!showPass)}>{showPass ? "Ocultar" : "Mostrar"}</span>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Confirmar Senha <span style={{ color: 'red' }}>*</span></label>
                                <div className="input-container-simples">
                                    <input name="confirmPassword" type={showConfirm ? "text" : "password"} value={formData.confirmPassword} onChange={handleChange} className="input-com-botao" required />
                                    <span className="texto-mostrar" onClick={() => setShowConfirm(!showConfirm)}>{showConfirm ? "Ocultar" : "Mostrar"}</span>
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
                    <FormField label="Número" name="number" value={formData.number} onChange={handleChange} required />
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: '30px' }}>
                    <Button type="submit" variant="primary">
                        {isEditMode ? 'Salvar Alterações' : 'Finalizar Cadastro'}
                    </Button>
                </div>
            </form >
        </div >
    );
};

export default MeusDados;
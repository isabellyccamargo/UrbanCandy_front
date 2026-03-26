import React, { useEffect, useState } from 'react';
import { getUserProfile, createUser, updateUser, updateAddress } from '../../Services/Api';
import { Button } from '../../componentes/Button/Button';
import { toast } from 'react-toastify';
import { useAuth } from '../../Hooks/AuthContext';
import './MyData.css';

const FormField = ({ label, name, value, onChange, type = "text", required, ...props }) => (
    <div className="form-group">
        <label>{label} {required && <span style={{ color: 'red' }}>*</span>}</label>
        <input name={name} type={type} value={value || ''} onChange={onChange} required={required} {...props} />
    </div>
);

const MeusDados = () => {
    const { setUser } = useAuth();
    const [formData, setFormData] = useState({
        name: '', email: '', cpf: '', telephone: '', password: '', confirmPassword: '',
        cep: '', city: '', neighborhood: '', road: '', number: '', complement: ''
    });

    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

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
                toast.success("Endereço preenchido automaticamente! 📍");
            }
        } catch { console.error("Erro CEP"); }
    };

    useEffect(() => {
        const loadUserData = async () => {
            const storedUser = JSON.parse(localStorage.getItem('@UrbanCandy:user'));
            if (storedUser?.id_user) {
                try {
                    const res = await getUserProfile(storedUser.id_user);
                    if (res) {
                        const person = res.people || {};
                        const addr = person.address || person.Addresses?.[0] || {};
                        setFormData(prev => ({
                            ...prev,
                            id_people: person.id_people,
                            id_address: addr.id_address,
                            ...person,
                            ...addr,
                            email: res.email,
                            cpf: person.cpf ? applyCPFMask(person.cpf) : '',
                            telephone: person.telephone ? applyPhoneMask(person.telephone) : '',
                            cep: addr.cep ? applyCEPMask(addr.cep) : ''
                        }));
                        setIsEditMode(true);
                    }
                } catch {
                    toast.error("Não conseguimos carregar seus dados. 😟");
                }
            }
            setLoading(false);
        };
        loadUserData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        if (!isEditMode && formData.password !== formData.confirmPassword) {
            toast.warning("As senhas não coincidem! 🔑");
            setIsSaving(false);
            return;
        }

        const rawCpf = formData.cpf.replace(/\D/g, '');
        const rawPhone = formData.telephone.replace(/\D/g, '');
        const rawCep = formData.cep.replace(/\D/g, '');

        try {
            if (isEditMode) {
                // 1. Atualiza Usuário/Pessoa
                await updateUser(formData.id_people, {
                    password: formData.password || undefined,
                    name: formData.name,
                    cpf: rawCpf,
                    telephone: rawPhone
                });

                // 2. Atualiza Endereço
                await updateAddress(formData.id_address, {
                    road: formData.road,
                    number: parseInt(formData.number, 10),
                    neighborhood: formData.neighborhood,
                    city: formData.city,
                    cep: rawCep,
                    complement: formData.complement
                });

                // 3. Atualiza Estado Global e LocalStorage (para o Header mudar na hora)
                const storedUser = JSON.parse(localStorage.getItem('@UrbanCandy:user'));
                const updatedUserData = { ...storedUser, name: formData.name };
                
                setUser(updatedUserData);
                localStorage.setItem('@UrbanCandy:user', JSON.stringify(updatedUserData));

                toast.success("Dados atualizados com sucesso! ✨");

            } else {
                const payload = { ...formData, cpf: rawCpf, telephone: rawPhone, cep: rawCep };
                await createUser(payload);
                toast.success("Bem-vindo(a) à Urban Candy! 🍬");
                setTimeout(() => window.location.href = '/?login=true', 2000);
            }
        } catch (err) {
            console.error(err);
            toast.error(isEditMode ? "Erro ao atualizar dados." : "Verifique seus dados.");
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) return <div className="loading-container"><p>Carregando seus dados... 🍫</p></div>;

    return (
        <div className="meus-dados-container">
            <header className="header-perfil">
                <h1>{isEditMode ? 'Meus Dados' : 'Criar Conta'}</h1>
            </header>

            <form onSubmit={handleSubmit} className="grid-form">
                <h2 className='section-title'>Dados Pessoais</h2>
                <div className="form-row triple-row">
                    <FormField label="Nome" name="name" value={formData.name} onChange={handleChange} required />
                    <FormField label="CPF" name="cpf" value={formData.cpf} onChange={handleChange} readOnly={isEditMode} required maxLength="14" style={isEditMode ? { backgroundColor: '#f0f0f0', cursor: 'not-allowed' } : {}} />
                    <FormField label="Telefone" name="telephone" value={formData.telephone} onChange={handleChange} maxLength="15" />
                </div>

                <div className="form-row triple-row">
                    <FormField label="E-mail" name="email" value={formData.email} onChange={handleChange} readOnly={isEditMode} required style={isEditMode ? { backgroundColor: '#f0f0f0', cursor: 'not-allowed' } : {}} />
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
                    <Button type="submit" variant="primary" disabled={isSaving}>
                        {isSaving ? 'Salvando...' : (isEditMode ? 'Salvar Alterações' : 'Finalizar Cadastro')}
                    </Button>
                </div>
            </form >
        </div >
    );
};

export default MeusDados;
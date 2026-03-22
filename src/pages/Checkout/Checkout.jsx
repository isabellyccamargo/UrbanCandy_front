import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../Hooks/UseCart';
import { createOrder, getUserProfile } from '../../Services/Api';
import { Button } from '../../componentes/Button/Button';
import './Checkout.css';

const Checkout = () => {
    const navigate = useNavigate();
    const { cart, clearCart, } = useCart();
    const [paymentMethod, setPaymentMethod] = useState('');
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUserData = async () => {
            const storedUser = JSON.parse(localStorage.getItem('@UrbanCandy:user') || localStorage.getItem('user'));

            if (!storedUser || !storedUser.id_user) {
                navigate('/');
                return;
            }

            try {
                const res = await getUserProfile(storedUser.id_user);
                if (res) {
                    const person = res.people || {};
                    const addr = person.address || person.Addresses?.[0] || {};

                    setUserData({
                        ...person,
                        email: res.email,
                        addressFull: `${addr.road || ''}, ${addr.number || ''} - ${addr.neighborhood || ''}`,
                        cityState: `${addr.city || ''} / ${addr.neighborhood || ''}`
                    });
                }
            } catch (error) {
                console.error("Erro ao carregar dados do checkout:", error);
            } finally {
                setLoading(false);
            }
        };

        loadUserData();
    }, [navigate]);

    if (loading) return <div className="loading">Carregando dados do pedido...</div>;
    if (!userData) return null;

    const handleFinalizeOrder = async () => {
        if (!paymentMethod) {
            alert("Por favor, selecione uma forma de pagamento antes de finalizar.");
            return;
        }

        try {
            const orderPayload = {
                id_people: userData.id_user || userData.id_people,
                cart: cart,
                type_payment: paymentMethod
            };

            await createOrder(orderPayload);
            alert("Pedido realizado com sucesso!");
            clearCart();
            navigate('/');
        } catch (error) {
            alert(error.mensagem || "Erro ao finalizar pedido");
        }
    };
    return (
        <div className="checkout-container">
            <div className="checkout-content">
                <section className="checkout-section">
                    <h3>Dados Pessoais</h3>
                    <p><strong>Nome:</strong> {userData.name}</p>
                    <p><strong>CPF:</strong> {userData.cpf}</p>
                    <p><strong>Telefone:</strong> {userData.telephone || userData.phone}</p>
                    <p><strong>E-mail:</strong> {userData.email}</p>
                </section>

                <section className="checkout-section">
                    <h3>Entrega</h3>
                    <p>{userData.addressFull || "Endereço não localizado"}</p>
                    <p>{userData.cityState}</p>
                </section>

                <section className="checkout-section">
                    <h3>Pagamento</h3>
                    <div className="payment-options">
                        {['PIX', 'Cartão de Crédito', 'Boleto Bancário'].map(method => (
                            <label key={method} className="radio-label">
                                <input
                                    type="radio"
                                    name="payment"
                                    checked={paymentMethod === method}
                                    onChange={() => setPaymentMethod(method)}
                                />
                                {method}
                            </label>
                        ))}
                    </div>
                </section>
            </div>

            <aside className="checkout-summary">
                <h2>Resumo do pedido</h2>
                <div className="summary-items">
                    {cart.items.map(item => (
                        <div key={item.id_product} className="summary-item">
                            <img src={`http://localhost:3030/uploads/${item.products?.image}`} alt={item.products?.name} />
                            <div>
                                <p>{item.quantity} x {item.products?.name}</p>
                                <span>R$ {Number(item.products?.price).toFixed(2)}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="total-box">
                    <p>Total: <strong>R$ {cart.total.toFixed(2)}</strong></p>
                </div>
                <Button onClick={handleFinalizeOrder} variant="primary" disabled={!paymentMethod} >
                    Finalizar Pedido
                </Button>
            </aside>
        </div>
    );
};

export default Checkout;
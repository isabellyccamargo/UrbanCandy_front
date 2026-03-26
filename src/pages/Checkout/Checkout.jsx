import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../Hooks/UseCart';
import { createOrder, getUserProfile } from '../../Services/Api';
import { Button } from '../../componentes/Button/Button';
import { toast } from 'react-toastify';
import './Checkout.css';

const Checkout = () => {
    const navigate = useNavigate();
    const { cart, clearCart } = useCart();
    const [paymentMethod, setPaymentMethod] = useState('');
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const loadUserData = async () => {
            const storedUser = JSON.parse(localStorage.getItem('@UrbanCandy:user') || localStorage.getItem('user'));

            if (!storedUser || !storedUser.id_user) {
                toast.info("Por favor, faça login para finalizar seu pedido. 🍬");
                navigate('/login');
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
                        addressFull: addr.road ? `${addr.road}, ${addr.number || 'S/N'} - ${addr.neighborhood || ''}` : "Endereço incompleto",
                        cityState: `${addr.city || ''} / ${addr.state || ''}`
                    });
                }
            } catch (error) {
                console.error("Erro ao carregar dados do checkout:", error);
                toast.error("Não conseguimos carregar seus dados. Verifique sua conexão. 🌐");
            } finally {
                setLoading(false);
            }
        };

        loadUserData();
    }, [navigate]);

    const handleFinalizeOrder = async () => {
        if (!paymentMethod) {
            toast.warning("Selecione uma forma de pagamento para continuar! 💳");
            return;
        }

        try {
            setIsSubmitting(true);

            const orderPayload = {
                id_people: userData.id_people,
                type_payment: paymentMethod,
                cart: {
                    total: cart.total,
                    items: cart.items.map(item => ({
                        id_product: item.id_product,
                        quantity: item.quantity,
                        sub_total: item.sub_total || (item.quantity * Number(item.products?.price))
                    }))
                }
            };

            await createOrder(orderPayload);

            toast.success("Pedido realizado com sucesso! ✨", { icon: "🎉" });

            clearCart();
            navigate('/perfil');
        } catch (error) {
            const msg = error.response?.data?.message || "Erro ao finalizar pedido.";
            toast.error(msg);
            console.error("Detalhes do erro 400:", error.response?.data);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="loading">Carregando dados do pedido...</div>;
    if (!userData) return null;

    return (
        <div className="checkout-container animate-entrance">
            <div className="checkout-content">
                <section className="checkout-section card-candy">
                    <h3><i className="fas fa-user"></i> Dados Pessoais</h3>
                    <div className="info-grid">
                        <p><strong>Nome:</strong> {userData.name}</p>
                        <p><strong>CPF:</strong> {userData.cpf}</p>
                        <p><strong>Telefone:</strong> {userData.telephone || userData.phone}</p>
                        <p><strong>E-mail:</strong> {userData.email}</p>
                    </div>
                </section>

                <section className="checkout-section card-candy">
                    <h3><i className="fas fa-truck"></i> Entrega</h3>
                    <p className="address-text">{userData.addressFull}</p>
                    <p className="city-text">{userData.cityState}</p>
                </section>

                <section className="checkout-section card-candy">
                    <h3><i className="fas fa-credit-card"></i> Pagamento</h3>
                    <div className="payment-options">
                        {['PIX', 'Cartão de Crédito', 'Boleto Bancário'].map(method => (
                            <label key={method} className={`radio-label ${paymentMethod === method ? 'selected' : ''}`}>
                                <input
                                    type="radio"
                                    name="payment"
                                    checked={paymentMethod === method}
                                    onChange={() => setPaymentMethod(method)}
                                />
                                <span>{method}</span>
                            </label>
                        ))}
                    </div>
                </section>
            </div>

            <aside className="checkout-summary card-candy">
                <h2>Resumo do pedido</h2>
                <div className="summary-items">
                    {cart.items.map(item => (
                        <div key={item.id_product} className="summary-item">
                            <img
                                src={`http://localhost:3030/uploads/${item.products?.image}`}
                                alt={item.products?.name}
                                onError={(e) => e.target.src = 'https://via.placeholder.com/50'}
                            />
                            <div className="item-details">
                                <p>{item.quantity}x {item.products?.name}</p>
                                <span>R$ {(Number(item.products?.price) * item.quantity).toFixed(2)}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="total-box">
                    <span>Total a pagar</span>
                    <strong>R$ {cart.total.toFixed(2)}</strong>
                </div>

                <Button
                    onClick={handleFinalizeOrder}
                    variant="primary"
                    disabled={!paymentMethod || isSubmitting}
                >
                    {isSubmitting ? 'Processando...' : 'Finalizar Pedido'}
                </Button>
            </aside>
        </div>
    );
};

export default Checkout;
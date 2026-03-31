import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../Hooks/UseCart';
import { createOrder, getUserProfile, getAllTypeOfPayment } from '../../Services/Api';
import { Button } from '../../componentes/Button/Button';
import { toast } from 'react-toastify';
import { useAuth } from '../../Hooks/AuthContext';
import './Checkout.css';

const Checkout = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { cart, clearCart } = useCart();

    const [paymentMethod, setPaymentMethod] = useState('');
    const [paymentOptions, setPaymentOptions] = useState([]);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [showSuccessModal, setShowSuccessModal] = useState(false);

    useEffect(() => {
        const loadInitialData = async () => {
            if (!user || !user.id_user) {
                toast.info("Por favor, faça login para finalizar seu pedido. 🍬");
                navigate('/');
                return;
            }

            try {
                const [resProfile, resPayments] = await Promise.all([
                    getUserProfile(user.id_user),
                    getAllTypeOfPayment()
                ]);

                if (resProfile) {
                    const person = resProfile.people || {};
                    const addr = person.address || person.Addresses?.[0] || {};
                    setUserData({
                        ...person,
                        email: resProfile.email,
                        addressFull: addr.road ? `${addr.road}, ${addr.number || 'S/N'} - ${addr.neighborhood || ''}` : "Endereço incompleto",
                        cityState: `${addr.city || ''} / ${addr.state || ''}`
                    });
                }

                const paymentsArray = resPayments.data?.data || resPayments.data || [];
                setPaymentOptions(Array.isArray(paymentsArray) ? paymentsArray : []);

            } catch (error) {
                console.error("Erro ao carregar dados do checkout:", error);
                setPaymentOptions([]);
                toast.error("Não conseguimos carregar os dados necessários. 🌐");
            } finally {
                setLoading(false);
            }
        };

        loadInitialData();
    }, [user, navigate]);

    const handleFinalizeOrder = async () => {
        if (!paymentMethod) {
            toast.warning("Selecione uma forma de pagamento! 💳");
            return;
        }

        try {
            setIsSubmitting(true);

            const orderPayload = {
                id_people: Number(userData.id_people),
                id_payment: Number(paymentMethod),
                cart: {
                    total: Number(cart.total),
                    items: cart.items.map(item => ({
                        id_product: Number(item.id_product),
                        quantity: Number(item.quantity),
                        sub_total: Number(item.sub_total || (item.quantity * Number(item.products?.price))),
                        products: {
                            price: Number(item.products?.price),
                            name: item.products?.name
                        }
                    }))
                }
            };

            console.log("Payload Final:", orderPayload);

            await createOrder(orderPayload);

            clearCart();
            setShowSuccessModal(true);

        } catch (error) {
            console.error("Erro no Servidor:", error.response?.data);
            toast.error("Erro ao processar no banco de dados. Verifique os campos.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false);
        navigate('/pedidos');
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
                        {/* MAPEANDO PAGAMENTOS DO BANCO */}
                        {paymentOptions.map(option => (
                            <label key={option.id_payment} className={`radio-label ${paymentMethod === option.id_payment ? 'selected' : ''}`}>
                                <input
                                    type="radio"
                                    name="payment"
                                    // IMPORTANTE: Agora comparamos e salvamos pelo ID (número)
                                    checked={paymentMethod === option.id_payment}
                                    onChange={() => setPaymentMethod(option.id_payment)}
                                />
                                <span>{option.name_payment}</span>
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

            {/* MODAL DE SUCESSO - PADRÃO IGUAL AO DE EXCLUSÃO */}
            {showSuccessModal && (
                <div className="modal-overlay">
                    <div className="modal-confirmacao success-modal">
                        <div className="success-icon">🎉</div>
                        <h3>Pedido Confirmado!</h3>
                        <p>Obrigada pela preferência!</p>
                        <p>Seu pedido entrará em produção o quanto antes e assim que sair para entrega entramos em contato.</p>

                        <div className="modal-buttons">
                            <Button
                                variant="primary"
                                onClick={handleCloseSuccessModal}
                            >
                                Entendido, ver meus pedidos
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Checkout;
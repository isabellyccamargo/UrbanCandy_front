import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../Hooks/UseCart';
import { createOrder, getUserProfile, getAllTypeOfPayment } from '../../Services/Api';
import { Button } from '../../componentes/Button/Button';
import { toast } from 'react-toastify';
import { useAuth } from '../../Hooks/AuthContext';
import './Checkout.css';

/** * @typedef {import('../../types/order').IOrderCheckout} IOrderCheckout 
 * Vinculando ao seu arquivo de tipos globais do Frontend
 */

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
            const userId = user?.id_people || user?.id_user || user?.id;

            if (!userId) {
                toast.info("Por favor, faça login para finalizar seu pedido. 🍬");
                navigate('/');
                return;
            }

            try {
                const [resProfile, resPayments] = await Promise.all([
                    getUserProfile(userId),
                    getAllTypeOfPayment()
                ]);

                if (resProfile) {
                    const person = resProfile.people || resProfile; 
                    const addr = person.address || person.Addresses?.[0] || {};
                    
                    setUserData({
                        ...person,
                        id_people: person.id_people || userId, 
                        email: resProfile.email || person.email,
                        addressFull: addr.road ? `${addr.road}, ${addr.number || 'S/N'} - ${addr.neighborhood || ''}` : "Endereço não cadastrado",
                        cityState: addr.city ? `${addr.city} / ${addr.state}` : "Cidade/Estado não informados"
                    });
                }

                const paymentsArray = resPayments.data?.data || resPayments.data || [];
                setPaymentOptions(Array.isArray(paymentsArray) ? paymentsArray : []);

            } catch (error) {
                console.error("Erro ao carregar dados do checkout:", error);
                toast.error("Erro ao carregar dados necessários para o checkout. 🌐");
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

        if (cart.items.length === 0) {
            toast.error("Seu carrinho está vazio!");
            return;
        }

        try {
            setIsSubmitting(true);

            /** @type {IOrderCheckout} */
            const orderPayload = {
                id_people: Number(userData.id_people),
                id_payment: Number(paymentMethod),
                cart: {
                    total: Number(cart.total),
                    items: cart.items.map(item => {
                        const unitPrice = Number(item.products?.price || 0);
                        const qty = Number(item.quantity || 1);
                        
                        return {
                            id_product: Number(item.id_product),
                            quantity: qty,
                            sub_total: Number(item.sub_total || (unitPrice * qty)),
                            products: {
                                price: unitPrice,
                                name: item.products?.name || "Produto"
                            }
                        };
                    })
                }
            };

            console.log("Enviando Pedido:", orderPayload);

            await createOrder(orderPayload);

            clearCart();
            setShowSuccessModal(true);

        } catch (error) {
            const errorMsg = error.response?.data?.message || "Erro ao processar pedido.";
            console.error("Erro no Servidor:", error.response?.data);
            toast.error(`Falha no checkout: ${errorMsg}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCloseSuccessModal = () => {
        setShowSuccessModal(false);
        navigate('/pedidos');
    };

    if (loading) return <div className="loading-screen">Carregando dados do pedido... 🍬</div>;
    if (!userData) return null;

    return (
        <div className="checkout-container animate-entrance">
            <div className="checkout-content">
                <section className="checkout-section card-candy">
                    <h3><i className="fas fa-user"></i> Dados Pessoais</h3>
                    <div className="info-grid">
                        <p><strong>Nome:</strong> {userData.name}</p>
                        <p><strong>CPF:</strong> {userData.cpf || 'Não informado'}</p>
                        <p><strong>Telefone:</strong> {userData.telephone || userData.phone || '---'}</p>
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
                        {paymentOptions.length > 0 ? (
                            paymentOptions.map(option => (
                                <label key={option.id_payment} className={`radio-label ${paymentMethod === option.id_payment ? 'selected' : ''}`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        checked={paymentMethod === option.id_payment}
                                        onChange={() => setPaymentMethod(option.id_payment)}
                                    />
                                    <span>{option.name_payment}</span>
                                </label>
                            ))
                        ) : (
                            <p>Nenhuma forma de pagamento disponível.</p>
                        )}
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
                                onError={(e) => { e.target.src = 'https://via.placeholder.com/50'; }}
                            />
                            <div className="item-details">
                                <p>{item.quantity}x {item.products?.name}</p>
                                <span>{(Number(item.products?.price || 0) * item.quantity).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="total-box">
                    <span>Total a pagar</span>
                    <strong>{Number(cart.total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
                </div>

                <Button
                    onClick={handleFinalizeOrder}
                    variant="primary"
                    disabled={!paymentMethod || isSubmitting || cart.items.length === 0}
                >
                    {isSubmitting ? 'Processando...' : 'Finalizar Pedido'}
                </Button>
            </aside>

            {showSuccessModal && (
                <div className="modal-overlay">
                    <div className="modal-confirmacao success-modal">
                        <div className="success-icon">🎉</div>
                        <h3>Pedido Confirmado!</h3>
                        <p>Obrigada pela preferência!</p>
                        <p>Seu pedido entrará em produção em breve.</p>

                        <div className="modal-buttons">
                            <Button variant="primary" onClick={handleCloseSuccessModal}>
                                Ver meus pedidos
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Checkout;
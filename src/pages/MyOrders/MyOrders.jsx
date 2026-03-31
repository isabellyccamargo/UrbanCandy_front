import React, { useEffect, useState } from 'react';
import { getMyOrders } from '../../Services/Api';
import { Button } from '../../componentes/Button/Button';
import { toast } from 'react-toastify';
import './MyOrders.css';

/** * @typedef {import('../../@OrderTypes/').Order} Order 
 * Importando o tipo global via JSDoc para garantir consistência com o Back-end
 */

export const MyOrders = () => {
    /** @type {[Order[], React.Dispatch<React.SetStateAction<Order[]>>]} */
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const loadOrders = async (page = 1) => {
        try {
            setLoading(true);
            const storedUser = JSON.parse(localStorage.getItem('@UrbanCandy:user'));
            const personId = storedUser?.id_people || storedUser?.id_user || storedUser?.id;

            if (!personId) {
                toast.error("Sessão expirada. Por favor, faça login novamente.");
                return;
            }

            // Chamada para o Service passando o ID correto
            const response = await getMyOrders(personId, page, 5);

            const { data, totalPages: total } = response.data;

            setOrders(data || []);
            setTotalPages(total || 1);
        } catch (error) {
            console.error("Erro ao buscar pedidos:", error);
            toast.error("Não foi possível carregar seu histórico de pedidos.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders(currentPage);
    }, [currentPage]);

    return (
        <div className="orders-page animate-entrance">
            <header className="orders-header">
                <h1>Meus Pedidos</h1>
                <p>Acompanhe o histórico das suas delícias</p>
            </header>

            <section className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Pedido</th>
                            <th>Data</th>
                            <th>Qtd Itens</th>
                            <th>Total</th>
                            <th>Pagamento</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>Carregando...</td></tr>
                        ) : orders.length > 0 ? (
                            orders.map((order) => (
                                <tr key={order.id_orders}>
                                    <td data-label="Pedido"><strong>#{order.id_orders}</strong></td>
                                    <td data-label="Data">
                                        {order.order_date ? new Date(order.order_date).toLocaleDateString('pt-BR') : '---'}
                                    </td>
                                    <td data-label="Produtos">
                                        {(order.items || []).reduce((acc, item) => acc + (Number(item.quantity) || 0), 0)} itens
                                    </td>
                                    <td data-label="Total">
                                        <strong className="order-total-value">
                                            {Number(order.total || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                        </strong>
                                    </td>
                                    <td data-label="Pagamento">
                                        <span className="payment-badge">
                                            {order.paymentType?.name_payment || 'Padrão'}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>
                                    Você ainda não realizou nenhum pedido. ✨
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <div className="pagination-controls">
                    <Button
                        variant="secondary"
                        disabled={currentPage === 1 || loading}
                        onClick={() => {
                            console.log("Indo para página anterior");
                            setCurrentPage(prev => Math.max(prev - 1, 1));
                        }}
                    >
                        Anterior
                    </Button>

                    <span className="page-info">
                        Página <strong>{currentPage}</strong> de {totalPages || 1}
                    </span>

                    <Button
                        variant="secondary"
                        disabled={currentPage === totalPages || loading || totalPages === 0}
                        onClick={() => {
                            console.log("Indo para próxima página");
                            setCurrentPage(prev => prev + 1);
                        }}
                    >
                        Próximo
                    </Button>
                </div>
            </section >
        </div >
    );
};
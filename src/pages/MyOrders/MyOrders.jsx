import React, { useEffect, useState } from 'react';
import { getMyOrders } from '../../Services/Api';
import { Button } from '../../componentes/Button/Button';
import { toast } from 'react-toastify';
import './MyOrders.css';

export const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const loadOrders = async (page = 1) => {
        try {
            setLoading(true);
            const response = await getMyOrders(page, 5);

            setOrders(response.data.data || []);
            setTotalPages(response.data.totalPages || 1);

        } catch (error) {
            console.error("Erro ao buscar pedidos:", error);
            toast.error("Não foi possível carregar seus pedidos.");
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
                            <th>Produtos</th>
                            <th>Total</th>
                            <th>Forma de Pagamento</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="5">Carregando...</td></tr>
                        ) : orders && orders.length > 0 ? (
                            orders.map((order) => (
                                <tr key={order.id_orders}>
                                    <td data-label="Pedido"><strong>#{order.id_orders}</strong></td>
                                    <td data-label="Data">{new Date(order.order_date).toLocaleDateString('pt-BR')}</td>
                                    <td data-label="Produtos">
                                        {order.items ? order.items.reduce((acc, item) => acc + item.quantity, 0) : 0} itens
                                    </td>
                                    <td data-label="Total">
                                        <strong>
                                            {Number(order.total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                        </strong>
                                    </td>
                                    <td data-label="Pagamento">{order.type_payment}</td>
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

                {/* Paginação */}
                {totalPages > 1 && (
                    <div className="pagination-controls">
                        <Button
                            variant="secondary"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                        >
                            Anterior
                        </Button>

                        <span>Página {currentPage} de {totalPages}</span>

                        <Button
                            variant="secondary"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                        >
                            Próximo
                        </Button>
                    </div>
                )}
            </section>
        </div>
    );
};
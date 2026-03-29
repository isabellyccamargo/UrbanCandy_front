import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllTypeOfPayment, deleteTypeOfPayment } from "../../../Services/Api";
import { Button } from "../../../componentes/Button/Button";
import { toast } from "react-toastify";

import "./TypeOfPaymentList.css";

export const TypeOfPaymentList = () => {
    const [paymentTypes, setPaymentTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [showModal, setShowModal] = useState(false);
    const [idParaDeletar, setIdParaDeletar] = useState(null);

    const navigate = useNavigate();

    const loadPaymentTypes = async (page = 1) => {
        try {
            setLoading(true);
            const res = await getAllTypeOfPayment(page, 6);
            const lista = res.data || res; 
            setPaymentTypes(Array.isArray(lista) ? lista : (lista.data || []));
            if (res.data && res.data.totalPages) {
                setTotalPages(res.data.totalPages);
            }
            
        } catch (error) {
            console.error("Erro ao carregar pagamentos:", error);
            toast.error("Erro ao buscar tipos de pagamento", { theme: "colored" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPaymentTypes(currentPage);
    }, [currentPage]);

    const handleExcluir = (id) => {
        setIdParaDeletar(id);
        setShowModal(true);
    };

    const confirmDelete = async () => {
        const toastId = toast.loading("Removendo tipo de pagamento...");

        try {
            await deleteTypeOfPayment(idParaDeletar);

            toast.update(toastId, {
                render: "Tipo de pagamento removido! ✨",
                type: "success",
                isLoading: false,
                autoClose: 2000,
                theme: "colored"
            });

            loadPaymentTypes(currentPage);
        } catch {
            toast.update(toastId, {
                render: "Erro ao remover tipo de pagamento",
                type: "error",
                isLoading: false,
                autoClose: 3000,
                theme: "colored"
            });
        } finally {
            setShowModal(false);
            setIdParaDeletar(null);
        }
    };

    return (
        <div className="admin-page animate-entrance">
            <header className="admin-header">
                <div>
                    <h1>Tipos de Pagamento</h1>
                    <p>Gerencie as formas de recebimento da UrbanCandy</p>
                </div>
                <Button variant="primary" onClick={() => navigate("/admin/tipos-pagamento/form")}>
                    + Novo Tipo
                </Button>
            </header>

            <section className="admin-table-container">
                {loading ? (
                    <div className="loading-state">
                        <p>Carregando formas de pagamento...</p>
                    </div>
                ) : (
                    <>
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nome do Método</th>
                                    <th style={{ textAlign: 'right' }}>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paymentTypes.length > 0 ? (
                                    paymentTypes.map(type => (
                                        <tr key={type.id_payment}>
                                            <td><strong>#{type.id_payment}</strong></td>
                                            <td>{type.name_payment}</td>
                                            <td style={{ textAlign: 'right' }}>
                                                <button
                                                    className="btn-edit"
                                                    title="Editar"
                                                    onClick={() =>
                                                        navigate("/admin/tipos-pagamento/form", {
                                                            state: { paymentType: type }
                                                        })
                                                    }
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    className="btn-delete"
                                                    title="Excluir"
                                                    onClick={() => handleExcluir(type.id_payment)}
                                                >
                                                    Excluir
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" style={{ textAlign: 'center', padding: '30px' }}>
                                            Nenhum tipo de pagamento encontrado.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        {/* ADICIONADO: Controles de Paginação igual a Categorias/Produtos */}
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
                    </>
                )}
            </section>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-confirmacao">
                        <div className="modal-icon">⚠️</div>
                        <h3>Confirmar Exclusão</h3>
                        <p>Deseja realmente excluir este tipo de pagamento?</p>
                        <small>Esta ação não pode ser desfeita e pode afetar pedidos antigos.</small>
                        
                        <div className="modal-buttons">
                            <Button
                                variant="secondary"
                                onClick={() => setShowModal(false)}
                            >
                                Cancelar
                            </Button>

                            <Button
                                variant="primary"
                                onClick={confirmDelete}
                            >
                                Sim, Excluir
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
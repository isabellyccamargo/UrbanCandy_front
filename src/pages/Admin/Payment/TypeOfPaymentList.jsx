import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllTypeOfPayment, deleteTypeOfPayment } from "../../../Services/Api"; // Mantido suas funções originais
import { Button } from "../../../componentes/Button/Button";
import { toast } from "react-toastify";

import "./TypeOfPaymentList.css";

export const TypeOfPaymentList = () => {
    const [paymentTypes, setPaymentTypes] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showModal, setShowModal] = useState(false);
    const [idParaDeletar, setIdParaDeletar] = useState(null);

    const navigate = useNavigate();

    // VOLTANDO PARA SUA LÓGICA ORIGINAL DE CARREGAMENTO
    const loadPaymentTypes = async () => {
        try {
            setLoading(true);
            const data = await getAllTypeOfPayment();
            setPaymentTypes(data || []); // Mantido o acesso direto ao data
        } catch {
            toast.error("Erro ao buscar tipos de pagamento", { theme: "colored" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPaymentTypes();
    }, []);

    const handleExcluir = (id) => {
        setIdParaDeletar(id);
        setShowModal(true);
    };

    // VOLTANDO PARA SUA LÓGICA ORIGINAL DE DELETAR
    const confirmDelete = async () => {
        const toastId = toast.loading("Removendo tipo de pagamento...");

        try {
            await deleteTypeOfPayment(idParaDeletar); // Mantido sua função original do Services

            toast.update(toastId, {
                render: "Tipo de pagamento removido! ✨",
                type: "success",
                isLoading: false,
                autoClose: 2000,
                theme: "colored"
            });

            loadPaymentTypes();
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
                    <p>Gerencie os tipos de pagamento do sistema</p>
                </div>
                <Button variant="primary" onClick={() => navigate("/admin/tipos-pagamento/form")}>
                    + Novo Tipo
                </Button>
            </header>

            <section className="admin-table-container">
                {loading ? (
                    <p style={{ padding: '20px' }}>Carregando...</p>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tipo</th>
                                <th style={{ textAlign: 'right' }}>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paymentTypes.map(type => (
                                <tr key={type.id_payment}>
                                    <td>#{type.id_payment}</td>
                                    <td>{type.name_payment}</td>
                                    <td style={{ textAlign: 'right' }}>
                                        <button
                                            className="btn-edit"
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
                                            onClick={() => handleExcluir(type.id_payment)}
                                        >
                                            Excluir
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </section>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-confirmacao">
                        <h3>Confirmar Exclusão</h3>
                        <p>Deseja realmente excluir este tipo de pagamento? Esta ação não pode ser desfeita.</p>
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
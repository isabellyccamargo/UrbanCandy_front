import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createTypeOfPayment , updateTypeOfPayment  } from "../../../Services/Api";
import { toast } from "react-toastify";

export const TypeOfPaymentForm = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const paymentType = location.state?.paymentType;

  const [namePaymentType, setNamePaymentType] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (paymentType) {
      setNamePaymentType(paymentType.name_payment);
    }
  }, [paymentType]);

  const validateForm = () => {

    if (!namePaymentType.trim()) {
      toast.warning("O nome do tipo de pagamento é obrigatório");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    const toastId = toast.loading("Salvando tipo de pagamento...");

    try {

      if (paymentType) {

        await updateTypeOfPayment (paymentType.id_payment, {
          name_payment: namePaymentType
        });

      } else {

        await createTypeOfPayment ({
          name_payment: namePaymentType
        });

      }

      toast.update(toastId, {
        render: "Tipo de pagamento salvo com sucesso!",
        type: "success",
        isLoading: false,
        autoClose: 2000
      });

      navigate("/admin/tipos-pagamento");

    } catch {

      toast.update(toastId, {
        render: "Erro ao salvar tipo de pagamento",
        type: "error",
        isLoading: false
      });

    } finally {
      setLoading(false);
    }

  };

  return (

    <div className="category-form-container">

      <h1 className="form-title">
        {paymentType ? "Editar Tipo de Pagamento" : "Novo Tipo de Pagamento"}
      </h1>

      <form onSubmit={handleSubmit} className="category-card-form">

        <div className="input-group">
          <label>Nome do Tipo de Pagamento</label>

          <input
            type="text"
            placeholder="Ex: Pix, Cartão, Dinheiro..."
            value={namePaymentType}
            onChange={(e) => setNamePaymentType(e.target.value)}
          />
        </div>

        <div className="form-actions">

          <button
            type="button"
            className="btn-cancel"
            onClick={() => navigate("/admin/tipos-pagamento")}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="btn-save"
            disabled={loading}
          >
            {loading ? "Salvando..." : "Salvar"}
          </button>

        </div>

      </form>

    </div>
  );
};
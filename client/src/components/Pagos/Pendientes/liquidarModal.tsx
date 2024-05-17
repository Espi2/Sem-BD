import React from "react";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";

export default function LiquidarModal({ show, handleClose, id_cuota }) {
  const liquidarAdeudo = async () => {
    try {
      await axios.patch(`/api/cuota/${id_cuota}`, {
        pagado: true,
      });
    } catch (err) {
      console.log("Error al liquidar adeudo:", err);
    }
    handleClose(true);
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="w-100 text-center">Confirmar?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex justify-content-center">
          <Button
            variant="primary"
            type="submit"
            onClick={liquidarAdeudo}
            className="w-90"
          >
            Si
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

import React from "react";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";

export default function eliminarHab({ show, handleClose, id_habitante }) {
  const eliminarHabitante = async () => {
    try {
      await axios.patch(`/api/habitante/elim/${id_habitante}`, {
        pagado: true,
      });
    } catch (err) {
      console.log("Error al eliminar habitante:", err);
    }
    handleClose(true);
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="w-100 text-center">¿Confirmar?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex justify-content-center">
          <Button
            variant="primary"
            type="submit"
            onClick={eliminarHabitante}
            className="w-90"
          >
            Si
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

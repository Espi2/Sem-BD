// eliminarHab.jsx
import React from "react";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";

const EliminarHab = ({ show, handleClose, id_habitante }) => {
  const eliminarHabitante = async () => {
    try {
      await axios.delete(`/api/habitante/elim/${id_habitante}`);
      handleClose(true); // Cerrar el modal después de eliminar
    } catch (err) {
      console.log("Error al eliminar habitante:", err);
    }
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
            type="button" // Cambiado de "submit" a "button"
            onClick={eliminarHabitante}
            className="w-90"
          >
            Si
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default EliminarHab;

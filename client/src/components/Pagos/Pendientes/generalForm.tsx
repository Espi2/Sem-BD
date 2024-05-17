import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import axios from "axios";

const GeneralCuotaForm = ({ show, handleClose }) => {
  const [cuota, setCuota] = useState({
    motivo: "",
    monto: "",
    fecha_limite: "",
  });

  const handleHouseChange = (e) => {
    const { name, value } = e.target;
    setCuota({ ...cuota, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post(`/api/cuota/paraTodos`, {
      motivo: cuota.motivo,
      monto: parseFloat(cuota.monto),
      fecha_limite: cuota.fecha_limite,
    });

    setCuota({
      motivo: "",
      monto: "",
      fecha_limite: "",
    });
    handleClose(true);
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="w-100 text-center">Cuota general</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="motivo">
            <Form.Label>Motivo*</Form.Label>
            <Form.Control
              type="text"
              name="motivo"
              value={cuota.motivo}
              onChange={handleHouseChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="monto">
            <Form.Label>Monto*</Form.Label>
            <Form.Control
              type="text"
              name="monto"
              value={cuota.monto}
              onChange={handleHouseChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="fecha_limite">
            <Form.Label>Fecha Limite*</Form.Label>
            <Form.Control
              type="date"
              name="fecha_limite"
              value={cuota.fecha_limite}
              onChange={handleHouseChange}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Listo
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default GeneralCuotaForm;

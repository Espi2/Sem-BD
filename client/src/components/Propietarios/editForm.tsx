import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Col } from "react-bootstrap";
import axios from "axios";
import eliminarHab from "./deleteHab";

type Habitante = {
  id_habitante: string;
  nombre: string;
  ap: string;
  am: string;
};

const EditHabitantModal = ({ show, handleClose, rowData, dataFamilia }) => {
  const [habitantData, setHabitantData] = useState({
    id_habitante: "",
    nombre: "",
    ap: "",
    am: "",
  });

  useEffect(() => {
    if (rowData) {
      const familia: Habitante[] = Object.values(dataFamilia).flat();
      const habitanteEncontrado = familia.find(
        (habitante: Habitante) =>
          habitante.nombre === rowData?.nombre &&
          habitante.ap === rowData?.ap &&
          habitante.am === rowData?.am
      );

      if (habitanteEncontrado) {
        setHabitantData({
          ...habitantData,
          id_habitante: habitanteEncontrado.id_habitante,
          nombre: habitanteEncontrado.nombre,
          ap: habitanteEncontrado.ap,
          am: habitanteEncontrado.am,
        });
      }
    }
  }, [rowData, dataFamilia]);

  const handleHabitantChange = (e) => {
    const { name, value } = e.target;
    setHabitantData({ ...habitantData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { id_habitante, nombre, ap, am } = habitantData;
      await axios.patch(`/api/habitante/${id_habitante}`, {
        nombre,
        ap,
        am,
      });
      handleClose(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal show={show} onHide={() => handleClose(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title className="w-100 text-center">
          Editar Habitante
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Col className="mb-3">
            <Form.Group controlId="nombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={habitantData.nombre}
                onChange={handleHabitantChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="ap">
              <Form.Label>Apellido Paterno</Form.Label>
              <Form.Control
                type="text"
                name="ap"
                value={habitantData.ap}
                onChange={handleHabitantChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="am">
              <Form.Label>Apellido Materno</Form.Label>
              <Form.Control
                type="text"
                name="am"
                value={habitantData.am}
                onChange={handleHabitantChange}
              />
            </Form.Group>
          </Col>
          <Button variant="primary" type="submit">
            Editar
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditHabitantModal;

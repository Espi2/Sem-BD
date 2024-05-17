import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Col } from "react-bootstrap";
import axios from "axios";

const EditHabitantModal = ({
  show,
  handleClose,
  rowData,
  rowDataPropietario,
}) => {
  const [habitantData, setHabitantData] = useState({
    num_casa_fk: "",
    nombre: "",
    ap: "",
    am: "",
  });

  useEffect(() => {
    if (rowData) {
      setHabitantData({
        num_casa_fk: rowDataPropietario.num_casa_fk,
        nombre: rowData.nombre,
        ap: rowData.ap,
        am: rowData.am,
      });
    }
  }, [rowData, rowDataPropietario]);

  const handleHabitantChange = (e) => {
    const { name, value } = e.target;
    setHabitantData({ ...habitantData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.patch(`/api/habitante/${rowData.id_habitante}`, habitantData);
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

export default editForm;

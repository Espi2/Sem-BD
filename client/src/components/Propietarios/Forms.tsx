import React, { useState } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import axios from "axios";

const AddHabitantForm = ({ show, handleClose, selectedPropietario }) => {
  const [personData, setPersonData] = useState({
    nombre: "",
    ap: "",
    am: "",
  });

  const handlePersonChange = (e) => {
    const { name, value } = e.target;
    setPersonData({ ...personData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { nombre, ap, am } = personData;
    const { num_casa_fk } = selectedPropietario;
    try {
      await axios.post("/api/habitante/", {
        nombre,
        ap,
        am,
        propietario: false,
        num_casa_fk,
      });
      setPersonData({
        nombre: "",
        ap: "",
        am: "",
      });
      handleClose();
    } catch (error) {
      console.error("Error al agregar habitante:", error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="w-100 text-center">
          Agregar habitante
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col>
              <Form.Group controlId="nombre">
                <Form.Label>Nombre *</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  value={personData.nombre}
                  onChange={handlePersonChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="ap">
                <Form.Label>Apellido Paterno *</Form.Label>
                <Form.Control
                  type="text"
                  name="ap"
                  value={personData.ap}
                  onChange={handlePersonChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="am">
                <Form.Label>Apellido Materno</Form.Label>
                <Form.Control
                  type="text"
                  name="am"
                  value={personData.am}
                  onChange={handlePersonChange}
                />
              </Form.Group>
            </Col>
          </Row>
          <Button variant="primary" type="submit">
            Listo
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddHabitantForm;

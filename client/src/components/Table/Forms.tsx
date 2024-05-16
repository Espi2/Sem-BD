import React, { useState } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import axios from "axios";

const AddHouseAndPersonForm = ({ show, handleClose }) => {
  const [houseData, setHouseData] = useState({
    num_casa: "",
    calle: "",
    num_habitantes: "",
    telefono1: "",
    telefono2: "",
  });

  const [personData, setPersonData] = useState({
    nombre: "",
    ap: "",
    am: "",
  });

  const handleHouseChange = (e) => {
    const { name, value } = e.target;
    setHouseData({ ...houseData, [name]: value });
  };

  const handlePersonChange = (e) => {
    const { name, value } = e.target;
    setPersonData({ ...personData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post("/api/casa/casa_y_propietario", {
      num_casa: parseInt(houseData.num_casa),
      calle: houseData.calle,
      num_habitantes: parseInt(houseData.num_habitantes),
      telefono1: houseData.telefono1,
      telefono2: houseData.telefono2,
      propietario: {
        nombre: personData.nombre,
        ap: personData.ap,
        am: personData.am,
      },
    });

    setHouseData({
      num_casa: "",
      calle: "",
      num_habitantes: "",
      telefono1: "",
      telefono2: "",
    });
    setPersonData({
      nombre: "",
      ap: "",
      am: "",
    });
    handleClose(true);
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="w-100 text-center">Agregar</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row className="mb-3">
            <Col>
              <h4 className="text-center">Casa</h4>
              <Form.Group controlId="num_casa">
                <Form.Label>Número de Casa *</Form.Label>
                <Form.Control
                  type="text"
                  name="num_casa"
                  value={houseData.num_casa}
                  onChange={handleHouseChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="calle">
                <Form.Label>Calle *</Form.Label>
                <Form.Control
                  type="text"
                  name="calle"
                  value={houseData.calle}
                  onChange={handleHouseChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="num_habitantes">
                <Form.Label>Número de Habitantes *</Form.Label>
                <Form.Control
                  type="text"
                  name="num_habitantes"
                  value={houseData.num_habitantes}
                  onChange={handleHouseChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="telefono1">
                <Form.Label>Teléfono 1 *</Form.Label>
                <Form.Control
                  type="text"
                  name="telefono1"
                  value={houseData.telefono1}
                  onChange={handleHouseChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="telefono2">
                <Form.Label>Teléfono 2</Form.Label>
                <Form.Control
                  type="text"
                  name="telefono2"
                  value={houseData.telefono2}
                  onChange={handleHouseChange}
                />
              </Form.Group>
            </Col>
            <Col>
              <h4 className="text-center">Propietario</h4>
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

export default AddHouseAndPersonForm;

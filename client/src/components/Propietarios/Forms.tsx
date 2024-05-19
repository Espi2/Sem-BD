import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Row, Col, Tabs, Tab } from "react-bootstrap";
import axios from "axios";

const AddHabitantForm = ({ show, handleClose, selectedPropietario }) => {
  const [personData, setPersonData] = useState({
    nombre: "",
    ap: "",
    am: "",
  });

  const [activeTab, setActiveTab] = useState("agregar");

  useEffect(() => {
    if (activeTab === "editar") {
      setPersonData({
        nombre: selectedPropietario.nombre,
        ap: selectedPropietario.ap,
        am: selectedPropietario.am,
      });
    } else if (activeTab === "agregar") {
      setPersonData({
        nombre: "",
        ap: "",
        am: "",
      });
    }
  }, [activeTab, selectedPropietario]);

  const handlePersonChange = (e) => {
    const { name, value } = e.target;
    setPersonData({ ...personData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { nombre, ap, am } = personData;
    const { num_casa_fk } = selectedPropietario;

    if (activeTab === "agregar") {
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
    } else {
      try {
        await axios.patch(
          `/api/habitante/edit/${selectedPropietario.id_habitante}`,
          {
            nombre,
            ap,
            am,
          }
        );
        handleClose(true);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const renderAddForm = () => (
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
  );

  const renderEditForm = () => (
    <Form onSubmit={handleSubmit}>
      <Row className="mb-3">
        <Col>
          <Form.Group controlId="nombre">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={personData.nombre}
              onChange={handlePersonChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="ap">
            <Form.Label>Apellido Paterno</Form.Label>
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
        Enviar
      </Button>
    </Form>
  );

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="w-100 text-center">
          {activeTab === "agregar" ? "Agregar habitante" : "Editar propietario"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          id="controlled-tab-example"
        >
          <Tab eventKey="agregar" title="Agregar habitante">
            {renderAddForm()}
          </Tab>
          <Tab eventKey="editar" title="Editar propietario">
            {renderEditForm()}
          </Tab>
        </Tabs>
      </Modal.Body>
    </Modal>
  );
};

export default AddHabitantForm;

import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Col } from "react-bootstrap";
import axios from "axios";

const EditHouseModal = ({ show, handleClose, rowData }) => {
  const [houseData, setHouseData] = useState({
    num_casa: "",
    calle: "",
    num_habitantes: "",
    telefono1: "",
    telefono2: "",
  });

  useEffect(() => {
    // Si hay datos de la fila seleccionada, actualiza el estado de la casa con esos datos
    if (rowData) {
      setHouseData({
        num_casa: rowData.num_casa,
        calle: rowData.calle,
        num_habitantes: rowData.num_habitantes,
        telefono1: rowData.telefono1,
        telefono2: rowData.telefono2,
      });
    }
  }, [rowData]);

  const handleHouseChange = (e) => {
    const { name, value } = e.target;
    setHouseData({ ...houseData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.patch(`/api/casa/${rowData.num_casa}`, {
        num_casa: parseInt(houseData.num_casa),
        calle: houseData.calle,
        num_habitantes: parseInt(houseData.num_habitantes),
        telefono1: houseData.telefono1,
        telefono2: houseData.telefono2,
      });
    } catch (error) {
      console.log(error);
    }
    handleClose(true);
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="w-100 text-center">
          Casa #{rowData ? rowData.num_casa : ""}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Col className="mb-3">
            <Form.Group controlId="num_casa">
              <Form.Label>Número de Casa</Form.Label>
              <Form.Control
                type="text"
                name="num_casa"
                value={houseData.num_casa}
                onChange={handleHouseChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="calle">
              <Form.Label>Calle</Form.Label>
              <Form.Control
                type="text"
                name="calle"
                value={houseData.calle}
                onChange={handleHouseChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="habitantes">
              <Form.Label>Numero de habitantes</Form.Label>
              <Form.Control
                type="text"
                name="num_habitantes"
                value={houseData.num_habitantes}
                onChange={handleHouseChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="telefono1">
              <Form.Label>Telefono 1</Form.Label>
              <Form.Control
                type="text"
                name="telefono1"
                value={houseData.telefono1}
                onChange={handleHouseChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="telefono2">
              <Form.Label>Telefono 2</Form.Label>
              <Form.Control
                type="text"
                name="telefono2"
                value={houseData.telefono2}
                onChange={handleHouseChange}
                required
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

export default EditHouseModal;

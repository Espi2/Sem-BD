// EditHabitantModal.jsx
import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Col, Image } from "react-bootstrap";
import axios from "axios";
import EliminarHab from "./deleteHab.tsx";

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
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (rowData) {
      const familia: Habitante[] = Object.values(
        dataFamilia
      ).flat() as Habitante[];
      const habitanteEncontrado = familia.find(
        (habitante: Habitante) =>
          habitante.nombre === rowData?.nombre &&
          habitante.ap === rowData?.ap &&
          habitante.am === rowData?.am
      );

      if (habitanteEncontrado) {
        setHabitantData((habitantData) => ({
          ...habitantData,
          id_habitante: habitanteEncontrado.id_habitante,
          nombre: habitanteEncontrado.nombre,
          ap: habitanteEncontrado.ap,
          am: habitanteEncontrado.am,
        }));
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
      await axios.patch(`/api/habitante/edit/${id_habitante}`, {
        nombre,
        ap,
        am,
      });
      handleClose(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  return (
    <>
      <Modal show={show} onHide={() => handleClose(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="w-100 text-center">
            Editar Habitante
            <Image
              src="./trash-bin.png"
              alt="Eliminar"
              onClick={handleDelete}
              style={{
                cursor: "pointer",
                float: "right",
                marginTop: "8px",
                marginRight: "8px",
                height: "8%",
                width: "8%",
              }}
            />
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
      <EliminarHab
        show={showDeleteModal}
        handleClose={() => {
          setShowDeleteModal(false);
          handleClose(true);
        }}
        id_habitante={habitantData.id_habitante}
      />
    </>
  );
};

export default EditHabitantModal;

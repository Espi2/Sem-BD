import React from "react";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function SalirModal({ show, handleClose }) {
  const navigate = useNavigate();

  const salirAlLogin = async () => {
    localStorage.setItem("isLoggedIn", "false");
    navigate("/login");
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="w-100 text-center">Segur@?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex justify-content-center">
          <Button
            variant="primary"
            type="submit"
            onClick={salirAlLogin}
            className="w-90"
          >
            Si
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

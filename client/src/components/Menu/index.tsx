import React, { useEffect, useState } from "react";
import styles from "./Menu.module.css";
import Table from "../Table/index.tsx";
import Register from "../Register/index.tsx";
import PropietariosComp from "../Propietarios/index.tsx";
import PagosPendientes from "../Pagos/Pendientes/index.tsx";
import PagosResueltos from "../Pagos/Resueltos/index.tsx";
import SalirModal from "./salirModal.tsx";
import axios from "axios";
import { Modal } from "react-bootstrap";

const Menu = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isPaymentsOpen, setIsPaymentsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Ninguna");
  const [showSalir, setShowSalir] = useState(false);
  const [notificaciones, setNotificaciones] = useState<noti[]>([]);
  const [showModalNotis, setShowModalNotis] = useState(false);
  const [usuario, setUsuario] = useState("");

  interface casa {
    num_casa: number;
    calle: string;
    num_habitantes: 7;
    telefono1: string;
    telefono2: string;
  }

  interface noti {
    casa: casa;
    fecha_limite: string;
    id_cuota: string;
    monto: number;
    motivo: string;
    num_casa_fk: number;
    pagado: boolean;
  }

  useEffect(() => {
    const getNotificaciones = async () => {
      try {
        const response = await axios.get("/api/cuota/atrasadas");
        let notis: noti[] = response.data.atrasados;
        setNotificaciones(notis);
      } catch (err) {}
    };
    const getUserName = () => {
      const nombreUsuario = localStorage.getItem("NombreDeUsuario");
      setUsuario(nombreUsuario || "Administrador");
    };

    getNotificaciones();
    getUserName();
  }, []);

  const handleShowSalir = () => {
    setShowSalir(true);
  };

  const handleCloseSalir = () => {
    setShowSalir(false);
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const togglePayments = () => {
    setIsPaymentsOpen(!isPaymentsOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const handleShowNotis = (option) => {
    setShowModalNotis(option);
  };

  const notificacionesHTML = () => {
    return notificaciones.length !== 0 ? (
      <div className={styles.notificacionesList}>
        {notificaciones.map((notificacion, index) => (
          <div key={index} className={styles.notiRecuadro}>
            {`ATRASADO - casa: ${notificacion.casa.num_casa} motivo: ${notificacion.motivo}`}
          </div>
        ))}
      </div>
    ) : (
      <div
        style={{ textAlign: "center" }}
      >{`No hay notificaciones para mostrar`}</div>
    );
  };

  return (
    <div>
      <div className={styles.menuButton} onClick={toggleSidebar}>
        Menu
      </div>
      <div className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
        <div className={styles.options}>
          <div
            className={`${styles.option} ${
              selectedOption === "Casas" ? styles.selected : ""
            }`}
            onClick={() => handleOptionClick("Casas")}
          >
            Casas
          </div>
          <div
            className={`${styles.option} ${
              selectedOption === "Propietarios" ? styles.selected : ""
            }`}
            onClick={() => handleOptionClick("Propietarios")}
          >
            Propietarios
          </div>
          <div
            className={`${styles.option} ${
              selectedOption === "Pagos" ? styles.selected : ""
            }`}
            onClick={togglePayments}
          >
            Pagos
          </div>
          {isPaymentsOpen && (
            <div>
              <div
                className={`${styles.subOption} ${
                  selectedOption === "Registros" ? styles.selected : ""
                }`}
                onClick={() => handleOptionClick("Registros")}
              >
                Registros
              </div>
              <div
                className={`${styles.subOption} ${
                  selectedOption === "Adeudos" ? styles.selected : ""
                }`}
                onClick={() => handleOptionClick("Adeudos")}
              >
                Adeudos
              </div>
            </div>
          )}
          <div
            className={`${styles.option} ${
              selectedOption === "Registrar administrador"
                ? styles.selected
                : ""
            }`}
            onClick={() => handleOptionClick("Registrar administrador")}
          >
            Registrar administrador
          </div>
          <div
            className={`${styles.option} ${
              selectedOption === "Soporte" ? styles.selected : ""
            }`}
            onClick={handleShowSalir}
          >
            Salir
          </div>
        </div>
      </div>

      <div>
        {selectedOption === "Registrar administrador" ? (
          <Register />
        ) : selectedOption === "Casas" ? (
          <Table />
        ) : selectedOption === "Propietarios" ? (
          <PropietariosComp />
        ) : selectedOption === "Registros" ? (
          <PagosResueltos />
        ) : selectedOption === "Adeudos" ? (
          <PagosPendientes />
        ) : selectedOption === "Ninguna" ? (
          <div
            style={{
              marginLeft: "250px",
              height: "100vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div
              style={{
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "100px",
                fontFamily: "sans-serif",
              }}
            >
              {`Hola ${usuario}`}
              <div>{`😊`}</div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>

      <SalirModal show={showSalir} handleClose={handleCloseSalir} />

      <div className={styles.lasNotis} onClick={() => handleShowNotis(true)}>
        <img
          className={styles.bellImg}
          src={
            notificaciones
              ? notificaciones.length !== 0
                ? "/soundbell.png"
                : "/bell.png"
              : "/bell.png"
          }
          alt="bell"
        ></img>
      </div>

      {showModalNotis ? (
        <Modal
          show={showModalNotis}
          onHide={() => handleShowNotis(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title className="w-100 text-center">
              Notificaciones
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>{notificacionesHTML()}</Modal.Body>
        </Modal>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Menu;

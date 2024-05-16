import React, { useState } from "react";
import styles from "./Menu.module.css";
import Table from "../Table/index.tsx";
import Register from "../Register/index.tsx";
import PropietariosComp from "../Propietarios/index.tsx";

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPaymentsOpen, setIsPaymentsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const togglePayments = () => {
    setIsPaymentsOpen(!isPaymentsOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  return (
    <div>
      <div className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
        <div className={styles.menuButton} onClick={toggleSidebar}>
          Menu
        </div>
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
            onClick={() => handleOptionClick("Soporte")}
          >
            Soporte
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
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  );
};

export default Menu;

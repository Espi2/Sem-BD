import React, { useState } from "react";
import axios from "axios";
import styles from "./Register.module.css";

function Register() {
  const [nombre, setNombre] = useState("");
  const [ap, setAp] = useState("");
  const [am, setAm] = useState("");
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre || !ap || !am || !usuario || !contrasena) {
      setError("Por favor, completa todos los campos.");

      setTimeout(() => {
        setError("");
      }, 5000);
      return;
    }

    try {
      const response = await axios.post("/api/auth/", {
        nombre,
        ap,
        am,
        usuario,
        contrasena,
      });

      console.log(response.data);
      // Mostrar alerta de que el registro fue realizado exitosamente
    } catch (error) {
      setError("Error al registrar usuario");

      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Registro</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <label htmlFor="inputNombre" className={styles.label}>
            Nombre
          </label>
          <input
            type="text"
            className={styles.input}
            id="inputNombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="inputAp" className={styles.label}>
            Apellido Paterno
          </label>
          <input
            type="text"
            className={styles.input}
            id="inputAp"
            value={ap}
            onChange={(e) => setAp(e.target.value)}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="inputAm" className={styles.label}>
            Apellido Materno
          </label>
          <input
            type="text"
            className={styles.input}
            id="inputAm"
            value={am}
            onChange={(e) => setAm(e.target.value)}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="inputUsuario" className={styles.label}>
            Usuario
          </label>
          <input
            type="text"
            className={styles.input}
            id="inputUsuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="inputPassword" className={styles.label}>
            Contraseña
          </label>
          <input
            type="password"
            className={styles.input}
            id="inputPassword"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
          />
        </div>
        <button type="submit" className={styles.btn}>
          Registrar
        </button>
      </form>
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
}

export default Register;

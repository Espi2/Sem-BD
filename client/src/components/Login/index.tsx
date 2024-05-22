import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Login.module.css";
import { useNavigate } from "react-router-dom";

function Login() {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/auth/login", {
        usuario,
        contrasena,
      });
      if (response.data.message === "Autenticación correcta") {
        setIsLoggedIn(true);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("NombreDeUsuario", response.data.nombre);
      }
    } catch (error) {
      setError("Usuario o contraseña incorrectos");

      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/menu");
    }
  }, [usuario, navigate, isLoggedIn]);

  return (
    <div>
      <div>
        <nav className="navbar bg-body-tertiary">
          <div className="container-fluid">
            <span className="navbar-letra mb-0 h1">Granate</span>
          </div>
        </nav>
      </div>
      <div className={styles.container}>
        <h1 className={styles.title}>Sign In</h1>
        <form
          className={styles.form}
          onSubmit={handleSubmit}
          style={{ marginTop: error ? "75px" : "0" }}
        >
          <div className={styles.inputGroup}>
            <label htmlFor="inputUsername" className={styles.label}>
              Usuario
            </label>
            <input
              type="text"
              className={styles.input}
              id="inputUsername"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              placeholder="Usuario"
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
              placeholder="Contraseña"
            />
          </div>
          <button type="submit" className={styles.btn}>
            Login
          </button>
        </form>
        {error && <div className="alert alert-danger">{error}</div>}
      </div>
    </div>
  );
}

export default Login;

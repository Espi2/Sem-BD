import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
function App() {
  const [casaData, setCasaData] = useState(null);

  useEffect(() => {
    const fetchCasaData = async () => {
      try {
        const response = await fetch("/casa");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const casa = await response.json();
        setCasaData(casa);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchCasaData();
  }, []);

  const crearCasa = async () => {
    try {
      const response = await fetch("/casa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Indica al servidor que estás enviando datos JSON
        },
        body: JSON.stringify({
          // Convierte el objeto a formato JSON
          id: 1,
          adeudo: 100,
          inquilinos: {
            create: { name: "Cesar" },
          },
          servicios: {
            create: { basura: false },
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Error al crear casa");
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <img className="App-logo" src={logo} alt="logo" />
        <h1 className="App-title">Welcome to React</h1>

        {
          //<button onClick={crearCasa}>Crear un wey</button>
        }
      </header>
    </div>
  );
}
export default App;

import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
function App() {
  const [data, setData] = useState(null);
  useEffect(() => {
    const callBackendAPI = async () => {
      try {
        const response = await fetch("/api/auth/cesar123/cesar")
          .then((res) => res.json())
          .then((res) => {
            setData(res.nombre);
          });
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
      } catch (err) {
        console.log(err);
      }
    };
    callBackendAPI();
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        <img className="App-logo" src={logo} alt="logo" />
        <h1 className="App-title">Welcome to React</h1>
        <p style={{ color: "white" }}>{data}</p>
      </header>
    </div>
  );
}
export default App;

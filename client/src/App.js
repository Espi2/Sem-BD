import React, { useState, useEffect } from "react";
import "./App.css";
import Login from "./components/Login/index.tsx";

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
    <div>
      <Login></Login>
    </div>
  );
}
export default App;

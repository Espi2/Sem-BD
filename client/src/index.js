import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import Menu from "./components/Menu/index.tsx";
import Login from "./components/Login/index.tsx";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.css";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Navigate,
} from "react-router-dom";

// Función para verificar si el usuario está autenticado (simulada)
const isAuthenticated = () => {
  const authenticated = localStorage.getItem("isLoggedIn") === "true";
  return authenticated;
};

// Componente para proteger las rutas privadas
const ProtectedRoute = ({ element, ...rest }) => {
  return isAuthenticated() ? element : <Navigate to="/login" />;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/menu/",
    element: <ProtectedRoute element={<Menu />} />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  // Define una ruta protegida para cualquier ruta no manejada
  {
    path: "*",
    element: <ProtectedRoute element={<Navigate to="/login" />} />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </React.StrictMode>
);

reportWebVitals();

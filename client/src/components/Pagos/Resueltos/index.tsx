import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "react-bootstrap";
import DataTable from "react-data-table-component";
import styles from "./Resueltos.module.css";

type cuota = {
  id_cuota: number;
  monto: number;
  fecha_limite: string;
  motivo: string;
  pagado: boolean;
  num_casa_fk: number;
};

const PagosResueltos = () => {
  const [originalRecords, setOriginalRecords] = useState<cuota[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<cuota[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/cuota/resueltos");
        let cuotas: cuota[] = response.data.cuotas;
        cuotas = cuotas.map((cuota: cuota) => ({
          ...cuota,
          fecha_limite: new Date(cuota.fecha_limite).toLocaleDateString(
            "es-ES",
            {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            }
          ),
        }));
        setOriginalRecords(cuotas);
        setFilteredRecords(cuotas);
      } catch (error) {
        console.error("Error al obtener los datos de las cuotas:", error);
      }
    };

    fetchData();
  }, []);

  const columns = [
    {
      name: "Número de Casa",
      selector: (row) => row.num_casa_fk,
      sortable: true,
    },
    {
      name: "Monto",
      selector: (row) => row.monto,
      sortable: true,
    },
    {
      name: "Fecha Límite",
      selector: (row) => row.fecha_limite,
      sortable: true,
    },
    {
      name: "Motivo",
      selector: (row) => row.motivo,
    },
    {
      name: "Pagado",
      selector: (row) => (row.pagado ? "Sí" : "No"),
      sortable: true,
    },
  ];

  const handleChange = (e) => {
    const searchText = e.target.value.toLowerCase();
    const filteredData = originalRecords.filter((record: cuota) =>
      record.motivo.toLowerCase().includes(searchText)
    );
    setFilteredRecords(filteredData);
  };

  const getRowClassName = (row) => {
    const deadlineDate = new Date(row.fecha_limite);
    const currentDate = new Date();

    return deadlineDate > currentDate ? styles.rowRed : "";
  };

  const customStyles = {
    rows: {
      style: {
        minHeight: "60px",
        width: "100%",
        "&:hover": {
          backgroundColor: "#f2f2f2",
          cursor: "pointer",
        },
      },
      // Aplica la clase de fila condicionalmente
      className: (row) => getRowClassName(row),
    },
    headCells: {
      style: {
        paddingLeft: "8px",
        paddingRight: "8px",
        marginTop: "0%",
      },
    },
    cells: {
      style: {
        paddingLeft: "8px",
        paddingRight: "8px",
      },
    },
  };

  return (
    <div className={styles.contenedorPrincipal}>
      <div className={styles.espacioTotal}>
        <div className={styles.Tablas}>
          <input
            type="text"
            onChange={handleChange}
            className={styles.inputSearch}
            placeholder="Búsqueda por motivo"
          />
          <div className={styles.containerTable}>
            <DataTable
              columns={columns}
              data={filteredRecords}
              customStyles={customStyles}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PagosResueltos;

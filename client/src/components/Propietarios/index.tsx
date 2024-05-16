import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Propietarios.module.css";
import DataTable from "react-data-table-component";

type propietario = {
  id_habitante: number;
  nombre: string;
  ap: string;
  am: string;
  propietario: boolean;
  num_casa_fk: number;
  casa: Object;
};

export default function PropietariosComp() {
  const [records, setRecords] = useState<propietario[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/habitante/propietarios");
        setRecords(response.data.propietarios);
      } catch (error) {
        console.error("Error al obtener los datos de propietarios:", error);
      }
    };

    fetchData();
  }, []);

  const columns = [
    {
      name: "Casa",
      selector: (row) => row.num_casa_fk,
      sortable: true,
    },
    {
      name: "Nombre",
      selector: (row) => row.nombre,
      sortable: true,
    },
    {
      name: "Apellido paterno",
      selector: (row) => row.ap,
      sortable: true,
    },
    {
      name: "Apellido materno",
      selector: (row) => row.am || "-",
    },
  ];

  const customStyles = {
    rows: {
      style: {
        minHeight: "60px", // override the row height
        width: "100%",
        "&:hover": {
          backgroundColor: "#f2f2f2", // Cambiar el color de fondo al pasar el ratón por encima
          cursor: "pointer", // Cambiar el cursor al pasar el ratón por encima
        },
      },
    },
    headCells: {
      style: {
        paddingLeft: "8px", // override the cell padding for head cells
        paddingRight: "8px",
        marginTop: "0%",
      },
    },
    cells: {
      style: {
        paddingLeft: "8px", // override the cell padding for data cells
        paddingRight: "8px",
      },
    },
  };

  return (
    <div className={styles.contenedorPrincipal}>
      <div className={styles.espacioTotal}>
        <div className={styles.Tablas}>
          <div className={styles.containerTable}>
            <DataTable
              columns={columns}
              data={records}
              customStyles={customStyles}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import styles from "./Table.module.css";
import axios from "axios";
import DataTable from "react-data-table-component";

type servicio = {
  id_servicio: number;
  estacionamiento: boolean;
  porton: boolean;
  basura: boolean;
  num_casa_fk: number;
};

export default function ChildServicio() {
  const [servicio, setServicio] = useState<servicio>({
    id_servicio: 0,
    estacionamiento: false,
    porton: false,
    basura: false,
    num_casa_fk: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/servicio");
        setServicio(response.data.servicio);
      } catch (error) {
        console.error("Error al obtener los datos del servicio:", error);
      }
    };

    fetchData();
  }, []);

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

  const columns = [
    {
      name: "Estacionamiento",
      selector: "estacionamiento",
      sortable: true,
    },
    {
      name: "Portón",
      selector: "porton",
      sortable: true,
    },
    {
      name: "Basura",
      selector: "basura",
      sortable: true,
    },
  ];

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <h6 style={{ marginRight: "10px" }}>Servicio Detallado</h6>
      <DataTable
        columns={columns}
        data={[servicio]}
        noHeader
        customStyles={customStyles}
      />
    </div>
  );
}

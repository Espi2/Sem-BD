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

type familiar = {
  id_habitante: number;
  nombre: string;
  ap: string;
  am: string;
  propietario: boolean;
  num_casa_fk: number;
};

export default function PropietariosComp() {
  const [records, setRecords] = useState<propietario[]>([]);
  const [familia, setFamilia] = useState<{ [key: number]: familiar[] }>({});
  const [expandedRow, setExpandedRow] = useState<number | null>(null);

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

  const innerTableCustomStyles = {
    rows: {
      style: {
        backgroundColor: "#f2f2f2",
        minHeight: "60px", // override the row height
        width: "100%",
        "&:hover": {
          backgroundColor: "#6e6e6e", // Cambiar el color de fondo al pasar el ratón por encima
          cursor: "pointer", // Cambiar el cursor al pasar el ratón por encima
        },
      },
    },
    headCells: {
      style: {
        backgroundColor: "#f2f2f2",
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

  const handleRowExpand = async (expanded, row: propietario) => {
    if (expanded) {
      setExpandedRow(row.num_casa_fk);
      try {
        const response = await axios.get(
          `/api/habitante/familia/${row.num_casa_fk}`
        );
        setFamilia((prevFamilia) => ({
          ...prevFamilia,
          [row.num_casa_fk]: response.data,
        }));
      } catch (error) {
        console.error("Error al obtener los datos de la familia:", error);
      }
    } else {
      setExpandedRow(null);
    }
  };

  const SubTable = ({ data }: { data: familiar[] }) => {
    const subColumns = [
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

    return (
      <div style={{ display: "flex", alignItems: "center" }}>
        <h6 style={{ marginRight: "10px" }}>Familia</h6>
        <DataTable
          columns={subColumns}
          data={data}
          noHeader
          customStyles={innerTableCustomStyles}
        />
      </div>
    );
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
              expandableRows
              expandableRowsComponent={({ data }) => (
                <SubTable data={familia[data.num_casa_fk] || []} />
              )}
              onRowExpandToggled={handleRowExpand}
              expandableRowExpanded={(row) => expandedRow === row.num_casa_fk}
              noDataComponent="No hay registros para mostrar"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

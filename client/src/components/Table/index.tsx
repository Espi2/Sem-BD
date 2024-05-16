import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Modal } from "react-bootstrap";
import DataTable from "react-data-table-component";
import AddHouseAndPersonForm from "./Forms.tsx";
import EditHouseModal from "./editForm.tsx";
import styles from "./Table.module.css";

type habitante = {
  id_habitante: number;
  nombre: string;
  ap: string;
  am: string;
  propietario: boolean;
  num_casa_fk: number;
};

type casa = {
  num_casa: number;
  calle: string;
  num_habitantes: number;
  telefono1: string;
  telefono2: string;
  habitantes: [];
  cuota: [];
  servicio: {};
};

const Table = () => {
  const [originalRecords, setOriginalRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);

  const handleShowAgregar = () => {
    setShowAddForm(true);
  };

  const handleCloseAgregar = (flag) => {
    setShowAddForm(false);
    if (flag) {
      updateCasa();
    }
  };

  const handleShowEditar = (row) => {
    if (row) {
      setSelectedRowData(row); // Guarda los datos de la fila seleccionada
      setShowEditForm(true); // Muestra el modal
    }
  };

  const handleCloseEditar = (flag) => {
    setShowEditForm(false);
    if (flag) {
      updateCasa();
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/casa/");
        setOriginalRecords(response.data.casas);
        setFilteredRecords(response.data.casas);
        console.log(response.data);
      } catch (error) {
        console.error("Error al obtener los datos de casa:", error);
      }
    };

    fetchData();
  }, []);

  const updateCasa = async () => {
    try {
      const response = await axios.get("/api/casa/");
      setOriginalRecords(response.data.casas);
      setFilteredRecords(response.data.casas);
    } catch (error) {
      console.error("Error al obtener los datos de casa:", error);
    }
  };

  const columns = [
    {
      name: "Numero Casa",
      selector: (row) => row.num_casa,
      sortable: true,
    },
    {
      name: "Calle",
      selector: (row) => row.calle,
      sortable: true,
    },
    {
      name: "Numero Habitantes",
      selector: (row) => row.num_habitantes,
      sortable: true,
    },
    {
      name: "Telefono 1",
      selector: (row) => row.telefono1,
    },
    {
      name: "Telefono 2",
      selector: (row) => row.telefono2,
    },
    {
      name: "Propietario",
      selector: (row) =>
        [
          row.habitantes[0].nombre,
          row.habitantes[0].ap,
          row.habitantes[0].am,
        ].join(" "),
      sortable: true,
    },
  ];

  const handleChange = (e) => {
    const searchText = e.target.value.toLowerCase();
    const filteredData = originalRecords.filter((record: casa) =>
      record.habitantes.some((habitante: habitante) =>
        `${habitante.nombre} ${habitante.ap} ${habitante.am}`
          .toLowerCase()
          .includes(searchText)
      )
    );
    setFilteredRecords(filteredData);
  };

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
          <input
            type="text"
            onChange={handleChange}
            className={styles.inputSearch}
            placeholder="Busqueda por propietario"
          />
          <div className={styles.containerTable}>
            <DataTable
              columns={columns}
              data={filteredRecords}
              customStyles={customStyles}
              onRowClicked={handleShowEditar}
            />
          </div>
          <button className={styles.btn} onClick={handleShowAgregar}>
            Agregar
          </button>
        </div>

        <AddHouseAndPersonForm
          show={showAddForm}
          handleClose={handleCloseAgregar}
        />

        <EditHouseModal
          show={showEditForm}
          handleClose={handleCloseEditar}
          rowData={selectedRowData}
        />
      </div>
    </div>
  );
};

export default Table;

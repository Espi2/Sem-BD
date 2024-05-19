import React, { useState, useEffect } from "react";
import axios from "axios";
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
  habitantes: habitante[];
  cuota: [];
  servicio: servicio;
};

type servicio = {
  id_servicio: number;
  estacionamiento: boolean;
  porton: boolean;
  basura: boolean;
  num_casa_fk: number;
};

const Table = () => {
  const [originalRecords, setOriginalRecords] = useState<casa[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<casa[]>([]);
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
        const response = await axios.get("/api/casa/todas/");
        setOriginalRecords(response.data.casas);
        setFilteredRecords(response.data.casas);
      } catch (error) {
        console.error("Error al obtener los datos de casa:", error);
      }
    };

    fetchData();
  }, []);

  const updateCasa = async () => {
    try {
      const response = await axios.get("/api/casa/todas/");
      setOriginalRecords(response.data.casas);
      setFilteredRecords(response.data.casas);
    } catch (error) {
      console.error("Error al obtener los datos de casa:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleCheckboxChange = async (rowIndex: number, columnName: string) => {
    // Obtener la fila correspondiente
    const updatedRecords = [...originalRecords];
    const updatedRow = { ...updatedRecords[rowIndex] };

    // Modificar el valor del booleano en la columna especificada
    try {
      if (columnName === "porton") {
        await axios.patch(`/api/servicio/deCasa/${updatedRow.num_casa}`, {
          porton: !updatedRow.servicio.porton,
        });
      } else if (columnName === "estacionamiento") {
        await axios.patch(`/api/servicio/deCasa/${updatedRow.num_casa}`, {
          estacionamiento: !updatedRow.servicio.estacionamiento,
        });
      } else if (columnName === "basura") {
        await axios.patch(`/api/servicio/deCasa/${updatedRow.num_casa}`, {
          basura: !updatedRow.servicio.basura,
        });
      }
      updateCasa();
    } catch (err) {
      console.log("Error al intentar modificar servicio:", err);
    }
  };

  const columns = [
    {
      name: "Numero Casa",
      selector: (row: casa) => row.num_casa,
      sortable: true,
    },
    {
      name: "Calle",
      selector: (row: casa) => row.calle,
      sortable: true,
    },
    {
      name: "Numero Habitantes",
      selector: (row: casa) => row.num_habitantes,
      sortable: true,
    },
    {
      name: "Telefono 1",
      selector: (row: casa) => row.telefono1,
    },
    {
      name: "Telefono 2",
      selector: (row: casa) => row.telefono2,
    },
    {
      name: "Propietario",
      selector: (row: casa) =>
        row.habitantes.length > 0
          ? `${row.habitantes[0].nombre} ${row.habitantes[0].ap} ${row.habitantes[0].am}`
          : "Sin habitantes",
      sortable: true,
    },
    {
      name: "Porton",
      cell: (row: casa, rowIndex: number) => (
        <input
          type="checkbox"
          checked={row.servicio.porton}
          onChange={() => handleCheckboxChange(rowIndex, "porton")}
        />
      ),
    },
    {
      name: "Estacionamiento",
      cell: (row: casa, rowIndex: number) => (
        <input
          type="checkbox"
          checked={row.servicio.estacionamiento}
          onChange={() => handleCheckboxChange(rowIndex, "estacionamiento")}
        />
      ),
    },
    {
      name: "Basura",
      cell: (row: casa, rowIndex: number) => (
        <input
          type="checkbox"
          checked={row.servicio.basura}
          onChange={() => handleCheckboxChange(rowIndex, "basura")}
        />
      ),
    },
  ];

  const customStyles = {
    rows: {
      style: {
        minHeight: "60px",
        width: "100%",
        backgroundColor: "#e0e0e0",
        marginBottom: "1px",
        "&:hover": {
          backgroundColor: "#d0d0d0",
          cursor: "pointer",
        },
      },
    },
    headCells: {
      style: {
        paddingLeft: "8px",
        paddingRight: "8px",
        marginTop: "0%",
        backgroundColor: "#b0b0b0",
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
            placeholder="Busqueda por propietario"
          />
          <div className={styles.containerTable}>
            <DataTable
              className="dataTable"
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

        {selectedRowData && (
          <EditHouseModal
            show={showEditForm}
            handleClose={handleCloseEditar}
            rowData={selectedRowData}
          />
        )}
      </div>
    </div>
  );
};

export default Table;

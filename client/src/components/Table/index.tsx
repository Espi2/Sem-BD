import React, { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import styles from "./Table.module.css";

const Table = () => {
  const [originalRecords, setOriginalRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/casa/");
        setOriginalRecords(response.data.casas);
        setFilteredRecords(response.data.casas);
        console.log(response.data);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    fetchData();
  }, []);

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
    const filteredData = originalRecords.filter((record) =>
      record.habitantes.some((habitante) =>
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
      },
    },
    headCells: {
      style: {
        paddingLeft: "8px", // override the cell padding for head cells
        paddingRight: "8px",
        marginTop: "50%",
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
    <div>
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
          selectableRows
          onSelectedRowsChange={(data) => console.log(data)}
          fixedHeader
          customStyles={customStyles}
        />
      </div>
    </div>
  );
};

export default Table;

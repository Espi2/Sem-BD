import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Propietarios.module.css";
import DataTable from "react-data-table-component";
import AddHabitantForm from "./Forms.tsx";
import EditHabitantModal from "./editForm.tsx";

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
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPropietario, setSelectedPropietario] =
    useState<propietario | null>(null);
  const [selectedHabitante, setSelectedHabitante] = useState(null);

  const handleShowAddForm = (row) => {
    setSelectedPropietario(row);
    setShowAddForm(true);
  };

  const handleCloseAddForm = (refresh) => {
    setShowAddForm(false);
    updateData();
  };

  const handleShowEditModal = (row) => {
    setSelectedHabitante(row);
    setShowEditModal(true);
  };

  const handleCloseEditModal = (refresh) => {
    setShowEditModal(false);
    if (refresh) {
      updateData();
    }
  };

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

  const updateData = async () => {
    try {
      const response = await axios.get("/api/habitante/propietarios");
      setRecords(response.data.propietarios);

      const promises = response.data.propietarios.map(async (prop) => {
        const familyResponse = await axios.get(
          `/api/habitante/familia/${prop.num_casa_fk}`
        );
        setFamilia((prevFamilia) => ({
          ...prevFamilia,
          [prop.num_casa_fk]: familyResponse.data,
        }));
      });

      await Promise.all(promises);
    } catch (error) {
      console.error(
        "Error al obtener los datos de propietarios y familias:",
        error
      );
    }
  };

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
        minHeight: "60px",
        width: "100%",
        backgroundColor: "#e0e0e0",
        borderRadius: "10px",
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

  const innerTableCustomStyles = {
    rows: {
      style: {
        backgroundColor: "#f2f2f2",
        minHeight: "60px",
        width: "100%",
        borderRadius: "10px",
        marginBottom: "1px",
        "&:hover": {
          backgroundColor: "#d0d0d0",
          cursor: "pointer",
        },
      },
    },
    headCells: {
      style: {
        backgroundColor: "#b0b0b0",
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

  const handleRowExpand = async (expanded, row: propietario) => {
    if (expanded) {
      setExpandedRow(row.num_casa_fk);

      if (!familia[row.num_casa_fk]) {
        try {
          const response = await axios.get(
            `/api/habitante/familia/${row.num_casa_fk}`
          );
          setFamilia((prevFamilia) => ({
            ...prevFamilia,
            [row.num_casa_fk]: response.data,
          }));
          console.log(familia);
        } catch (error) {
          console.error("Error al obtener los datos de la familia:", error);
        }
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
          onRowClicked={handleShowEditModal}
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
              onRowExpandToggled={(expanded, row) =>
                handleRowExpand(expanded, row)
              }
              expandableRowExpanded={(row) => expandedRow === row.num_casa_fk}
              noDataComponent="No hay registros para mostrar"
              onRowClicked={handleShowAddForm}
            />
          </div>
        </div>
      </div>
      {selectedPropietario && (
        <AddHabitantForm
          show={showAddForm}
          handleClose={handleCloseAddForm}
          selectedPropietario={selectedPropietario}
        />
      )}

      <EditHabitantModal
        show={showEditModal}
        handleClose={handleCloseEditModal}
        rowData={selectedHabitante}
        dataFamilia={familia}
        //rowDataPropietario={expandedRow}
      />
    </div>
  );
}

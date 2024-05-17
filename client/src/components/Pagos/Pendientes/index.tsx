import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { Check2 } from "react-bootstrap-icons"; // Importa el icono de lápiz
import styles from "./Pendientes.module.css";
import IndividualCuotaForm from "./individualForm.tsx";
import GeneralCuotaForm from "./generalForm.tsx";
import LiquidarModal from "./liquidarModal.tsx";

type cuota = {
  id_cuota: number;
  monto: number;
  fecha_limite: string;
  motivo: string;
  pagado: boolean;
  num_casa_fk: number;
};

const PagosPendientes = () => {
  const [originalRecords, setOriginalRecords] = useState<cuota[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<cuota[]>([]);
  const [showGeneralForm, setShowGeneralForm] = useState(false);
  const [showIndividualForm, setShowIndividualForm] = useState(false);
  const [showConfirmar, setShowConfirmar] = useState(false);
  const [Sid_cuota, setSid_cuota] = useState();

  const handleShowGeneral = () => {
    setShowGeneralForm(true);
  };

  const handleCloseGeneral = (flag) => {
    setShowGeneralForm(false);
    if (flag) {
      updateCuotas();
    }
  };

  const handleShowIndividual = () => {
    setShowIndividualForm(true);
  };

  const handleCloseIndividual = (flag) => {
    setShowIndividualForm(false);
    if (flag) {
      updateCuotas();
    }
  };

  const handleShowConfirmar = () => {
    setShowConfirmar(true);
  };

  const handleCloseConfirmar = (flag) => {
    setShowConfirmar(false);
    if (flag) {
      updateCuotas();
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/cuota/pendientes");
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

  const updateCuotas = async () => {
    try {
      const response = await axios.get("/api/cuota/pendientes");
      let cuotas: cuota[] = response.data.cuotas;
      cuotas = cuotas.map((cuota: cuota) => ({
        ...cuota,
        fecha_limite: new Date(cuota.fecha_limite).toLocaleDateString("es-ES", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
      }));
      setOriginalRecords(cuotas);
      setFilteredRecords(cuotas);
    } catch (error) {
      console.error("Error al obtener los datos de las cuotas:", error);
    }
  };

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
    {
      name: "Liquidar",
      cell: (row) => (
        <Button
          onClick={() => {
            setSid_cuota(row.id_cuota);
            handleShowConfirmar();
          }}
          style={{
            display: "flex",
            alignItems: "center",
            height: "45px",
            width: "45px",
          }}
        >
          <Check2 size={100} />
        </Button>
      ),
      button: true,
    },
  ];

  /* 
  <Button onClick={() => handleShowEditar(row)}>
          <PencilSquare />
        </Button>
  */

  const handleChange = (e) => {
    const searchText = e.target.value.toLowerCase();
    const filteredData = originalRecords.filter((record: cuota) =>
      record.motivo.toLowerCase().includes(searchText)
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
            placeholder="Búsqueda por motivo"
          />
          <div className={styles.containerTable}>
            <DataTable
              columns={columns}
              data={filteredRecords}
              customStyles={customStyles}
            />
          </div>
          <div style={{ display: "flex" }}>
            <button className={styles.btn} onClick={handleShowGeneral}>
              Cuota general
            </button>
            <button className={styles.btn} onClick={handleShowIndividual}>
              Cuota individual
            </button>
          </div>
        </div>

        <IndividualCuotaForm
          show={showIndividualForm}
          handleClose={handleCloseIndividual}
        />

        <GeneralCuotaForm
          show={showGeneralForm}
          handleClose={handleCloseGeneral}
        />

        <LiquidarModal
          show={showConfirmar}
          handleClose={handleCloseConfirmar}
          id_cuota={Sid_cuota}
        />
      </div>
    </div>
  );
};

export default PagosPendientes;

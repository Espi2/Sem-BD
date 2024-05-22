import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import express, {
  Router,
  Request,
  Response,
  NextFunction,
  Errback,
} from "express";
const router: Router = express.Router();

type cuota = {
  monto: number;
  fecha_limite: Date;
  motivo: string;
  num_casa_fk: number;
};

router.post("/paraTodos", async (req, res) => {
  const { monto, fecha_limite, motivo } = req.body;

  // Validar los datos de entrada
  if (
    typeof monto !== "number" ||
    isNaN(new Date(fecha_limite).getTime()) ||
    typeof motivo !== "string"
  ) {
    return res.status(400).json({ error: "Datos de entrada no válidos" });
  }

  try {
    const casas = await prisma.casa.findMany();

    if (!casas || casas.length === 0) {
      return res
        .status(404)
        .json({ error: "No se encontró ninguna casa para agregar cuota" });
    }

    const cuotas: cuota[] = casas.map((casa) => ({
      monto,
      fecha_limite: new Date(fecha_limite),
      motivo,
      num_casa_fk: casa.num_casa,
    }));

    const result = await prisma.cuota.createMany({
      data: cuotas,
    });

    res.status(201).json({ message: "Cuotas creadas exitosamente", result });
  } catch (err) {
    res.status(500).json({
      error: "Fallo del servidor al procesar la solicitud",
      details: err,
    });
  }
});

router.post("/paraUno/:num_casa", async (req, res) => {
  const { monto, fecha_limite, motivo } = req.body;
  const num_casa = parseInt(req.params.num_casa);

  // Validar los datos de entrada
  if (
    typeof monto !== "number" ||
    isNaN(new Date(fecha_limite).getTime()) ||
    typeof motivo !== "string"
  ) {
    return res.status(400).json({ error: "Datos de entrada no válidos" });
  }

  try {
    const casas = await prisma.casa.findMany({
      where: {
        num_casa,
      },
    });

    if (!casas || casas.length === 0) {
      return res.status(404).json({ error: "No existe la casa" });
    }
    const casa = casas[0];

    const cuota: cuota = {
      monto,
      fecha_limite: new Date(fecha_limite),
      motivo,
      num_casa_fk: casa.num_casa,
    };

    const result = await prisma.cuota.create({ data: cuota });

    res.status(201).json({ message: "Cuotas creadas exitosamente", result });
  } catch (err) {
    res.status(500).json({
      error: "Fallo del servidor al procesar la solicitud",
      details: err,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const cuotas = await prisma.cuota.findMany({
      include: {
        casa: true,
      },
    });
    if (!cuotas || cuotas.length === 0) {
      return res.status(404).json({ error: "No se encontraron cuotas" });
    }
    res.status(200).json({ cuotas });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Fallo del servidor al recabar las cuotas", err });
  }
});

router.get("/atrasadas", async (req, res) => {
  try {
    const cuotas = await prisma.cuota.findMany({
      where: {
        pagado: false,
      },
      include: {
        casa: true,
      },
    });
    if (!cuotas || cuotas.length === 0) {
      return res.status(404);
    }

    const currDate = new Date();
    const atrasados = cuotas.filter((cuota) => cuota.fecha_limite < currDate);

    if (atrasados.length === 0) {
      return res.status(404);
    }

    res.status(200).json({ atrasados });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Fallo del servidor al recabar las cuotas", err });
  }
});

router.get("/pendientes", async (req, res) => {
  try {
    const cuotas = await prisma.cuota.findMany({
      where: {
        pagado: false,
      },
      include: {
        casa: true,
      },
    });
    if (!cuotas || cuotas.length === 0) {
      return res.status(404).json({ error: "No se encontraron habitantes" });
    }
    res.status(200).json({ cuotas });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Fallo del servidor al recabar habitante", err });
  }
});

router.get("/resueltos", async (req, res) => {
  try {
    const cuotas = await prisma.cuota.findMany({
      where: {
        pagado: true,
      },
      include: {
        casa: true,
      },
    });
    if (!cuotas || cuotas.length === 0) {
      return res.status(404).json({ error: "No se encontraron habitantes" });
    }
    res.status(200).json({ cuotas });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Fallo del servidor al recabar habitante", err });
  }
});

router.patch("/:id_cuota", async (req, res) => {
  try {
    const id_cuota: number = parseInt(req.params.id_cuota);
    const body = req.body;
    const cuota = await prisma.cuota.findUnique({
      where: {
        id_cuota,
      },
    });
    if (!cuota) {
      return res.status(404).json({ error: "No se encontraron habitantes" });
    }

    const editedCuota = await prisma.cuota.update({
      where: {
        id_cuota,
      },
      data: body,
    });

    if (!editedCuota) {
      return res.status(404).json({ error: "No se pudo modificar la cuota" });
    }
    res.status(200).json({ editedCuota });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Fallo del servidor al recabar habitante", err });
  }
});

export default router;

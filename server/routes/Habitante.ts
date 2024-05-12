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

router.post("/", async (req, res) => {
  try {
    const { nombre, ap, am, propietario, num_casa_fk } = req.body;
    const nuevoHabitante = await prisma.habitante.create({
      data: {
        nombre,
        ap,
        am,
        propietario,
        num_casa_fk,
      },
    });
    if (nuevoHabitante) {
      res.status(200).json(nuevoHabitante);
    } else {
      res.status(403).json({ error: "Mala peticion para habitante" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: "Fallo el servidor al agregar habitante", err });
  }
});

router.get("/", async (req, res) => {
  try {
    const habitantes = await prisma.habitante.findMany({
      include: {
        casa: true,
      },
    });
    if (habitantes) {
      res.status(200).json(habitantes);
    } else {
      res.status(404).json({ error: "No se encontraron habitantes" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: "Fallo del servidor al recabar habitante", err });
  }
});

router.get("/propietario/:num_casa", async (req, res) => {
  const num_casa = parseInt(req.params.num_casa);
  try {
    const casa = await prisma.casa.findUnique({
      where: {
        num_casa,
      },
    });
    if (casa) {
      const propietario = await prisma.habitante.findFirst({
        where: {
          num_casa_fk: num_casa,
          propietario: true,
        },
      });
      if (propietario) {
        res.status(200).json(propietario);
      } else {
        res.status(404).json({ error: "Propietario no encontrado" });
      }
    } else {
      res.status(404).json({ error: "Casa no encontrada" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: "Fallo del servidor al recabar el propietario", err });
  }
});

router.get("/familia/:num_casa", async (req, res) => {
  const num_casa = parseInt(req.params.num_casa);
  try {
    const casa = await prisma.casa.findUnique({
      where: {
        num_casa,
      },
    });
    if (casa) {
      const familia = await prisma.habitante.findMany({
        where: {
          num_casa_fk: num_casa,
        },
      });
      if (familia) {
        res.status(200).json(familia);
      } else {
        res.status(404).json({ error: "Familia no encontrada" });
      }
    } else {
      res.status(404).json({ error: "Casa no encontrada" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: "Fallo del servidor al obtener la familia", err });
  }
});

export default router;

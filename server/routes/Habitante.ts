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

router.get("/propietarios", async (req, res) => {
  try {
    const propietarios = await prisma.habitante.findMany({
      where: {
        propietario: true,
      },
      include: {
        casa: true,
      },
    });
    if (propietarios) {
      res.status(200).json({ propietarios });
    } else {
      res.status(404).json({ error: "No se encontraron habitantes" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: "Fallo del servidor al recabar habitante", err });
  }
});

router.get("/familias", async (req, res) => {
  try {
    const familias = await prisma.habitante.findMany({
      where: {
        propietario: false,
      },
      include: {
        casa: true,
      },
    });
    if (familias) {
      res.status(200).json({ familias });
    } else {
      res.status(404).json({ error: "No se encontraron familias" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: "Fallo del servidor al recabar familias", err });
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
          propietario: false,
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

router.patch("/habitante/:num_casa/:nombrec", async (req, res) => {
  const { num_casa, nombrec } = req.params;
  const { nombre, ap, am } = req.body;

  try {
    const updatedHabitante = await prisma.habitante.update({
      where: { num_casa_fk: parseInt(num_casa), nombre: nombrec },
      data: { nombre, ap, am },
    });

    if (updatedHabitante) {
      res.status(200).json(updatedHabitante);
    } else {
      res.status(404).json({ error: "Habitante no encontrado" });
    }
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar habitante", err });
  }
});

export default router;

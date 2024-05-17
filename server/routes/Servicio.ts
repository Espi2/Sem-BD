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

router.post("/:id", async (req, res) => {
  try {
    const id_servicio = parseInt(req.params.id);
    await prisma.servicio.create({
      data: {
        id_servicio,
        num_casa_fk: id_servicio,
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Fallo del servidor al agregar servicio", err });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id_servicio = parseInt(req.params.id);
    const servicio = prisma.servicio.findUnique({
      where: {
        id_servicio,
      },
    });
    if (!servicio) {
      res.status(404).json({ error: "No se encontro el servicio" });
    } else {
      res.status(200).json(servicio);
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: "Fallo del servidor al obtener servicio", err });
  }
});

router.get("/deCasa/:num_casa", async (req, res) => {
  const idParam = req.params.num_casa;
  try {
    const casa =
      (await prisma.casa.findUnique({
        where: {
          num_casa: parseInt(idParam),
        },
        include: {
          servicio: true,
        },
      })) || null;
    if (!casa) {
      return res.status(404).json({ error: "Casa no encontrada" });
    }
    const servicio = casa.servicio;
    res.status(200).json({ servicio });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Fallo del servidor al obtener la casa", err });
  }
});

router.patch("/deCasa/:num_casa", async (req, res) => {
  const idParam = req.params.num_casa;
  try {
    const casa =
      (await prisma.casa.findUnique({
        where: {
          num_casa: parseInt(idParam),
        },
        include: {
          servicio: true,
        },
      })) || null;
    if (!casa) {
      return res.status(404).json({ error: "Casa no encontrada" });
    }

    const nuevoServicio = await prisma.servicio.update({
      where: {
        num_casa_fk: parseInt(idParam),
      },
      data: req.body,
    });
    if (!nuevoServicio) {
      return res
        .status(500)
        .json({ error: "No se pudo actualizar el servicio" });
    }

    res.status(200).json({ servicio: nuevoServicio });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Fallo del servidor al obtener la casa", err });
  }
});

export default router;

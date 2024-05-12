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

export default router;

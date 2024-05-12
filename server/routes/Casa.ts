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

router.get("/", async (req: Request, res: Response) => {
  try {
    const casas = await prisma.casa.findMany({
      include: {
        habitantes: true,
        cuota: true,
        servicio: true,
      },
    });
    if (casas) {
      res.status(200).json({ casas });
    } else {
      res.status(404).json({ error: "No se encontro ninguna casa" });
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: "Fallo del servidor al obtener las casas", err });
  }
});

router.get("/:num_casa", async (req, res) => {
  const idParam = req.params.num_casa;
  try {
    const casa =
      (await prisma.casa.findUnique({
        where: {
          num_casa: parseInt(idParam),
        },
        include: {
          habitantes: true,
          cuota: true,
          servicio: true,
        },
      })) || null;
    if (!casa) {
      res.status(404).json({ error: "Casa no encontrada" });
    } else {
      res.status(200).json(casa);
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: "Fallo del servidor al obtener la casa", err });
  }
});

router.post("/", async (req, res) => {
  try {
    const { num_casa, calle, num_habitantes, telefono1, telefono2, servicio } =
      req.body;
    console.log(servicio.num_casa_fk);
    const nuevaCasa = await prisma.casa.create({
      data: {
        num_casa,
        calle,
        num_habitantes,
        telefono1,
        telefono2,
      },
    });

    if (nuevaCasa) {
      servicio.num_casa_fk = num_casa;
      const nuevoServicio = await prisma.servicio.create({
        data: servicio,
      });

      if (nuevoServicio) {
        res.status(200).json({ casa: nuevaCasa, servicio: nuevoServicio });
      } else {
        res.status(403).json({ error: "Mala peticion para servicio" });
      }
    } else {
      res.status(403).json({ error: "Mala peticion para casa" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Hubo un error al crear la casa", err });
  }
});

router.patch("/:num_casa", async (req, res) => {
  try {
    const num_casa = parseInt(req.params.num_casa);

    const casa = await prisma.casa.findUnique({
      where: {
        num_casa,
      },
    });

    if (casa) {
      const casaModificada = await prisma.casa.update({
        where: {
          num_casa,
        },
        data: req.body,
      });
      if (casaModificada) {
        res.status(200).json(casaModificada);
      } else {
        res.status(403).json({ error: "Mala peticion" });
      }
    } else {
      res.status(404).json({ error: "Casa no encontrada" });
    }
  } catch (err) {}
});

router.delete("/:id", (req, res) => {
  res.send({ data: "Se borro tu data" });
});

export default router;

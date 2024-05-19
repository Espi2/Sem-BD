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

router.get("/todas/", async (req: Request, res: Response) => {
  try {
    const casas = await prisma.casa.findMany({
      include: {
        habitantes: {
          where: {
            propietario: true,
          },
        },
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
        console.log("Servicio");
      }
    } else {
      res.status(403).json({ error: "Mala peticion para casa" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Hubo un error al crear la casa", err });
  }
});

router.post("/casa_y_propietario", async (req, res) => {
  const { num_casa, calle, telefono1, telefono2, propietario } = req.body;

  try {
    await prisma.$transaction(async (prisma) => {
      const nuevaCasa = await prisma.casa.create({
        data: {
          num_casa,
          calle,
          num_habitantes: 1,
          telefono1,
          telefono2,
        },
      });

      const nuevoPropietario = await prisma.habitante.create({
        data: {
          nombre: propietario.nombre,
          ap: propietario.ap,
          am: propietario.am,
          num_casa_fk: num_casa,
          propietario: true,
        },
      });

      const nuevoServicio = await prisma.servicio.create({
        data: {
          num_casa_fk: num_casa,
          porton: true,
          basura: true,
          estacionamiento: true,
        },
      });

      return { nuevaCasa, nuevoPropietario, nuevoServicio };
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
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

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

import * as bcrypt from "bcrypt";

import express, {
  Router,
  Request,
  Response,
  NextFunction,
  Errback,
} from "express";
const router: Router = express.Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { nombre, ap, am, usuario, contrasena } = req.body;
    const hashedPassword = await maskPassword(contrasena);
    await prisma.administrador.create({
      data: {
        usuario,
        contrasena: hashedPassword,
        nombre,
        ap,
        am,
      },
    });
    res.status(200).json({ nombre, ap, am, usuario, hashedPassword });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Fallo del servidor al crear administrador" });
  }
});

router.get("/:usuario/:contrasena", async (req: Request, res: Response) => {
  try {
    const { usuario, contrasena } = req.params;
    const admin =
      (await prisma.administrador.findUnique({
        where: {
          usuario,
        },
      })) || null;
    if (!admin) {
      res.status(404).json({ error: "No se encontro el administrador" });
    } else {
      const isMatch = await bcrypt.compare(contrasena, admin.contrasena);
      if (!isMatch) {
        res.status(403).json({ error: "Contrasena incorrecta" });
      } else {
        res.status(200).json({
          message: "Autenticacion correcta",
          nombre: admin.nombre,
          ap: admin.ap,
          am: admin.am,
        });
      }
    }
  } catch (error) {
    res.status(500).json({ error: "Fallo del servidor al autenticar" });
  }
});

const maskPassword = async (password: string) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

export default router;

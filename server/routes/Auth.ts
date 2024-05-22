import express, { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const router: Router = express.Router();
const prisma = new PrismaClient();

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
    res.status(200).json({ nombre, ap, am, usuario });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Fallo del servidor al crear administrador" });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { usuario, contrasena } = req.body;
    const admin = await prisma.administrador.findUnique({
      where: {
        usuario,
      },
    });
    if (!admin) {
      res.status(404).json({ error: "No se encontró el administrador" });
    } else {
      const isMatch = await bcrypt.compare(contrasena, admin.contrasena);
      if (!isMatch) {
        res.status(403).json({ error: "Contraseña incorrecta" });
      } else {
        res.status(200).json({
          message: "Autenticación correcta",
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

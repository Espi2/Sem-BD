const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const express = require("express");
const router = express.Router();

router.use(express.json());

router.get("/", async (req, res) => {
  const casa = await prisma.casa.findMany({
    include: {
      inquilinos: true,
      servicios: true,
    },
  });
  console.log("Todos");
  res.status(200).json(casa);
});

router.get("/:id", async (req, res) => {
  const idParam = req.params.id;
  const casa = await prisma.casa.findUnique({
    where: {
      id: parseInt(idParam),
    },
    include: {
      inquilinos: true,
      servicios: true,
    },
  });
  if (!casa) {
    return res.status(404).json({ error: "Casa no encontrada" });
  }
  console.log("Solo uno");
  res.status(200).json(casa);
});

router.post("/", async (req, res) => {
  try {
    const nuevaCasa = await prisma.casa.create({
      data: req.body,
    });
    res.json(nuevaCasa);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Hubo un error al crear la casa" });
  }
});

router.put("/", (req, res) => {
  res.send({ data: "Se modifico tu data" });
});

router.delete("/", (req, res) => {
  res.send({ data: "Se borro tu data" });
});

module.exports = router;

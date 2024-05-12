import express, { Express, Request, Response } from "express";
import cors from "cors";

const app: Express = express();
const port = process.env.PORT || 3500;

import authRoute from "./routes/Auth";
import casaRoute from "./routes/Casa";
import servicioRoute from "./routes/Servicio";
import habitanteRoute from "./routes/Habitante";

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoute);
app.use("/api/casa", casaRoute);
app.use("/api/servicio", servicioRoute);
app.use("/api/habitante", habitanteRoute);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Hola desde express (Con TypeScript) en /" });
});
app.get("/hola", (req: Request, res: Response) => {
  res.send({ message: "Hola desde express (Con TypeScript)" });
});

app.listen(port, () => console.log("Server running on port:", port));

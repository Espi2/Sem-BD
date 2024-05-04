const express = require("express");
const app = express();
const port = process.env.PORT || 3500;

const casaRoute = require("./routes/Casa");

app.use("/casa", casaRoute);

app.listen(port, () => console.log("Server running"));

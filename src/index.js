const express = require("express");
const RouteLoader = require("./api/route/RouteLoader.js");
const UserController = require("./api/controller/v1/UserController.js");
//const DB = require("./infra/db/test-prisma.js");

const app = express();
const port = process.env.PORT || 3000;

RouteLoader.load(app, [UserController]);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

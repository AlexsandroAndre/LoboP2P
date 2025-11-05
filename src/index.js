const express = require("express");
const RouteLoader = require("./api/route/RouteLoader.js");
const UserController = require("./api/controller/v1/UserController.js");
//const DB = require("./infra/db/test-prisma.js");

const app = express();

// Middleware para parsing JSON
app.use(express.json());

RouteLoader.load(app, [UserController]);

// Exportar o app para ser usado pelo start.js
module.exports = app;

const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "LoboP2P API",
      version: "1.0.0",
      description: "Documentação das APIs do projeto LoboP2P",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor local",
      },
    ],
  },
  apis: ["./src/api/controllers/v1/*.js"], // arquivos que contêm os comentários @swagger
};

// Gera o JSON do Swagger
const specs = swaggerJsdoc(options);

// Função para integrar ao Express
function setupSwagger(app) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
  console.log("Swagger rodando em /api-docs");
}

module.exports = setupSwagger;

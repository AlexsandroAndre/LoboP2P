const express = require("express");
const swaggerUi = require("swagger-ui-express");

class RouteLoader {
  /**
   * Registra os controllers no app e gera Swagger automaticamente
   * @param {Express} app 
   * @param {Array} controllers - Lista de classes de controllers
   */
  static load(app, controllers) {
    const paths = {};
    const tags = [];

    controllers.forEach(ControllerClass => {
      const controller = new ControllerClass();
      const router = express.Router();
      const basePath = controller.getBasePath();
      const controllerName = controller.constructor.name; // Nome do controller

      // Adiciona tag do controller no Swagger
      tags.push({
        name: controllerName,
        description: controller.swaggerDescription || `Rotas de ${controllerName}`,
      });

      const globalMiddlewares = controller.middlewares || [];

      controller.getRoutes().forEach(({ method, path, handler, middlewares = [] }) => {
        // Rota final com middlewares
        router[method](path, ...globalMiddlewares, ...middlewares, handler.bind(controller));

        // Construir caminho completo
        const fullPath = basePath + path;

        // Criar entry do Swagger
        if (!paths[fullPath]) paths[fullPath] = {};
        paths[fullPath][method] = {
          summary: `Endpoint ${method.toUpperCase()} ${fullPath}`,
          tags: [controllerName],
          parameters: RouteLoader.extractPathParams(path),
          responses: { 200: { description: "Sucesso" } },
        };
      });

      app.use(basePath, router);
      console.log(`Rotas carregadas: ${basePath}`);
    });

    // Integrar Swagger no Express
    const swaggerSpec = {
      openapi: "3.0.0",
      info: {
        title: "LoboP2P API",
        version: "1.0.0",
        description: "Documentação gerada automaticamente pelo RouteLoader",
      },
      servers: [{ url: "http://localhost:3000" }],
      tags,
      paths,
    };

    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log("Swagger rodando em /api-docs");
  }

  /**
   * Extrai parâmetros da rota tipo /detalhe/:id
   */
  static extractPathParams(path) {
    const params = [];
    const regex = /:([a-zA-Z0-9_]+)/g;
    let match;
    while ((match = regex.exec(path)) !== null) {
      params.push({
        name: match[1],
        in: "path",
        required: true,
        schema: { type: "string" },
        description: `Parâmetro ${match[1]}`,
      });
    }
    return params.length ? params : undefined;
  }
}

module.exports = RouteLoader;

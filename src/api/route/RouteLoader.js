const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const path = require("path");

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

      // Adiciona tag do controller no Swagger (usar nome customizado se disponível)
      const tagName = controller.swaggerTag || "Users";
      const existingTag = tags.find(t => t.name === tagName);
      if (!existingTag) {
        tags.push({
          name: tagName,
          description: controller.swaggerDescription || `Rotas de ${tagName}`,
        });
      }

      const globalMiddlewares = controller.middlewares || [];

      controller.getRoutes().forEach(({ method, path, handler, middlewares = [], swaggerConfig }) => {
        // Rota final com middlewares
        router[method](path, ...globalMiddlewares, ...middlewares, handler.bind(controller));

        // Construir caminho completo
        const fullPath = basePath + path;

        // Criar entry do Swagger
        if (!paths[fullPath]) paths[fullPath] = {};
        
        // Se houver configuração Swagger customizada, usar ela
        // Se não houver, deixar vazio para que a annotation JSDoc seja usada
        const defaultTag = controller.swaggerTag || "Users";
        if (swaggerConfig) {
          paths[fullPath][method] = {
            ...swaggerConfig,
            tags: swaggerConfig.tags || [defaultTag],
            parameters: swaggerConfig.parameters || RouteLoader.extractPathParams(path),
          };
        }
        // Não criar entrada automática se não houver swaggerConfig
        // A annotation JSDoc será usada pelo swagger-jsdoc
      });

      app.use(basePath, router);
      console.log(`Rotas carregadas: ${basePath}`);
    });

    const port = process.env.PORT || 3000;
    const baseUrl =
      process.env.RAILWAY_PUBLIC_DOMAIN
        ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
        : `http://localhost:${port}`;

    // Gerar Swagger a partir de JSDoc annotations
    const swaggerJsdocOptions = {
      definition: {
        openapi: "3.0.0",
        info: {
          title: "LoboP2P API",
          version: "1.0.0",
          description: "Documentação gerada automaticamente pelo RouteLoader",
        },
        servers: [{ url: baseUrl }],
        tags,
      },
      apis: [path.join(__dirname, "../controller/**/*.js")],
    };

    const swaggerSpecFromJSDoc = swaggerJsdoc(swaggerJsdocOptions);

    // Mesclar paths do swaggerConfig manual com paths do JSDoc
    // Converter paths do Express (:id) para formato OpenAPI ({id})
    const normalizePath = (expressPath) => {
      return expressPath.replace(/:([a-zA-Z0-9_]+)/g, '{$1}');
    };

    const mergedPaths = {};
    const jsdocPaths = swaggerSpecFromJSDoc.paths || {};
    
    // Primeiro, adicionar paths do swaggerConfig manual (convertendo formato)
    Object.keys(paths).forEach((pathKey) => {
      const normalizedKey = normalizePath(pathKey);
      mergedPaths[normalizedKey] = paths[pathKey];
    });
    
    // Depois, adicionar/sobrescrever com paths do JSDoc (que têm prioridade)
    Object.keys(jsdocPaths).forEach((pathKey) => {
      mergedPaths[pathKey] = {
        ...mergedPaths[pathKey],
        ...jsdocPaths[pathKey],
      };
    });

    const finalSwaggerSpec = {
      ...swaggerSpecFromJSDoc,
      paths: mergedPaths,
      tags,
      components: {
        ...swaggerSpecFromJSDoc.components,
        schemas: {
          ...swaggerSpecFromJSDoc.components?.schemas,
          User: {
            type: "object",
            properties: {
              user_id: {
                type: "string",
                format: "uuid",
                description: "ID único do usuário",
                example: "56fd7913-979a-4d78-b791-60a56503652c"
              },
              email: {
                type: "string",
                format: "email",
                description: "Email do usuário",
                example: "usuario@example.com"
              },
              created_at: {
                type: "string",
                format: "date-time",
                description: "Data de criação do usuário"
              },
              updated_at: {
                type: "string",
                format: "date-time",
                description: "Data de última atualização do usuário"
              }
            },
            required: ["user_id", "email", "created_at", "updated_at"]
          },
          Pagination: {
            type: "object",
            properties: {
              currentPage: {
                type: "integer",
                description: "Página atual",
                example: 1
              },
              totalPages: {
                type: "integer",
                description: "Total de páginas",
                example: 2
              },
              totalItems: {
                type: "integer",
                description: "Total de itens",
                example: 20
              },
              itemsPerPage: {
                type: "integer",
                description: "Itens por página",
                example: 10
              },
              hasNextPage: {
                type: "boolean",
                description: "Indica se há próxima página",
                example: true
              },
              hasPreviousPage: {
                type: "boolean",
                description: "Indica se há página anterior",
                example: false
              }
            },
            required: ["currentPage", "totalPages", "totalItems", "itemsPerPage", "hasNextPage", "hasPreviousPage"]
          },
          ErrorResponse: {
            type: "object",
            properties: {
              error: {
                type: "string",
                description: "Tipo do erro",
                example: "Dados inválidos"
              },
              message: {
                type: "string",
                description: "Mensagem de erro",
                example: "Email e password_hash são obrigatórios"
              }
            },
            required: ["error", "message"]
          }
        }
      }
    };

    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(finalSwaggerSpec));
    console.log(`Swagger rodando em ${baseUrl}/api-docs`);
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

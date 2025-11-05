const BaseController = require("../base/BaseController.js");
const CreateUserUseCase = require("../../../application/useCases/CreateUserUseCase");
const CreateUserRequest = require("../../../application/dtos/CreateUserRequest");
const ListUsersUseCase = require("../../../application/useCases/ListUsersUseCase");
const ListUsersRequest = require("../../../application/dtos/ListUsersRequest");
const GetUserByIdUseCase = require("../../../application/useCases/GetUserByIdUseCase");
const PrismaUserRepository = require("../../../infrastructure/repositories/PrismaUserRepository");

const userRepository = new PrismaUserRepository();
const createUserUseCase = new CreateUserUseCase(userRepository);
const listUsersUseCase = new ListUsersUseCase(userRepository);
const getUserByIdUseCase = new GetUserByIdUseCase(userRepository);

function authMiddleware(req, res, next) {
  console.log("Autenticando...");
  next();
}

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Rotas de usuários
 */
class UserController extends BaseController {
  constructor() {
    super("users", "v1");

    this.swaggerDescription = "Rotas de usuários";
    this.swaggerTag = "Users";
    this.middlewares = [authMiddleware];
  }

  getRoutes() {
    return [
      {
        method: "get",
        path: "/listar",
        handler: this.listar,
        swaggerConfig: {
          summary: "Lista usuários com paginação",
          tags: ["Users"],
          parameters: [
            {
              name: "email",
              in: "query",
              required: false,
              schema: {
                type: "string",
                format: "email",
              },
              description: "Filtrar por email (busca parcial)",
              example: "teste@example.com",
            },
            {
              name: "page",
              in: "query",
              required: false,
              schema: {
                type: "integer",
                minimum: 1,
                default: 1,
              },
              description: "Número da página",
              example: 1,
            },
            {
              name: "limit",
              in: "query",
              required: false,
              schema: {
                type: "integer",
                minimum: 1,
                maximum: 100,
                default: 10,
              },
              description: "Quantidade de itens por página (10, 50, etc)",
              example: 10,
            },
          ],
          responses: {
            200: {
              description: "Lista de usuários retornada com sucesso",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string" },
                      data: {
                        type: "object",
                        properties: {
                          users: {
                            type: "array",
                            items: {
                              type: "object",
                              properties: {
                                user_id: { type: "string" },
                                email: { type: "string" },
                                created_at: { type: "string", format: "date-time" },
                                updated_at: { type: "string", format: "date-time" },
                              },
                            },
                          },
                          pagination: {
                            type: "object",
                            properties: {
                              currentPage: { type: "integer" },
                              totalPages: { type: "integer" },
                              totalItems: { type: "integer" },
                              itemsPerPage: { type: "integer" },
                              hasNextPage: { type: "boolean" },
                              hasPreviousPage: { type: "boolean" },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            400: {
              description: "Dados inválidos",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: { type: "string" },
                      message: { type: "string" },
                    },
                  },
                },
              },
            },
            500: {
              description: "Erro interno do servidor",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: { type: "string" },
                      message: { type: "string" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      {
        method: "get",
        path: "/detalhe/:id",
        handler: this.detalhe,
      },
      { 
        method: "post", 
        path: "/criar", 
        handler: this.criar,
        swaggerConfig: {
          summary: "Cria um novo usuário",
          tags: ["Users"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "password_hash"],
                  properties: {
                    email: {
                      type: "string",
                      format: "email",
                      description: "Email do usuário",
                      example: "usuario@example.com"
                    },
                    password_hash: {
                      type: "string",
                      description: "Hash da senha do usuário",
                      example: "hash123456"
                    }
                  }
                }
              }
            }
          },
          responses: {
            201: {
              description: "Usuário criado com sucesso",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string" },
                      data: {
                        type: "object",
                        properties: {
                          user_id: { type: "string" },
                          email: { type: "string" },
                          created_at: { type: "string", format: "date-time" },
                          updated_at: { type: "string", format: "date-time" }
                        }
                      }
                    }
                  }
                }
              }
            },
            400: {
              description: "Dados inválidos",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: { type: "string" },
                      message: { type: "string" }
                    }
                  }
                }
              }
            },
            409: {
              description: "Email já existe",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      error: { type: "string" },
                      message: { type: "string" }
                    }
                  }
                }
              }
            },
            500: {
              description: "Erro interno do servidor"
            }
          }
        }
      },
    ];
  }

  /**
   * @swagger
   * /api/v1/users/listar:
   *   get:
   *     summary: Lista usuários com paginação
   *     tags: [Users]
   *     parameters:
   *       - in: query
   *         name: email
   *         required: false
   *         schema:
   *           type: string
   *         description: Filtrar por email (busca parcial)
   *         example: teste@example.com
   *       - in: query
   *         name: page
   *         required: false
   *         schema:
   *           type: integer
   *           minimum: 1
   *           default: 1
   *         description: Número da página
   *         example: 1
   *       - in: query
   *         name: limit
   *         required: false
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 100
   *           default: 10
   *         description: Quantidade de itens por página
   *         example: 10
   *     responses:
   *       200:
   *         description: Lista de usuários retornada com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Usuários listados com sucesso
   *                 data:
   *                   type: object
   *                   properties:
   *                     users:
   *                       type: array
   *                       items:
   *                         $ref: '#/components/schemas/User'
   *                     pagination:
   *                       $ref: '#/components/schemas/Pagination'
   *       400:
   *         description: Dados inválidos
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *             example:
   *               error: Dados inválidos
   *               message: Page deve ser maior ou igual a 1
   *       500:
   *         description: Erro interno do servidor
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *             example:
   *               error: Erro interno do servidor
   *               message: Não foi possível listar os usuários
   */
  /**
   * @Branch
   * GET /api/v1/users/listar
   * Lista usuários com paginação e filtro por email
   */
  async listar(req, res) {
    try {
      const request = ListUsersRequest.fromQuery(req.query);
      const result = await listUsersUseCase.execute(request);

      if (result.success) {
        return res.status(result.statusCode).json({
          message: "Usuários listados com sucesso",
          data: result.data,
        });
      }

      return res.status(result.statusCode).json({
        error: result.error,
        message: result.message,
      });
    } catch (error) {
      console.error("Erro ao listar usuários:", error);
      return res.status(500).json({
        error: "Erro interno do servidor",
        message: "Não foi possível listar os usuários",
      });
    }
  }

  /**
   * @swagger
   * /api/v1/users/detalhe/{id}:
   *   get:
   *     summary: Busca detalhe de um usuário por ID
   *     tags: [Users]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID do usuário
   *         example: 56fd7913-979a-4d78-b791-60a56503652c
   *     responses:
   *       200:
   *         description: Usuário encontrado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Usuário encontrado com sucesso
   *                 data:
   *                   $ref: '#/components/schemas/User'
   *       400:
   *         description: Dados inválidos
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *             example:
   *               error: Dados inválidos
   *               message: ID do usuário é obrigatório
   *       404:
   *         description: Usuário não encontrado
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *             example:
   *               error: Não encontrado
   *               message: Usuário não encontrado
   *       500:
   *         description: Erro interno do servidor
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *             example:
   *               error: Erro interno do servidor
   *               message: Não foi possível buscar o usuário
   */
  /**
   * @Branch
   * GET /api/v1/users/detalhe/{id}
   * Busca usuário por ID e valida se existe
   */
  async detalhe(req, res) {
    try {
      const { id } = req.params;
      const result = await getUserByIdUseCase.execute(id);

      if (result.success) {
        return res.status(result.statusCode).json({
          message: "Usuário encontrado com sucesso",
          data: result.data,
        });
      }

      return res.status(result.statusCode).json({
        error: result.error,
        message: result.message,
      });
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      return res.status(500).json({
        error: "Erro interno do servidor",
        message: "Não foi possível buscar o usuário",
      });
    }
  }

  /**
   * @swagger
   * /api/v1/users/criar:
   *   post:
   *     summary: Cria um novo usuário
   *     tags: [Users]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password_hash
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *                 description: Email do usuário
   *                 example: usuario@example.com
   *               password_hash:
   *                 type: string
   *                 description: Hash da senha do usuário
   *                 example: hash123456
   *     responses:
   *       201:
   *         description: Usuário criado com sucesso
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Usuário criado com sucesso
   *                 data:
   *                   $ref: '#/components/schemas/User'
   *       400:
   *         description: Dados inválidos
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *             example:
   *               error: Dados inválidos
   *               message: Email e password_hash são obrigatórios
   *       409:
   *         description: Email já existe
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *             example:
   *               error: Conflito
   *               message: Email já cadastrado
   *       500:
   *         description: Erro interno do servidor
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *             example:
   *               error: Erro interno do servidor
   *               message: Não foi possível criar o usuário
   */

  /**
   * @Branch
   * POST /api/v1/users/criar
   * Valida email e password_hash antes de processar
   */
  async criar(req, res) {
    try {
      const request = CreateUserRequest.fromJSON(req.body);
      const result = await createUserUseCase.execute(request);

      if (result.success) {
        return res.status(result.statusCode).json({
          message: "Usuário criado com sucesso",
          data: result.data,
        });
      }

      return res.status(result.statusCode).json({
        error: result.error,
        message: result.message,
      });
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      return res.status(500).json({
        error: "Erro interno do servidor",
        message: "Não foi possível criar o usuário",
      });
    }
  }
}
module.exports = UserController;
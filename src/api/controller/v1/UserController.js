const BaseController = require("../base/BaseController.js");

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
    this.middlewares = [authMiddleware];
  }

  getRoutes() {
    return [
      { method: "get", path: "/listar", handler: this.listar },
      { method: "get", path: "/detalhe/:id", handler: this.detalhe },
    ];
  }

  /**
   * @swagger
   * /api/v1/users/listar:
   *   get:
   *     summary: Lista todos os usuários
   *     tags: [Users]
   *     responses:
   *       200:
   *         description: Lista de usuários
   */

  listar(req, res) {
    res.json({ message: "Listando usuários" });
  }

  /**
   * @swagger
   * /api/v1/users/detalhe/{id}:
   *   get:
   *     summary: Detalhe de um usuário
   *     tags: [Users]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID do usuário
   *     responses:
   *       200:
   *         description: Detalhe do usuário
   */

  detalhe(req, res) {
    res.json({ message: `Detalhe do usuário ${req.params.id}` });
  }
}
module.exports = UserController;
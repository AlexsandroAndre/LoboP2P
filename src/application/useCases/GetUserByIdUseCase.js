class GetUserByIdUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(user_id) {
    if (!user_id) {
      return {
        success: false,
        statusCode: 400,
        error: "Dados inválidos",
        message: "ID do usuário é obrigatório",
      };
    }

    try {
      const user = await this.userRepository.findById(user_id);

      if (!user) {
        return {
          success: false,
          statusCode: 404,
          error: "Não encontrado",
          message: "Usuário não encontrado",
        };
      }

      return {
        success: true,
        statusCode: 200,
        data: user.toJSON(),
      };
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      return {
        success: false,
        statusCode: 500,
        error: "Erro interno do servidor",
        message: "Não foi possível buscar o usuário",
      };
    }
  }
}

module.exports = GetUserByIdUseCase;


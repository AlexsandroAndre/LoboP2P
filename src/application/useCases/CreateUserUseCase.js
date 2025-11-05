const User = require("../../domain/entities/User");

class CreateUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(request) {
    const validation = request.validate();
    
    if (!validation.isValid) {
      return {
        success: false,
        statusCode: 400,
        error: "Dados inválidos",
        message: validation.errors.join(", "),
      };
    }

    const existingUser = await this.userRepository.findByEmail(request.email);
    
    if (existingUser) {
      return {
        success: false,
        statusCode: 409,
        error: "Conflito",
        message: "Email já cadastrado",
      };
    }

    try {
      const user = User.create(request.email, request.password_hash);
      const createdUser = await this.userRepository.create(user);

      return {
        success: true,
        statusCode: 201,
        data: createdUser.toJSON(),
      };
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      return {
        success: false,
        statusCode: 500,
        error: "Erro interno do servidor",
        message: "Não foi possível criar o usuário",
      };
    }
  }
}

module.exports = CreateUserUseCase;


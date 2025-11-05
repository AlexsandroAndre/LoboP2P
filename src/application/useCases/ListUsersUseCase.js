class ListUsersUseCase {
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

    try {
      const skip = request.getSkip();
      const take = request.getTake();
      const email = request.email || null;

      const [users, total] = await Promise.all([
        this.userRepository.findWithPagination(email, skip, take),
        this.userRepository.count(email),
      ]);

      const totalPages = Math.ceil(total / take);
      const currentPage = request.page;

      return {
        success: true,
        statusCode: 200,
        data: {
          users: users.map((user) => user.toJSON()),
          pagination: {
            currentPage,
            totalPages,
            totalItems: total,
            itemsPerPage: take,
            hasNextPage: currentPage < totalPages,
            hasPreviousPage: currentPage > 1,
          },
        },
      };
    } catch (error) {
      console.error("Erro ao listar usuários:", error);
      return {
        success: false,
        statusCode: 500,
        error: "Erro interno do servidor",
        message: "Não foi possível listar os usuários",
      };
    }
  }
}

module.exports = ListUsersUseCase;


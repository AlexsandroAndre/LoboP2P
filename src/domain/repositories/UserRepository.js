class UserRepository {
  async create(user) {
    throw new Error("Method create must be implemented");
  }

  async findByEmail(email) {
    throw new Error("Method findByEmail must be implemented");
  }

  async findById(user_id) {
    throw new Error("Method findById must be implemented");
  }

  async findAll() {
    throw new Error("Method findAll must be implemented");
  }

  async findWithPagination(email, skip, take) {
    throw new Error("Method findWithPagination must be implemented");
  }

  async count(email) {
    throw new Error("Method count must be implemented");
  }
}

module.exports = UserRepository;


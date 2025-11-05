class ListUsersRequest {
  constructor(email, page, limit) {
    this.email = email || null;
    this.page = page || 1;
    this.limit = limit || 10;
  }

  static fromQuery(query) {
    const email = query.email || null;
    const page = query.page ? parseInt(query.page, 10) : 1;
    const limit = query.limit ? parseInt(query.limit, 10) : 10;

    return new ListUsersRequest(email, page, limit);
  }

  validate() {
    const errors = [];

    if (this.page < 1) {
      errors.push("Page deve ser maior ou igual a 1");
    }

    if (this.limit < 1) {
      errors.push("Limit deve ser maior ou igual a 1");
    }

    if (this.limit > 100) {
      errors.push("Limit não pode ser maior que 100");
    }

    if (this.email && this.email.trim().length === 0) {
      errors.push("Email não pode estar vazio");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  getSkip() {
    return (this.page - 1) * this.limit;
  }

  getTake() {
    return this.limit;
  }
}

module.exports = ListUsersRequest;


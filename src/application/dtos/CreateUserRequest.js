class CreateUserRequest {
  constructor(email, password_hash) {
    this.email = email;
    this.password_hash = password_hash;
  }

  static fromJSON(body) {
    if (!body) {
      return new CreateUserRequest(null, null);
    }
    return new CreateUserRequest(body.email || null, body.password_hash || null);
  }

  validate() {
    const errors = [];

    if (!this.email) {
      errors.push("Email é obrigatório");
    } else if (!this.isValidEmail(this.email)) {
      errors.push("Email inválido");
    }

    if (!this.password_hash) {
      errors.push("Password hash é obrigatório");
    } else if (this.password_hash.length < 6) {
      errors.push("Password hash deve ter no mínimo 6 caracteres");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

module.exports = CreateUserRequest;


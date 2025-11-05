class User {
  constructor(user_id, email, password_hash, created_at, updated_at) {
    this.user_id = user_id;
    this.email = email;
    this.password_hash = password_hash;
    this.created_at = created_at;
    this.updated_at = updated_at;
  }

  static create(email, password_hash) {
    return new User(
      null,
      email,
      password_hash,
      new Date(),
      new Date()
    );
  }

  toJSON() {
    return {
      user_id: this.user_id,
      email: this.email,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}

module.exports = User;


const UserRepository = require("../../domain/repositories/UserRepository");
const User = require("../../domain/entities/User");
const { PrismaClient } = require("../../../prisma/src/generated/prisma");

class PrismaUserRepository extends UserRepository {
  constructor() {
    super();
    this.prisma = new PrismaClient();
  }

  async create(user) {
    const prismaUser = await this.prisma.user.create({
      data: {
        email: user.email,
        password_hash: user.password_hash,
      },
    });

    return new User(
      prismaUser.user_id,
      prismaUser.email,
      prismaUser.password_hash,
      prismaUser.created_at,
      prismaUser.updated_at
    );
  }

  async findByEmail(email) {
    const prismaUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!prismaUser) {
      return null;
    }

    return new User(
      prismaUser.user_id,
      prismaUser.email,
      prismaUser.password_hash,
      prismaUser.created_at,
      prismaUser.updated_at
    );
  }

  async findById(user_id) {
    const prismaUser = await this.prisma.user.findUnique({
      where: { user_id },
    });

    if (!prismaUser) {
      return null;
    }

    return new User(
      prismaUser.user_id,
      prismaUser.email,
      prismaUser.password_hash,
      prismaUser.created_at,
      prismaUser.updated_at
    );
  }

  async findAll() {
    const prismaUsers = await this.prisma.user.findMany({
      orderBy: { created_at: "desc" },
    });

    return prismaUsers.map(
      (u) =>
        new User(
          u.user_id,
          u.email,
          u.password_hash,
          u.created_at,
          u.updated_at
        )
    );
  }

  async findWithPagination(email, skip, take) {
    const where = email
      ? {
          email: {
            contains: email,
          },
        }
      : {};

    const prismaUsers = await this.prisma.user.findMany({
      where,
      skip,
      take,
      orderBy: { created_at: "desc" },
    });

    return prismaUsers.map(
      (u) =>
        new User(
          u.user_id,
          u.email,
          u.password_hash,
          u.created_at,
          u.updated_at
        )
    );
  }

  async count(email) {
    const where = email
      ? {
          email: {
            contains: email,
          },
        }
      : {};

    return await this.prisma.user.count({
      where,
    });
  }
}

module.exports = PrismaUserRepository;


const { PrismaClient } = require("../../generated/prisma");


const prisma = new PrismaClient();

async function testConnection() {
  try {
    await prisma.$connect();
    console.log("Conexão com o banco ok!");
  } catch (err) {
    console.error("Erro de conexão:", err);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();

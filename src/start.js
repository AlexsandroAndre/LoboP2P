const { PrismaClient } = require("../prisma/src/generated/prisma");
const app = require("./index"); // seu Express app
const prisma = new PrismaClient();

async function start() {
  try {
    // Conectar ao banco
    await prisma.$connect();
    console.log("Banco conectado com sucesso!");

    // As migrations já foram rodadas pelo Dockerfile antes de iniciar
    // Iniciar servidor Express
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(` Servidor rodando na porta ${port}`);
    });

  } catch (err) {
    console.error("Erro ao conectar ao banco:", err);
    process.exit(1);
  }
}

start();

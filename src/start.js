const { PrismaClient } = require("./generated/prisma");
const app = require("./index"); // seu Express app
const prisma = new PrismaClient();

async function start() {
  try {
    // Conectar ao banco
    await prisma.$connect();
    console.log("Banco conectado");

    // Rodar migrations programaticamente no runtime
    const { exec } = require("child_process");
    exec("npx prisma migrate deploy", (err, stdout, stderr) => {
      if (err) {
        console.error("Erro ao rodar migrate:", err);
      } else {
        console.log("Migrations aplicadas:");
        console.log(stdout);
        if (stderr) console.error(stderr);
      }

      // Iniciar servidor Express
      const port = process.env.PORT || 3000;
      app.listen(port, () => {
        console.log(`Servidor rodando na porta ${port}`);
      });
    });

  } catch (err) {
    console.error("Erro ao conectar ao banco:", err);
    process.exit(1);
  }
}

start();

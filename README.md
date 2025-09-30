# LoboP2P
Esse é um projeto que demonstra segurança e de gerenciamento de dados financeiros.

## Funcionalidades:
- **Autenticação de Usuário**
  - Sistema de login/cadastro simples.

- **Geração de Endereço**
  - Endpoint que simula a geração de um endereço de carteira.
  - Pode utilizar uma biblioteca como `ethereumjs-wallet` para simulação.

- **Transações**
  - Endpoint para simular o envio de uma transação.
  - Não envia transações reais, apenas simula o processo:
    - Valida o endereço de destino.
    - Verifica o saldo (em um banco de dados).
    - Cria um registro de transação.

- **Consulta de Saldo**
  - Endpoint para consultar o saldo de uma carteira simulada.
    
## O que ele demonstra:
- Conhecimento de **Node.js, TypeScript e Express**
- Uso de um banco de dados (por exemplo, **PostgreSQL** ou **MongoDB**) para armazenar informações de usuários e transações.
- Entendimento sobre a lógica básica de uma **carteira digital**.
- Preocupação com **segurança** (por exemplo, como você protegeria uma chave privada, mesmo que simulada).


npx prisma init
npx prisma migrate dev --name init
npx prisma generate

docker build -t lobo2p2 .
docker run -p 3000:3000 --env-file .env lobo2p2
docker-compose up

docker-compose down -v
docker-compose up --build






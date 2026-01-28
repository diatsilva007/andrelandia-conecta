// Script para popular rapidamente a base de dados com comércios fake para testes de lazy loading
// Execute este script no backend (Node.js) com: node scripts/populaComerciosFake.js

import fetch from "node-fetch";

const TOTAL = 30; // Quantidade de comércios fake
const categorias = [
  "Alimentação",
  "Vestuário",
  "Serviços",
  "Saúde",
  "Educação",
  "Beleza",
  "Tecnologia",
  "Outros",
];

async function criarComercioFake(i) {
  const comercio = {
    nome: `Comércio Teste ${i}`,
    descricao: `Descrição fake para comércio ${i}`,
    categoria: categorias[i % categorias.length],
    endereco: `Rua Teste, ${i}, Bairro Centro`,
    produtos: [
      { nome: `Produto ${i}-A`, preco: 10 + i },
      { nome: `Produto ${i}-B`, preco: 20 + i },
    ],
    avaliacoes: [{ nota: (i % 5) + 1 }, { nota: ((i + 2) % 5) + 1 }],
  };
  try {
    // 1. Pegue seu token JWT (ex: copie do localStorage após login na plataforma)
    // 2. Cole abaixo, substituindo 'SEU_TOKEN_AQUI' pelo valor real do token:
    const JWT_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJkaW9nby5hdGFpZGVlQGdtYWlsLmNvbSIsImlhdCI6MTc2OTU2Nzk0MCwiZXhwIjoxNzY5NjU0MzQwfQ.i0as87Z4VUmx9FzfiYT5bhf0xI24ma8JJWVWsuGaiPk"; // <-- COLE SEU TOKEN ENTRE AS ASPAS
    const res = await fetch("http://localhost:3333/comercios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${JWT_TOKEN}`,
      },
      body: JSON.stringify(comercio),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Erro HTTP ${res.status}: ${text}`);
    }
  } catch (err) {
    console.error(`Erro ao criar comércio ${i}:`, err.message);
  }
}

(async () => {
  for (let i = 1; i <= TOTAL; i++) {
    await criarComercioFake(i);
    console.log(`Comércio ${i} criado.`);
  }
  console.log("População concluída!");
})();

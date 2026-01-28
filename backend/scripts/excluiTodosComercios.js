// Script para excluir todos os comércios cadastrados via API
// Execute com: node backend/scripts/excluiTodosComercios.js
// Lembre-se de inserir seu JWT_TOKEN igual ao script de popular!

import fetch from "node-fetch";

const JWT_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJkaW9nby5hdGFpZGVlQGdtYWlsLmNvbSIsImlhdCI6MTc2OTU2Nzk0MCwiZXhwIjoxNzY5NjU0MzQwfQ.i0as87Z4VUmx9FzfiYT5bhf0xI24ma8JJWVWsuGaiPk"; // <-- COLE SEU TOKEN ENTRE AS ASPAS

async function excluirTodosComercios() {
  try {
    const res = await fetch("http://localhost:3333/comercios", {
      headers: {
        Authorization: `Bearer ${JWT_TOKEN}`,
      },
    });
    if (!res.ok) throw new Error(`Erro ao buscar comércios: ${res.status}`);
    const comercios = await res.json();
    for (const c of comercios) {
      if (c.nome && c.nome.startsWith("Comércio Teste")) {
        const del = await fetch(`http://localhost:3333/comercios/${c.id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${JWT_TOKEN}`,
          },
        });
        if (del.ok) {
          console.log(`Comércio ${c.nome} (ID ${c.id}) excluído.`);
        } else {
          const text = await del.text();
          console.error(`Erro ao excluir ${c.nome} (ID ${c.id}):`, text);
        }
      }
    }
    console.log("Exclusão concluída!");
  } catch (err) {
    console.error("Erro geral:", err.message);
  }
}

excluirTodosComercios();

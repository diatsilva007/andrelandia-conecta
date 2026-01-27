import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // Restaura usuário e token do localStorage ao iniciar
  useEffect(() => {
    const restoreUser = async () => {
      setLoadingUser(true);
      const localToken = localStorage.getItem("token");
      // [DEBUG] console.log('[UserContext] Token encontrado no localStorage:', localToken);
      if (!localToken) {
        setUsuario(null);
        setToken(null);
        setLoadingUser(false);
        // [DEBUG] console.log('[UserContext] Nenhum token encontrado. Usuário deslogado.');
        return;
      }
      try {
        const res = await fetch("http://localhost:3333/auth/me", {
          headers: { Authorization: `Bearer ${localToken}` },
        });
        // [DEBUG] console.log('[UserContext] Resposta /auth/me:', res.status);
        if (!res.ok) throw new Error("Token inválido");
        const data = await res.json();
        setUsuario(data.usuario);
        setToken(localToken);
        // [DEBUG] console.log('[UserContext] Usuário restaurado:', data.usuario);
      } catch {
        setUsuario(null);
        setToken(null);
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        // [DEBUG] console.log('[UserContext] Erro ao restaurar usuário:', err);
      } finally {
        setLoadingUser(false);
        // [DEBUG] console.log('[UserContext] loadingUser = false');
      }
    };
    restoreUser();
  }, []);

  // Atualiza localStorage sempre que usuario ou token mudar
  useEffect(() => {
    // Só sincroniza localStorage se não estiver carregando
    if (loadingUser) return;
    if (usuario) {
      localStorage.setItem("usuario", JSON.stringify(usuario));
    } else {
      localStorage.removeItem("usuario");
    }
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [usuario, token, loadingUser]);

  // Função para login: salva usuário e token
  const login = (user, newToken) => {
    setUsuario(user);
    setToken(newToken);
  };

  // Função para logout: limpa usuário e token
  const logout = () => {
    setUsuario(null);
    setToken(null);
  };

  return (
    <UserContext.Provider
      value={{ usuario, token, setUsuario, login, logout, loadingUser }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}

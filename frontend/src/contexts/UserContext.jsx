import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);

  // Restaura usuário e token do localStorage ao iniciar
  useEffect(() => {
    const restoreUser = async () => {
      const localToken = localStorage.getItem("token");
      if (!localToken) {
        setUsuario(null);
        setToken(null);
        return;
      }
      try {
        const res = await fetch("http://localhost:3333/auth/me", {
          headers: { Authorization: `Bearer ${localToken}` },
        });
        if (!res.ok) throw new Error("Token inválido");
        const data = await res.json();
        setUsuario(data.usuario);
        setToken(localToken);
      } catch (err) {
        setUsuario(null);
        setToken(null);
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
      }
    };
    restoreUser();
  }, []);

  // Atualiza localStorage sempre que usuario ou token mudar
  useEffect(() => {
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
  }, [usuario, token]);

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
    <UserContext.Provider value={{ usuario, token, setUsuario, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}

import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    // Carrega usuário do localStorage ao iniciar
    const userStr = localStorage.getItem("usuario");
    setUsuario(userStr ? JSON.parse(userStr) : null);
  }, []);

  // Atualiza localStorage sempre que usuario mudar
  useEffect(() => {
    if (usuario) {
      localStorage.setItem("usuario", JSON.stringify(usuario));
    } else {
      localStorage.removeItem("usuario");
    }
  }, [usuario]);

  return (
    <UserContext.Provider value={{ usuario, setUsuario }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}

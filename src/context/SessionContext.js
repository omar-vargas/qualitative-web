// context/SessionContext.js
import { createContext, useContext, useState } from "react";

const SessionContext = createContext();

export const SessionProvider = ({ children }) => {
  const [session, setSession] = useState(() => {
    const stored = sessionStorage.getItem("session");
    return stored ? JSON.parse(stored) : null;
  });

  const setSessionAndStore = (data) => {
    sessionStorage.setItem("session", JSON.stringify(data));
    setSession(data);
  };

  const clearSession = () => {
    sessionStorage.removeItem("session");
    setSession(null);
  };

  return (
    <SessionContext.Provider value={{
      session,
      setSession: setSessionAndStore,
      clearSession
    }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => useContext(SessionContext);

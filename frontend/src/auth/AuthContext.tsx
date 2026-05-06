import { createContext, useState } from "react";
import type { ReactNode } from "react";

interface AuthContextType {
  token: string | null;
  customerId: number | null;
  accountId: number | null;
  login: (token: string) => void;
  setProfile: (customerId: number, accountId: number) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  customerId: null,
  accountId: null,
  login: () => {},
  setProfile: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  
  const [customerId, setCustomerId] = useState<number | null>(
    localStorage.getItem("customerId") ? Number(localStorage.getItem("customerId")) : null
  );

  const [accountId, setAccountId] = useState<number | null>(
    localStorage.getItem("accountId") ? Number(localStorage.getItem("accountId")) : null
  );

  const login = (token: string) => {
    localStorage.setItem("token", token);
    setToken(token);
  };

  const setProfile = (customerId: number, accountId: number) => {
    localStorage.setItem("customerId", String(customerId));
    localStorage.setItem("accountId", String(accountId));
    setCustomerId(customerId);
    setAccountId(accountId);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("customerId");
    localStorage.removeItem("accountId");
    setToken(null);
    setCustomerId(null);
    setAccountId(null);
  };

  return (
    <AuthContext.Provider value={{ token, customerId, accountId, login, setProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
/* eslint-disable react-refresh/only-export-components */
import { LoginCredentials } from "@/models/login-credentials";
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { jwtDecode } from "jwt-decode";
import { createToken } from "@/api/api";

export const isTokenExpired = (token: string) => {
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp && decoded.exp < currentTime;
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    return true;
  }
};

interface LoginContextType {
  token: string | null;
  login: (credentials: LoginCredentials) => void;
  logout: () => void;
}

const LoginContext = createContext<LoginContextType | undefined>(undefined);

export const LoginProvider = ({ children }: PropsWithChildren) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !isTokenExpired(token)) {
      setToken(token);
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const { access_token } = await createToken(credentials);
    localStorage.setItem("token", access_token);
    setToken(access_token);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <LoginContext.Provider value={{ token, login, logout }}>
      {children}
    </LoginContext.Provider>
  );
};

export const useLogin = () => {
  const context = useContext(LoginContext);
  if (context === undefined) {
    throw new Error("useLogin must be used within a LoginProvider");
  }
  return context;
};

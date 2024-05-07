"use client";

import { DiscordProfile } from "@blurple-canvas-web/types";
import Cookies from "js-cookie";
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

interface AuthContextType {
  user: DiscordProfile | null;
  logout: () => void;
}

interface AuthProviderProps {
  children?: ReactNode;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  logout: () => {},
});

export const useAuthContext = () => useContext(AuthContext);

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<DiscordProfile | null>(() => {
    const profile = Cookies.get("profile");
    return profile ? JSON.parse(profile) : null;
  });

  const logout = useCallback(() => {
    Cookies.remove("profile");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

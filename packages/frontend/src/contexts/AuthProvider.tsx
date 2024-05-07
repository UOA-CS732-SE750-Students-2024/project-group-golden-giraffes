"use client";

import config from "@/config";
import { DiscordProfile } from "@blurple-canvas-web/types";
import axios from "axios";
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
    // Delete the session cookie
    axios.post(`${config.apiUrl}/api/v1/discord/logout`).catch(console.error);

    Cookies.remove("profile");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

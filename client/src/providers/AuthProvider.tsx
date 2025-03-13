import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { User } from "../types";
import toast, { Renderable, Toast, ValueFunction } from "react-hot-toast";
import { api } from "../utils/axios";
import { csrf } from "../utils/functions";
import { storage } from "../utils/storage";

interface AuthContextValue {
  user: User | null;
  authenticated: boolean;
  login: (credentials: any) => Promise<void>;
  register: (credentials: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  authenticated: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authenticated, setAuthenticated] = useState(true);

  const fetchCurrentUser = useCallback(async () => {
    try {
      const response = await api.get("/auth/user", {
        headers: {
          Authorization: `Bearer ${storage.get("token")}`,
        },
      });
      setUser(response.data);
      setAuthenticated(true);
    } catch {
      setUser(null);
      setAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const handleLoginResponse = useCallback(
    (response: {
      data: {
        success: boolean;
        message: Renderable | ValueFunction<Renderable, Toast>;
        token: string;
      };
    }) => {
      if (response.data.success) {
        toast.success(response.data.message);
        storage.set("token", response.data.token);
        setAuthenticated(true);
      } else {
        toast.error(response.data.message);
        setAuthenticated(false);
      }
    },
    []
  );

  const handleRegistrationResponse = useCallback(
    (response: {
      data: {
        success: boolean;
        message: Renderable | ValueFunction<Renderable, Toast>;
        token: string;
      };
    }) => handleLoginResponse(response),
    [handleLoginResponse]
  );

  const login = useCallback(
    async (credentials: any) => {
      try {
        await csrf();
        const res = await api.post("/guest/login", credentials);
        handleLoginResponse(res);
      } catch {
        toast.error("Login failed. Please try again.");
        setAuthenticated(false);
      }
    },
    [handleLoginResponse]
  );

  const register = useCallback(
    async (credentials: any) => {
      try {
        await csrf();
        const res = await api.post("/guest/register", credentials);
        handleRegistrationResponse(res);
      } catch {
        toast.error("Registration failed. Please try again.");
        setAuthenticated(false);
      }
    },
    [handleRegistrationResponse]
  );

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
      storage.remove("token");
      setUser(null);
      setAuthenticated(false);
      window.location.href = "/";
    } catch (error) {
      toast.error("Loggin out failed. Please try again.");
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        authenticated,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

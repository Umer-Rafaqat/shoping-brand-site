import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { getMeAPI, loginAPI, logoutAPI, signupAPI } from "@/api/auth.api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const me = await getMeAPI();
        setUser(me);
      } catch {
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };
    restoreSession();
  }, []);

  const signup = useCallback(
    async (formData) => {
      const { user: newUser } = await signupAPI(formData);
      setUser(newUser);
      navigate("/");
    },
    [navigate],
  );

  const login = useCallback(
    async (credentials) => {
      const { user: loggedIn } = await loginAPI(credentials);
      setUser(loggedIn);
      navigate("/");
    },
    [navigate],
  );

  const logout = useCallback(async () => {
    try {
      await logoutAPI();
    } finally {
      setUser(null);
      navigate("/login");
    }
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ user, authLoading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};

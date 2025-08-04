import {
  createContext,
  useContext,
  useEffect,
  useState,
  type Dispatch,
  type PropsWithChildren,
  type SetStateAction,
} from "react";
import { session } from "@features/auth/session";
import type { AuthModel, UserModel } from "../model/models";
import { useLoginUser, useVerifyUser } from "../hooks/auth";

type AccessToken = AuthModel["access_token"];

interface AuthContextProps {
  auth: AccessToken | null;
  user: UserModel | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setAuth: Dispatch<SetStateAction<string | null>>;
  loginError: string | null;
}

const AuthContext = createContext<AuthContextProps | null>(null);

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used within a AuthProvider");
  }

  return context;
};

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const { getAuthToken, removeAuthToken, setAuthToken } = session;
  const [auth, setAuth] = useState<AccessToken | null>(getAuthToken());
  const [user, setUser] = useState<UserModel | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const { getUser } = useLoginUser();
  const { getUser: verifyUser } = useVerifyUser();

  const clearSession = () => {
    setAuth(null);
    removeAuthToken();
    setUser(null);
  };

  useEffect(() => {
    updateUser().finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth]);

  const updateUser = async () => {
    if (auth) {
      try {
        setLoading(true);

        const result = await verifyUser();

        setUser(result);
      } catch (error) {
        console.error("123", error);
        clearSession();
      } finally {
        setLoading(false);
      }
    }
  };

  const login = async (email: string, password: string) => {
    if (!auth) {
      try {
        const data = await getUser({ email, password });
        console.log("Login successful:", data);

        setAuthToken(data.access_token);
        setAuth(data.access_token);
      } catch {
        setLoginError("Invalid email or password");
        clearSession();
      }
    }
  };

  const logout = () => {
    clearSession();
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
        loading,
        login,
        logout,
        user,
        setAuth,
        loginError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

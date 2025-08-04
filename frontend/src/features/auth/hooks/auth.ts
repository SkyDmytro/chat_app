import { API_URL } from "@/lib/config";
import type {
  AuthModel,
  LoginRequest,
  RegisterRequest,
  UserModel,
} from "../model/models";
import { authFetch } from "@/lib/requests";

export const useLoginUser = () => {
  const getUser = async (credentials: LoginRequest): Promise<AuthModel> => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!res.ok) {
      throw new Error("Login failed");
    }

    return res.json();
  };

  return { getUser };
};

export const useRegisterUser = () => {
  const registerUser = async (data: RegisterRequest): Promise<UserModel> => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Registration failed");
    }

    return res.json();
  };

  return { registerUser };
};
export const useVerifyUser = () => {
  const getUser = async (): Promise<UserModel> => {
    return authFetch.get(`/users/me`, {});
  };

  return { getUser };
};

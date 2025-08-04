import { authFetch } from "@/lib/requests";
import type { User } from "../models/types";

export const useGetUsers = () => {
  const getUsers = (): Promise<User[]> => {
    return authFetch.get("/users");
  };
  return { getUsers };
};

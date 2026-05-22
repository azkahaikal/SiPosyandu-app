import api from "../lib/axios";
import type { ApiUser } from "@/types/api";

export type User = ApiUser;

export const userService = {
  getAll: async () => {
    const response = await api.get<User[]>("/users");
    return response.data;
  },
};

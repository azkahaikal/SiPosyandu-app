import { create } from "zustand";
import { persist } from "zustand/middleware";

export type UserRole = "admin" | "petugas" | "user";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, passwordConfirmation: string) => Promise<boolean>;
  logout: () => void;
}

const MOCK_USERS: User[] = [
  { id: "1", name: "Admin Posyandu", email: "admin@posyandu.id", role: "admin" },
  { id: "2", name: "Bidan Siti", email: "bidan@posyandu.id", role: "petugas" },
  { id: "3", name: "Ibu Aminah", email: "ibu@posyandu.id", role: "user" },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        try {
          const response = await fetch("http://localhost:8000/api/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
            },
            body: JSON.stringify({ email, password }),
          });
          
          if (response.ok) {
            const data = await response.json();
            localStorage.setItem("token", data.access_token);
            set({ user: data.user, isAuthenticated: true });
            return true;
          }
        } catch (error) {
          console.error("Login error:", error);
        }
        return false;
      },
      register: async (name: string, email: string, password: string, passwordConfirmation: string) => {
        try {
          const response = await fetch("http://localhost:8000/api/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json",
            },
            body: JSON.stringify({
              name,
              email,
              password,
              password_confirmation: passwordConfirmation,
            }),
          });
          
          if (response.ok) {
            const data = await response.json();
            localStorage.setItem("token", data.access_token);
            set({ user: data.user, isAuthenticated: true });
            return true;
          }
        } catch (error) {
          console.error("Registration error:", error);
        }
        return false;
      },
      logout: () => {
        const token = localStorage.getItem("token");
        fetch("http://localhost:8000/api/logout", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json",
          },
        }).finally(() => {
          localStorage.removeItem("token");
          set({ user: null, isAuthenticated: false });
        });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);

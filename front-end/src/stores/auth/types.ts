export interface User {
  id: string;
  email: string;
  role: "patient" | "caretaker";
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterCredentials = LoginCredentials & {
  role: "patient" | "caretaker";
};

import { supabase } from "../lib/supabase";
import { loginStart, loginSuccess } from "../stores/auth/authSlice";
import type {
  LoginCredentials,
  RegisterCredentials,
} from "../stores/auth/types";
import type { AppDispatch } from "../stores/store";

export const authService = {
  async login(
    dispatch: AppDispatch,
    credentials: LoginCredentials
  ): Promise<{ success: boolean }> {
    dispatch(loginStart());
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) throw error;
      if (!data.session) throw new Error("No session created");

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();
      console.log("user data:", data.user);

      if (!profile) throw new Error("User profile not found");

      dispatch(
        loginSuccess({
          id: data.user.id,
          email: data.user.email!,
          role: profile.role,
        })
      );

      return { success: true };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed";
      dispatch({ type: "auth/loginFailure", payload: message });
      return { success: false };
    }
  },

  async register(
    dispatch: AppDispatch,
    credentials: RegisterCredentials
  ): Promise<{ success: boolean }> {
    try {
      dispatch({ type: "auth/registerStart" });

      // 1. Auth registration
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Registration failed");

      // 2. Save profile data
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: authData.user.id,
        email: credentials.email,
        role: credentials.role,
        updated_at: new Date().toISOString(),
      });

      if (profileError) throw profileError;

      dispatch({
        type: "auth/registerSuccess",
        payload: {
          id: authData.user.id,
          email: credentials.email,
          role: credentials.role,
        },
      });

      return { success: true };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Registration failed";
      dispatch({ type: "auth/registerFailure", payload: message });
      return { success: false };
    }
  },

  async logout(dispatch: AppDispatch): Promise<void> {
    try {
      await supabase.auth.signOut();
      dispatch({ type: "auth/logout" });
    } catch (error) {
      console.error("Logout error:", error);
    }
  },

  async checkAuth(dispatch: AppDispatch): Promise<void> {
    try {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        dispatch({ type: "auth/checkAuthFailure" });
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role, email")
        .eq("id", data.session.user.id)
        .single();

      if (!profile) {
        dispatch({ type: "auth/checkAuthFailure" });
        return;
      }

      dispatch({
        type: "auth/checkAuthSuccess",
        payload: {
          id: data.session.user.id,
          email: profile.email,
          role: profile.role,
        },
      });
    } catch (error) {
      dispatch({ type: "auth/checkAuthFailure" });
    }
  },
};

import { supabase } from "../lib/supabase";
import { loginFailure, loginSuccess } from "../stores/auth/authSlice";
import type { RegisterCredentials } from "../stores/auth/types";
import { fetchUserInfo } from "../stores/infoSlice";
import type { AppDispatch } from "../stores/store";

export const authService = {
  async login(
    dispatch: AppDispatch,
    credentials: { email: string; password: string }
  ) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword(
        credentials
      );

      if (error) throw error;

      if (data?.user) {
        // Get user profile from profiles table
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single();

        if (!profile) throw new Error("User profile not found");

        dispatch(loginSuccess(profile));

        // Fetch appropriate info based on role
        dispatch(fetchUserInfo(data.user.id, profile.role));

        return { success: true };
      }

      return { success: false };
    } catch (err) {
      dispatch(
        loginFailure(err instanceof Error ? err.message : "Login failed")
      );
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
        username: credentials.username,
        role: credentials.role,
        updated_at: new Date().toISOString(),
      });

      if (profileError) throw profileError;

      dispatch({
        type: "auth/registerSuccess",
        payload: {
          id: authData.user.id,
          email: credentials.email,
          username: credentials.username,
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
        .select("role, email, username")
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
          username: profile.username,
          role: profile.role,
        },
      });
    } catch (error) {
      dispatch({ type: "auth/checkAuthFailure" });
    }
  },
};

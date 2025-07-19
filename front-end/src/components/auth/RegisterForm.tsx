import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useNavigate, useSearchParams } from "react-router-dom";

function RegisterForm() {
  const [searchparams] = useSearchParams();
  const navigate = useNavigate();
  const role = searchparams.get("role");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!role || !["patient", "caretaker"].includes(role)) {
    navigate("/select-role");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: role, // Store role in auth user metadata
          },
        },
      });
      console.log("Auth response:", authData.user);
      if (authError) throw authError;
      console.log("not autherror");
      if (authData.user?.identities?.length === 0) {
        throw new Error("Email already registered");
      }
      if (!authData.user) {
        // This might happen if email confirmation is enabled
        setError(
          "Registration almost complete! Please check your email to confirm your account."
        );
        return;
      }

      // 2. Store additional user data in profiles table
      const { error: profileError } = await supabase.from("profiles").insert({
        id: authData.user.id,
        email,
        role,
        updated_at: new Date().toISOString(),
      });
      console.log("before profile error");
      if (profileError) throw profileError;

      // 3. Redirect to appropriate dashboard
      navigate(`/${role}/${authData.user.id}/dashboard`);
    } catch (err) {
      console.error("Registration error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4">Register as {role}</h2>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password (min 6 characters)
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            required
            minLength={6}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}

export default RegisterForm;

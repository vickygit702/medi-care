import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../stores/store";
import { authService } from "../../services/auth";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [demoUserType, setDemoUserType] = useState<"patient" | "caretaker">(
    "patient"
  );
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Set demo credentials when user type changes
  useEffect(() => {
    if (demoUserType === "patient") {
      setEmail("user1@gmail.com");
      setPassword("user123");
    } else {
      setEmail("caretaker@gmail.com");
      setPassword("care123");
    }
  }, [demoUserType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { success } = await authService.login(dispatch, {
        email,
        password,
      });

      if (!success) {
        setError("Login failed - please try again");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err instanceof Error ? err.message : "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("user details:", user);
    if (user) navigate(`/${user.role}/dashboard`);
  }, [user?.id]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Sign In
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
              placeholder={
                demoUserType === "patient"
                  ? "user1@gmail.com"
                  : "caretaker@gmail.com"
              }
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
              placeholder={demoUserType === "patient" ? "user123" : "care123"}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Signing in...
              </span>
            ) : (
              "Sign in"
            )}
          </button>

          {/* Demo access radio buttons */}
          <div className="flex justify-center space-x-6 pt-2">
            <div className="flex items-center">
              <input
                id="demo-patient"
                name="demo-user"
                type="radio"
                checked={demoUserType === "patient"}
                onChange={() => setDemoUserType("patient")}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="demo-patient"
                className="ml-2 block text-sm text-gray-700"
              >
                Demo Patient
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="demo-caretaker"
                name="demo-user"
                type="radio"
                checked={demoUserType === "caretaker"}
                onChange={() => setDemoUserType("caretaker")}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <label
                htmlFor="demo-caretaker"
                className="ml-2 block text-sm text-gray-700"
              >
                Demo Caretaker
              </label>
            </div>
          </div>

          <div className="text-center text-sm text-gray-500 pt-2">
            <p>Demo credentials will auto-fill when you select a role</p>
          </div>
        </form>
      </div>
    </div>
  );
}

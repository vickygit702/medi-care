import { useNavigate } from "react-router-dom";

export default function RoleSelection() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-center mb-8">
          Choose Your Account !
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Patient Card */}
          <div className="flex flex-col border rounded-lg p-6 cursor-pointer transition-all hover:shadow-md hover:border-blue-200 hover:bg-blue-50 h-full">
            <ul className="text-blue-700 space-y-3 text-left flex-grow mb-6">
              <li className="flex items-start font-['Arial Black']">
                <span className="mr-2">✓</span>
                <span>Track your medication schedule</span>
              </li>
              <li className="flex items-start font-['Arial Black']">
                <span className="mr-2">✓</span>
                <span>Mark medications as taken</span>
              </li>
              <li className="flex items-start font-['Arial Black']">
                <span className="mr-2">✓</span>
                <span>Upload proof photos (optional)</span>
              </li>
              <li className="flex items-start font-['Arial Black']">
                <span className="mr-2">✓</span>
                <span>View your medication calendar</span>
              </li>
              <li className="flex items-start font-['Arial Black']">
                <span className="mr-2">✓</span>
                <span>Large, easy-to-use interface</span>
              </li>
            </ul>
            <button
              onClick={() => navigate("/register?role=patient")}
              className="mt-auto w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md transition duration-200"
            >
              Patient
            </button>
          </div>

          {/* Caretaker Card */}
          <div className="flex flex-col border rounded-lg p-6 cursor-pointer transition-all hover:shadow-md hover:border-gray-300 hover:bg-green-50 h-full">
            <ul className="text-green-700 space-y-3 text-left flex-grow mb-6">
              <li className="flex items-start font-['Arial Black']">
                <span className="mr-2">✓</span>
                <span>Monitor medication compliance</span>
              </li>
              <li className="flex items-start font-['Arial Black']">
                <span className="mr-2">✓</span>
                <span>Set up notification preferences</span>
              </li>
              <li className="flex items-start font-['Arial Black']">
                <span className="mr-2">✓</span>
                <span>View detailed reports</span>
              </li>
              <li className="flex items-start font-['Arial Black']">
                <span className="mr-2">✓</span>
                <span>Receive email alerts</span>
              </li>
            </ul>
            <button
              onClick={() => navigate("/register?role=caretaker")}
              className="mt-auto w-full bg-green-200 hover:bg-green-300 text-gray-800 font-medium py-3 px-4 rounded-md transition duration-200"
            >
              Caretaker
            </button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-blue-600 hover:underline font-medium"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

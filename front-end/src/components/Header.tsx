import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../stores/store";
import { authService } from "../services/auth";
import { Button } from "./ui/Button";

const Header = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = async () => {
    await authService.logout(dispatch);
    // Optionally redirect to login page
  };
  return (
    <>
      <div className="flex justify-between items-center p-6 bg-white">
        <div className="flex items-center space-x-3 ">
          <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center text-white font-bold">
            M
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              MediCare Companion
            </h1>
            <p className="text-sm text-gray-600">{user?.role} View</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </>
  );
};

export default Header;

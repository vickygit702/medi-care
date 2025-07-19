import { User } from "lucide-react";

const Header = () => {
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
            <p className="text-sm text-gray-600">Patient View</p>
          </div>
        </div>
        <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 ">
          <User className="w-4 h-4" />
          <span className="text-sm">Switch to Caretaker</span>
        </button>
      </div>
    </>
  );
};

export default Header;

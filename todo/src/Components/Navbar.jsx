import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import { Toaster, toast } from "sonner";

const Navbar = () => {
  const { userInfo, setUserInfo } = useContext(AuthContext);

  const logout = () => {
    localStorage.removeItem("user");
    setUserInfo("");
    toast.info("Logout successfully");
  };

  return (
    <>
      <Toaster richColors position="top-center" />
      <div className="flex flex-col p-4">
        <div className="flex justify-between items-center w-full">
          <div className="border-1 bg-purple-300 rounded-md p-2 font-medium text-pink-900">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
          {/* Container for center content */}
          <div className="flex justify-center flex-grow">
            <Link
              to="/"
              className="text-3xl font-bold text-center bg-gradient-to-r from-blue-500 to-pink-500 bg-clip-text text-transparent"
            >
              My Store
            </Link>
          </div>
          {userInfo?.user?.token ? (
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-sm shadow hover:bg-blue-600 transition"
              onClick={logout}
            >
              Logout
            </button>
          ) : (
            <div className="flex gap-4">
              <Link
                to="/signup"
                className="bg-blue-500 text-white py-2 px-4 rounded-sm shadow hover:bg-blue-600 transition"
              >
                SIGN UP
              </Link>
              <Link
                to="/login"
                className="bg-gray-500 text-white py-2 px-4 rounded-sm shadow hover:bg-gray-600 transition"
              >
                SIGN IN
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;

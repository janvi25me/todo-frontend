import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";

const Header = () => {
  const { token, setToken } = useContext(AuthContext);
  // console.log("Token in header", token);

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <>
      <div className="flex flex-col  min-h-screen p-4">
        <div className="flex justify-between items-center w-full">
          <h1 className="text-3xl font-bold text-gray-600 text-center flex-grow">
            Todo
          </h1>

          {token ? (
            <button
              className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-600 transition"
              onClick={logout}
            >
              Logout
            </button>
          ) : (
            <div className="flex gap-4">
              <Link
                to="/signup"
                className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-600 transition"
              >
                SIGNUP
              </Link>
              <Link
                to="/login"
                className="bg-gray-500 text-white py-2 px-4 rounded-lg shadow hover:bg-gray-600 transition"
              >
                SIGNIN
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;

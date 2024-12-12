import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import { Toaster, toast } from "sonner";
import TodoList from "./Todo/TodoList";

const Navbar = () => {
  const { token, setToken } = useContext(AuthContext);
  // console.log("Token in header", token);

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
    toast.info("Logout successfully");
  };

  return (
    <>
      <Toaster richColors position="top-right" />
      <div className="flex flex-col  min-h-screen p-4">
        <div className="flex justify-between items-center w-full">
          <div className="border-1  bg-purple-300 rounded-md p-2">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
          <h1 className="text-3xl font-bold text-gray-600 text-center flex-grow">
            Todo List{" "}
          </h1>

          {token ? (
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
                className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-600 transition"
              >
                SIGNUP
              </Link>
              <Link
                to="/login"
                className="bg-gray-500 text-white py-2 px-4 rounded-sm shadow hover:bg-gray-600 transition"
              >
                SIGNIN
              </Link>
            </div>
          )}
        </div>
        <TodoList />
      </div>
    </>
  );
};

export default Navbar;

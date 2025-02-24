import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";
import { toast } from "sonner";

const Navbar = () => {
  const { userInfo, setUserInfo, cart } = useContext(AuthContext);
  // console.log("Cart", cart.noOfProducts);
  // console.log(">>", cart);
  const logout = () => {
    localStorage.removeItem("user");
    setUserInfo("");
    toast.info("Logout successfully");
  };

  return (
    <>
      <div className="flex flex-col p-4">
        <div className="flex justify-between items-center w-full">
          {/* Left: "My Store" */}
          <div className="flex items-center">
            <Link
              to="/"
              className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-pink-500 bg-clip-text text-transparent"
            >
              My Store
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/order"
              className="bg-blue-500 text-white rounded-lg border border-blue-500 p-2"
            >
              Orders
            </Link>

            {userInfo?.user?.role === "1" && (
              <Link
                to="/cart"
                type="button"
                className="relative flex items-center justify-center p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none"
              >
                <span className="material-symbols-outlined">
                  <i className="fa-solid fa-cart-shopping"></i>
                </span>
                {cart?.data?.noOfProducts > 0 && (
                  <span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 flex items-center justify-center h-5 w-5 text-xs font-bold text-white bg-pink-600 rounded-full">
                    {cart?.data?.noOfProducts}
                  </span>
                )}
              </Link>
            )}

            {/* user icon */}
            {userInfo?.user && (
              <Link
                to="/user"
                type="button"
                className="relative flex items-center justify-center p-3 bg-blue-600 text-white rounded-3xl hover:bg-blue-700 focus:outline-none"
              >
                <span className="flex items-center justify-center">
                  {userInfo?.user?.profileImage ? (
                    <img
                      src={userInfo?.user?.profileImage}
                      alt="User Profile"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <i className="fa-solid fa-user"></i>
                  )}
                </span>
              </Link>
            )}

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
      </div>
    </>
  );
};

export default Navbar;

import { Link } from "react-router-dom";
import aaa from "../assets/aaa.jpg";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";

const Home = () => {
  const { userInfo } = useContext(AuthContext);

  return (
    <div
      className="bg-cover bg-center h-screen flex flex-col justify-center items-center"
      style={{ backgroundImage: `url(${aaa})` }}
    >
      <div className="bg-black bg-opacity-60 p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-4xl font-bold text-white mb-6">
          Welcome to Our Online Store
        </h1>
        <p className="text-lg text-gray-200 mb-8">
          Discover exclusive products, great deals, and seamless shopping!
        </p>
        <div className="space-y-4">
          {userInfo?.user?.role === "1" ? (
            <>
              <Link
                to="/product"
                className="block w-full px-6 py-3 bg-purple-600 text-white font-medium text-lg rounded-lg shadow-md hover:bg-purple-700 hover:scale-105 transition transform duration-300"
              >
                See All Products
              </Link>
              <Link
                to="/cart"
                className="block w-full px-6 py-3 bg-green-500 text-white font-medium text-lg rounded-lg shadow-md hover:bg-green-600 hover:scale-105 transition transform duration-300"
              >
                My Cart
              </Link>
              <Link
                to="/address"
                className="block w-full px-6 py-3 bg-blue-500 text-white font-medium text-lg rounded-lg shadow-md hover:bg-blue-600 hover:scale-105 transition transform duration-300"
              >
                Delivery Address
              </Link>
            </>
          ) : (
            <div className="text-center text-lg text-white">
              <p>Welcome Admin.</p>
              <Link
                to="/product"
                className="block w-full px-6 py-3 bg-purple-600 text-white font-medium text-lg rounded-lg shadow-md hover:bg-purple-700 hover:scale-105 transition transform duration-300"
              >
                See All Products
              </Link>
              <Link
                to="/order"
                className="block w-full mt-3 px-6 py-3 bg-blue-500 text-white font-medium text-lg rounded-lg shadow-md hover:bg-blue-600 hover:scale-105 transition transform duration-300"
              >
                Orders Page
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;

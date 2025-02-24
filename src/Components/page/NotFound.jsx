import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <div className="text-center">
        <h1 className="text-9xl font-extrabold text-purple-600">404</h1>
        <p className="text-2xl md:text-3xl font-semibold mt-6">
          Oops! Page not found.
        </p>
        <p className="text-gray-600 mt-4">
          The page you Are looking for doesnot exist or has been moved.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block px-6 py-3 bg-purple-600 text-white text-lg font-medium rounded-lg shadow-lg hover:bg-purple-700 transition duration-300"
        >
          Go Back Home
        </Link>
      </div>
      {/* <div className="mt-12">
        <img
          src="https://via.placeholder.com/400x300"
          alt="Not Found"
          className="rounded-lg shadow-lg"
          height={50}
        />
      </div> */}
    </div>
  );
};

export default NotFound;

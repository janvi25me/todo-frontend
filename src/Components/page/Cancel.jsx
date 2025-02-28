import { useNavigate } from "react-router-dom";

const Cancel = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-red-100">
      <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
        <h2 className="text-3xl font-semibold text-red-600">
          Payment Canceled
        </h2>
        <p className="text-gray-700 mt-2">
          Your payment was not completed. You can try again.
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-5 bg-red-500 text-white px-6 py-2 rounded-lg shadow hover:bg-red-700"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default Cancel;

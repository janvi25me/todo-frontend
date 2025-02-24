import { useNavigate } from "react-router-dom";

const Success = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-100">
      <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
        <h2 className="text-3xl font-semibold text-green-600">
          Payment Successful! ✅
        </h2>
        <p className="text-gray-700 mt-2">
          Thank you for your order. Your payment has been processed
          successfully.
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-5 bg-green-500 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default Success;

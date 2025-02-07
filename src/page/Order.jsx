import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate

const Order = () => {
  const { baseUrl, orders } = useContext(AuthContext);
  console.log("orders Page API", orders);

  const [activeTab, setActiveTab] = useState("today");
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ Initialize loading as true
  const navigate = useNavigate(); // ✅ Initialize navigate

  const filterOrders = (type, ordersList) => {
    setLoading(true); // ✅ Start loading
    const today = new Date().toISOString().split("T")[0];

    let filteredOrders =
      type === "today"
        ? ordersList.filter((order) => order.createdAt.split("T")[0] === today)
        : ordersList.filter((order) => order.createdAt.split("T")[0] !== today);

    setFilteredOrders(filteredOrders);
    setLoading(false); // ✅ Stop loading
  };

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    filterOrders(tab, orders);
  };

  useEffect(() => {
    filterOrders(activeTab, orders);
  }, [orders, activeTab]);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
        Your Orders
      </h2>

      {/* Tabs for switching between orders */}
      <div className="flex justify-center mb-6">
        <button
          onClick={() => handleTabSwitch("today")}
          className={`px-5 py-2 mr-3 rounded-lg text-lg font-semibold transition ${
            activeTab === "today"
              ? "bg-blue-600 text-white"
              : "bg-gray-300 text-gray-800"
          }`}
        >
          Today{"'"}s Orders
        </button>
        <button
          onClick={() => handleTabSwitch("other")}
          className={`px-5 py-2 rounded-lg text-lg font-semibold transition ${
            activeTab === "other"
              ? "bg-blue-600 text-white"
              : "bg-gray-300 text-gray-800"
          }`}
        >
          Previous Orders
        </button>
      </div>

      {/* Conditional rendering for loading & no orders */}
      {loading ? (
        <p className="text-center text-gray-500">Loading orders...</p>
      ) : filteredOrders.length === 0 ? (
        <p className="text-center text-gray-500">No orders found.</p>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              onClick={() => navigate(`/orderDetails/${order._id}`)}
              className="bg-gray-50 p-6 rounded-lg shadow border border-gray-300 hover:shadow-lg transition cursor-pointer"
            >
              <div className="flex justify-between items-center">
                <p className="text-lg font-semibold text-purple-600 ">
                  Order ID: {order._id}
                </p>
                <p className="text-sm font-medium text-white bg-yellow-500 px-3 py-1 rounded-full">
                  {order.orderStatus}
                </p>
              </div>

              <div className="mt-4 flex justify-between items-center">
                {order.products[0]?.image && (
                  <img
                    src={`${baseUrl}/${order.products[0].image}`}
                    alt="Product"
                    className="w-16 h-16 object-cover rounded-lg border"
                  />
                )}

                <div>
                  <p className="text-gray-700 font-medium">
                    Product: {order.products[0]?.name || "N/A"}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Qty: {order.products[0]?.qty}
                  </p>
                  <p className="text-gray-600">Total: ₹{order.total}</p>
                  <p className="text-gray-500 text-sm">
                    Date: {order.createdAt.split("T")[0]}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Order;

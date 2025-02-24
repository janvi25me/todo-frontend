import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import axios from "axios";
import moment from "moment";
import { Link } from "react-router-dom";

const Order = () => {
  const { url, token, setReload, imgUrl } = useContext(AuthContext);
  const [todayOrders, setTodayOrders] = useState([]);
  const [pastOrders, setPastOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPastOrders, setShowPastOrders] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const today = moment().format("DD-MM-YYYY");
  const pastTo = moment().subtract(1, "days").format("DD-MM-YYYY");

  const excludesOrderStatuses = encodeURIComponent("COMPLETED,CANCELLED");

  useEffect(() => {
    const fetchOrders = async () => {
      setReload(true);
      try {
        const todayResponse = await axios.get(
          `${url}/order/buyerOrders?from=${today}&to=${today}&excludesOrderStatuses=${excludesOrderStatuses}&page=${page}&limit=3`,
          { headers: { "Content-Type": "application/json", auth: token } }
        );
        const pastResponse = await axios.get(
          `${url}/order/buyerOrders?to=${pastTo}&page=${page}&limit=3`,
          { headers: { "Content-Type": "application/json", auth: token } }
        );

        setTodayOrders(
          todayResponse.data.success ? todayResponse.data.orders : []
        );
        setPastOrders(
          pastResponse.data.success ? pastResponse.data.orders : []
        );

        // Store separate total pages for each type of orders
        setTotalPages({
          today: todayResponse.data.totalPages,
          past: pastResponse.data.totalPages,
        });
      } catch (error) {
        setTodayOrders([]);
        setPastOrders([]);
        console.error("Error fetching orders:", error);
      } finally {
        setReload(false);
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token, url, page]);

  const getOrderStatusClass = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-500 text-white";
      case "COMPLETED":
        return "bg-green-500 text-white";
      case "CANCELLED":
        return "bg-red-500 text-white";
      case "IN-TRANSIT":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const handleNextPage = () => {
    if (showPastOrders && page < totalPages.past) setPage(page + 1);
    else if (!showPastOrders && page < totalPages.today) setPage(page + 1);
  };

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Orders</h1>

      {/* Toggle Buttons */}
      <div className="flex justify-center space-x-2 mb-4">
        <button
          onClick={() => setShowPastOrders(false)}
          className={`px-4 py-1 text-md font-medium rounded-md ${
            !showPastOrders
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          Today{"'"}s Orders
        </button>
        <button
          onClick={() => setShowPastOrders(true)}
          className={`px-4 py-1 text-md font-medium rounded-md ${
            showPastOrders
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          Past Orders
        </button>
      </div>

      {/* Loading Indicator */}
      {loading ? (
        <div className="flex justify-center items-center space-x-2">
          <div className="w-6 h-6 border-4 border-t-4 border-gray-400 border-dotted rounded-full animate-spin"></div>
          <p className="text-gray-500">Loading orders...</p>
        </div>
      ) : (
        <div>
          {/* Order List */}
          {(showPastOrders ? pastOrders : todayOrders).map((order) => (
            <div
              key={order._id}
              className="p-4 bg-gray-50 rounded-lg shadow mb-3"
            >
              {/* Order Header */}
              <div className="flex justify-between items-center mb-2">
                <p
                  className={`px-2 py-1 text-xs font-medium rounded ${getOrderStatusClass(
                    order.orderStatus
                  )}`}
                >
                  {order.orderStatus}
                </p>
                <p className="text-sm text-gray-600">
                  {moment(order.createdAt).format("Do MMM YYYY")}
                </p>
              </div>

              {/* Order ID & Total */}
              <div className="flex justify-between items-center text-sm text-gray-800">
                <p className="font-medium">
                  Order ID: <span className="text-gray-600">{order._id}</span>
                </p>
                <p className="font-semibold text-lg">
                  ₹{order.total.toLocaleString()}
                </p>
              </div>

              {/* Product Preview */}
              <div className="flex items-center space-x-2 mt-3">
                {order.products.slice(0, 3).map((product, idx) => (
                  <img
                    key={idx}
                    src={
                      product.image
                        ? `${imgUrl}/${product.image.replace(/\\/g, "/")}`
                        : "/placeholder.jpg"
                    }
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                ))}
                {order.products.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{order.products.length - 3} more
                  </span>
                )}
              </div>

              {/* View Details Link */}
              <div className="mt-2">
                <Link
                  to={`/orderDetails/${order._id}`}
                  className="text-blue-600 text-sm font-medium"
                >
                  View Order Details →
                </Link>
              </div>
            </div>
          ))}

          {/* No Orders Message */}
          {(showPastOrders ? pastOrders : todayOrders).length === 0 && (
            <p className="text-center text-gray-500">No orders found.</p>
          )}

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={handlePreviousPage}
              disabled={page === 1}
              className="px-4 py-2 bg-purple-200 text-gray-600 rounded-lg disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-purple-800 font-semibold">
              Page {page} of{" "}
              {showPastOrders ? totalPages.past : totalPages.today}
            </span>

            <button
              onClick={handleNextPage}
              disabled={page === totalPages}
              className="px-4 py-2 bg-purple-200 text-gray-600 rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;

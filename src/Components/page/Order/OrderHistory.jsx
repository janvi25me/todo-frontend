import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import axios from "axios";
import moment from "moment";
import { Link } from "react-router-dom";

const OrderHistory = () => {
  const { url, token, setReload, imgUrl } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("COMPLETED"); // default tab

  // const [showPastOrders, setShowPastOrders] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const toDate = moment().format("DD-MM-YYYY");

  useEffect(() => {
    const fetchOrders = async () => {
      setReload(true);
      setLoading(true);
      try {
        const response = await axios.get(
          `${url}/order/buyerOrders?to=${toDate}&includesOrderStatuses=${statusFilter}&page=${page}&limit=3`,
          { headers: { "Content-Type": "application/json", auth: token } }
        );
        if (response.data.success) {
          setOrders(response.data.orders);
          setTotalPages(response.data.totalPages);
        } else {
          setOrders([]);
          setTotalPages(0);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
        setTotalPages(0);
      } finally {
        setReload(false);
        setLoading(false);
      }
    };

    fetchOrders();
  }, [statusFilter, token, url, page]);

  useEffect(() => {
    const fetchSellerOrders = async () => {
      setReload(true);
      setLoading(true);
      try {
        const response = await axios.get(
          `${url}/order/sellerOrders?to=${toDate}&includesOrderStatuses=${statusFilter}&page=${page}&limit=3`,
          { headers: { "Content-Type": "application/json", auth: token } }
        );
        if (response.data.success) {
          setOrders(response.data.orders);
          setTotalPages(response.data.totalPages);
        } else {
          setOrders([]);
          setTotalPages(0);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
        setTotalPages(0);
      } finally {
        setReload(false);
        setLoading(false);
      }
    };

    fetchSellerOrders();
  }, [statusFilter, token, url, page]);

  const getOrderStatusClass = (status) => {
    return status === "COMPLETED"
      ? "bg-green-500 text-white"
      : "bg-red-500 text-white";
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="mb-4">
        <nav className="text-sm text-gray-600 mb-2">
          <span className="text-blue-500 cursor-pointer">Home</span>
          <span className="mx-2"> &gt; </span>
          <span className="text-gray-800">User Profile</span>
          <span className="mx-2"> &gt; </span>
          <span className="text-gray-800">Order History</span>
        </nav>
        {/* <h1 className="text-2xl font-semibold text-gray-800">Orders</h1> */}
      </div>

      {/* Tabs for Completed & Cancelled Orders */}
      <div className="flex justify-center space-x-2 mb-4">
        <button
          onClick={() => setStatusFilter("COMPLETED")}
          className={`px-4 py-1 text-md font-medium rounded-md ${
            statusFilter === "COMPLETED"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          Completed
        </button>
        <button
          onClick={() => setStatusFilter("CANCELLED")}
          className={`px-4 py-1 text-md font-medium rounded-md ${
            statusFilter === "CANCELLED"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          Cancelled
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
          {orders.map((order) => (
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
                  {moment(order.createdAt).format("DD MMM YYYY, h:mm A")}
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
          {orders.length === 0 && (
            <p className="text-center text-gray-500">No orders found.</p>
          )}

          <div className="flex justify-between items-center mt-4">
            <button
              onClick={handlePreviousPage}
              disabled={page === 1}
              className="px-4 py-2 bg-purple-200 text-gray-600 rounded-lg disabled:opacity-50"
            >
              Prev
            </button>
            <span className="text-purple-800 font-semibold">
              Page {page} of {totalPages || 1}
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

export default OrderHistory;

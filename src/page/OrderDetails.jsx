import { useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import { Link } from "react-router-dom";

const OrderDetails = () => {
  const { orderId } = useParams();
  console.log("Order ID from URL:", orderId);
  const { orders, baseUrl } = useContext(AuthContext);
  console.log("All orders in context:", orders);

  // Find the order with the matching orderId
  const order = orders.find((order) => order._id === orderId);
  console.log("Order details:", order);

  if (!order) {
    return <p className="text-center text-gray-500">Order not found.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <Link to="/order">BACK</Link>
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
        Order Details
      </h2>

      {/* Order ID & Status */}
      <div className="flex justify-between items-center mb-4">
        <p className="text-lg font-semibold">Order ID: {order._id}</p>
        <p
          className={`px-3 py-1 text-sm font-medium text-white rounded-full ${
            order.orderStatus === "completed"
              ? "bg-green-600"
              : order.orderStatus === "cancelled"
              ? "bg-red-600"
              : "bg-yellow-500"
          }`}
        >
          {order.orderStatus}
        </p>
      </div>

      {/* Order Info */}
      <div className="mb-4">
        <p className="text-gray-700">Total Amount: ₹{order.total}</p>
        <p className="text-gray-500">
          Ordered On: {new Date(order.createdAt).toLocaleString()}
        </p>
        <p className="text-gray-500">
          Payment Method: {order.paymentMethod || "N/A"}
        </p>
      </div>

      {/* Product List */}
      <h3 className="text-xl font-semibold text-gray-800 mb-3">Products</h3>
      <div className="space-y-4">
        {order.products.map((product) => (
          <div
            key={product._id}
            className="flex items-center bg-gray-100 p-4 rounded-lg shadow"
          >
            {product.image && (
              <img
                src={`${baseUrl}/${product.image}`}
                alt={product.name}
                className="w-16 h-16 object-cover rounded-lg border mr-4"
              />
            )}
            <div>
              <p className="text-gray-700 font-medium">
                Product: {product.name}
              </p>
              <p className="text-gray-600">Quantity: {product.qty}</p>
              <p className="text-gray-600">Price: ₹{product.price}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Shipping Details */}
      <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
        Shipping Details
      </h3>
      <div className="bg-gray-100 p-4 rounded-lg shadow">
        <p className="text-gray-700">
          Name: {order?.buyerInfo?.firstName}{" "}
          {order?.buyerInfo?.lastName || "N/A"}
        </p>
        <p className="text-gray-600">
          Email: {order.buyerInfo?.email || "N/A"}
        </p>
        <p className="text-gray-600">
          Address: {order.address?.myAddress || "N/A"}
        </p>

        {/* <p className="text-gray-600">
          Postal Code: {order.shippingDetails?.postalCode || "N/A"}
        </p> */}
        <p className="text-gray-600">
          Phone: {order?.buyerInfo?.contact || "N/A"}
        </p>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex justify-center">
        <button className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow hover:bg-green-600 transition">
          Confirm
        </button>
        <Link
          to="/order"
          className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow hover:bg-red-600 transition ml-4"
        >
          Cancel
        </Link>
      </div>
    </div>
  );
};

export default OrderDetails;

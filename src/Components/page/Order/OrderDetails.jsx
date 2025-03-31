import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import axios from "axios";
import { toast } from "sonner";
import { useParams } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";

const OrderDetails = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [otp, setOtp] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const { url, token, imgUrl, userInfo } = useContext(AuthContext);
  const { orderId } = useParams();

  // console.log("Orderid", orderId);

  // console.log("USer", userInfo);
  // console.log("%", userInfo.user.id);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${url}/order/fetchOrders/${orderId}`,
          {
            headers: { "Content-Type": "application/json", auth: token },
          }
        );

        if (response.data.success) {
          setOrder(response.data.data);
          toast.success("Order fetched successfully");
          // console.log("Order Details", response.data.data);
          // console.log("$$", order);
        } else {
          toast.error("Failed to fetch order.");
        }
      } catch (err) {
        toast.error("Failed to fetch order.", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, url, token]);

  // console.log("ProductId", selectedProduct);

  const handleAddOtpClick = (productId) => {
    setSelectedProduct(productId);
    setIsModalOpen(true);
  };

  // Function to handle order cancellation
  const handleCancelOrder = async () => {
    try {
      const response = await axios.patch(
        `${url}/order/cancelOrder/${orderId}`,
        {},
        {
          headers: { "Content-Type": "application/json", auth: token },
        }
      );

      console.log("Cancel Order Response:", response.data);

      if (response.data.success) {
        toast.success("Order cancelled successfully");

        setOrder((prevOrder) => ({
          ...prevOrder,
          orderStatus: "CANCELLED",
        }));

        setIsCancelModalOpen(false);
      } else {
        toast.error(response.data.message || "Failed to cancel order.");
      }
    } catch (error) {
      console.error("Cancel Order Error:", error);
      toast.error(error.response?.data?.message || "Error cancelling order.");
    }
  };

  // console.log("$", order);
  //Make Payment Code
  const makePayment = async () => {
    const stripe = await loadStripe(
      "pk_test_51QrzxZQ2RtGhS2dHn7hUburYkyjhamIyAXKIyLYx8NRrpAsm9WRdc9S9gcxe1rpB0dq9WbVUzaRxywUQv0UlBkFt00nEiS0lmV"
    );

    const body = {
      products: order,
    };
    const headers = {
      "Content-Type": "application/json",
    };

    const response = await fetch("http://localhost:1000/api/payment/stripe", {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
    });

    console.log("Response", response);
    const session = await response.json();

    console.log("SessionID", session.id);
    console.log("Session Response:", session);

    const result = stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.err) {
      console.log(result.err);
    }
  };

  const handleCheckboxChange = (productId) => {
    setSelectedProducts((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId); // Unselect
      } else {
        return [...prev, productId]; // Select
      }
    });
  };

  // console.log("ProductId", selectedProducts);

  const handleStartDelivery = async () => {
    if (selectedProducts.length === 0) {
      toast.error("Please select at least one product to start delivery.");
      return;
    }

    console.log("Order ID:", orderId);
    console.log("Selected Product IDs:", selectedProducts);

    try {
      const response = await axios.patch(
        `${url}/order/update`,
        {
          orderId: orderId,
          productId: selectedProducts, // <-- Match the Postman key
          action: "IN_TRANSIT",
        },
        {
          headers: { "Content-Type": "application/json", auth: token },
        }
      );

      if (response.data.success) {
        toast.success("Delivery started. OTPs generated.");
        // setIsOtpModalOpen(true);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error starting delivery:", error);
      toast.error("Failed to start delivery.");
    }
  };

  const handleVerifyOtp = async (productId) => {
    try {
      // console.log("%", productId);
      const response = await axios.post(
        `${url}/order/verifyOtp`,
        {
          orderId: orderId,
          productId,
          otp,
        },
        {
          headers: { "Content-Type": "application/json", auth: token },
        }
      );

      console.log("Otp", response.data);
      if (response.data.success) {
        toast.success("Order completed successfully!");
        setOrder((prevOrder) => ({
          ...prevOrder,
          orderStatus: "COMPLETED",
        }));
        // setIsOtpModalOpen(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("Failed to verify OTP || Check the payemnt status.");
    }
  };

  // console.log("@", order);
  if (loading) return <p>Loading...</p>;
  if (!order) return <p>Failed to fetch order.</p>;

  return (
    <>
      <div className="max-w-screen-2xl mx-auto mt-6">
        {/* Main Container for Order Details */}
        <div className="flex flex-col xl:flex-row gap-8">
          {/* Order Details */}
          <div className="flex-[3] bg-white p-6 shadow-lg rounded-lg">
            <div className="mb-4">
              <nav className="text-sm text-gray-600 mb-2">
                <span className="text-blue-500 cursor-pointer">Home</span>
                <span className="mx-2"> &gt; </span>
                <span className="text-gray-800">Order</span>
                <span className="mx-2"> &gt; </span>
                <span className="text-gray-800">Order Detail</span>
                {/* <span className="mx-2"> &gt; </span> */}
                {/* <span className="text-gray-800">Order Details</span> */}
              </nav>
              {/* <h1 className="text-2xl font-semibold text-gray-800">
                Order Details
              </h1> */}
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-start gap-2">
                <p
                  className={`text-white text-xs font-semibold px-2 py-1 rounded-md shadow ${
                    order.orderStatus === "COMPLETED"
                      ? "bg-green-600"
                      : order.orderStatus === "IN_TRANSIT"
                      ? "bg-blue-600"
                      : order.orderStatus === "CANCELLED"
                      ? "bg-red-500"
                      : "bg-yellow-500"
                  }`}
                >
                  {order.orderStatus}
                </p>
                <p className="font-semibold text-lg text-purple-600">
                  Order ID: {order._id}
                </p>
              </div>

              {Array.isArray(order.products) &&
                order.products.map((item) => (
                  <div
                    key={item._id}
                    className="flex flex-col md:flex-row gap-6 p-4 border-b border-gray-300"
                  >
                    <div className="w-full md:w-2/3 flex gap-4">
                      <div className="relative w-40 h-32">
                        <img
                          src={
                            item.image
                              ? `${imgUrl}/${item.image.replace(/\\/g, "/")}`
                              : "/placeholder.jpg"
                          }
                          alt={item.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <div className="flex flex-col justify-between">
                        <h2 className="text-lg font-semibold">{item.name}</h2>
                        <p className="text-gray-600">
                          {item.description
                            ? item.description
                                .split(" ")
                                .slice(0, 8)
                                .join(" ") + "..."
                            : "No description available"}
                        </p>
                        <p className="text-gray-600">Price: ₹{item.price}</p>
                        <p className="text-gray-600">Quantity: {item.qty}</p>
                        <p
                          className={`text-white text-xs font-semibold px-2 py-1 rounded-md shadow w-fit ${
                            item.productStatus === "COMPLETED"
                              ? "bg-green-600"
                              : item.productStatus === "IN_TRANSIT"
                              ? "bg-blue-600"
                              : item.productStatus === "CANCELLED"
                              ? "bg-red-500"
                              : "bg-yellow-500"
                          }`}
                        >
                          {item.productStatus || "PENDING"}
                        </p>
                      </div>

                      <div className="w-full md:w-1/3 flex items-start justify-end">
                        {userInfo.user.role === "1" &&
                          order.orderStatus === "IN_TRANSIT" && (
                            <p className="text-blue-600 font-semibold animate-bounce">
                              Your Otp is: {item.deliveryOtp}
                            </p>
                          )}
                      </div>
                    </div>

                    {/* Show checkbox for product selection */}
                    {userInfo.user.role == "2" &&
                      order.orderStatus !== "COMPLETED" &&
                      order.orderStatus !== "IN_TRANSIT" &&
                      order.orderStatus !== "CANCELLED" && (
                        <div className="w-full md:w-1/3 flex items-start justify-end">
                          <input
                            type="checkbox"
                            checked={selectedProducts.includes(item._id)}
                            onChange={() => handleCheckboxChange(item._id)}
                            className="w-5 h-5 accent-blue-500 cursor-pointer"
                          />
                        </div>
                      )}

                    {userInfo.user.role == "2" &&
                      order.orderStatus !== "COMPLETED" &&
                      order.orderStatus !== "IN_TRANSIT" &&
                      order.orderStatus !== "CANCELLED" && (
                        <div className="w-full md:w-1/3 flex items-start justify-end">
                          <button
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md"
                            onClick={handleStartDelivery}
                          >
                            Start Delivery
                          </button>
                        </div>
                      )}

                    {/* OTP & Delivery handling for IN_TRANSIT */}
                    {userInfo.user.role === "2" &&
                      order.orderStatus === "IN_TRANSIT" && (
                        <div className="w-full md:w-1/3 flex items-start justify-end">
                          <button
                            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md"
                            onClick={() => handleAddOtpClick(item._id)}
                          >
                            Add OTP
                          </button>
                        </div>
                      )}
                  </div>
                ))}

              {/* OTP Verification */}
              {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
                  <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                    <h2 className="text-xl font-semibold mb-4">Enter OTP</h2>
                    <input
                      type="text"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex justify-end gap-4 mt-4">
                      <button
                        className="px-4 py-2 bg-green-400 text-white rounded-lg hover:bg-green-500"
                        onClick={() => handleVerifyOtp(selectedProduct)}
                      >
                        Verify
                      </button>
                      <button
                        className="px-4 py-2 bg-red-400 text-white rounded-lg hover:bg-red-00"
                        onClick={() => setIsModalOpen(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Buyer Details */}
              <div className="flex flex-col gap-4 p-6 border-b border-gray-300">
                <p className="font-semibold text-lg">Buyer Info:</p>
                <p>
                  <strong>Name:</strong> {order.buyerInfo.firstName}{" "}
                  {order.buyerInfo.middleName} {order.buyerInfo.lastName}
                </p>
                <p>
                  <strong>Email:</strong> {order.buyerInfo.email}
                </p>
                <p>
                  <strong>Contact:</strong> {order.buyerInfo.contact}
                </p>
                <p>
                  <strong>Delivery Address:</strong> {order.address.myAddress}
                </p>
                {["CANCELLED", "COMPLETED"].includes(
                  order.orderStatus
                ) ? null : (
                  <>
                    <p>
                      Payment:{" "}
                      <span
                        className={`font-bold ${
                          order.paymentStatus === "SUCCESS"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Price Summary */}
          <div className="flex-[1] p-6 bg-gray-100 shadow-lg rounded-lg w-[300px] h-[200px]">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 text-center">
              Price Summary
            </h2>
            <div className="flex justify-between text-gray-600">
              <p>Subtotal:</p>
              <p className="font-semibold">₹{order.subtotal}</p>
            </div>
            <div className="flex justify-between text-gray-600">
              <p>Total Items:</p>
              <p className="font-semibold">{order.noOfProducts}</p>
            </div>
            <div className="flex justify-between text-gray-600">
              <p>Delivery:</p>
              <p className="font-semibold">₹{order.delivery}</p>
            </div>
            <hr className="my-3" />
            <div className="flex justify-between text-lg font-bold">
              <p>Total:</p>
              <p>₹{order.total}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Buttons */}
      {order.orderStatus !== "CANCELLED" &&
        order.orderStatus !== "COMPLETED" &&
        order.paymentStatus !== "SUCCESS" && (
          <div className="flex justify-center items-center mt-4 mb-6 w-full gap-6">
            <button
              className="bg-red-400 hover:bg-red-500 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition duration-300"
              onClick={() => setIsCancelModalOpen(true)}
            >
              Cancel Order
            </button>
            {userInfo.user.role == "1" && (
              <button
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition duration-300"
                onClick={makePayment}
              >
                Make Payment
              </button>
            )}
          </div>
        )}

      {/* Modal */}
      {isCancelModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
            <h2 className="text-lg font-semibold mb-4">
              Are you sure you want to cancel the order?
            </h2>
            <div className="flex justify-between mt-4">
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded-lg"
                onClick={() => setIsCancelModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
                onClick={handleCancelOrder}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderDetails;

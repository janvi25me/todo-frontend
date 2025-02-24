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
  const { url, token, imgUrl } = useContext(AuthContext);
  const { orderId } = useParams();

  // const handleRemove = (pid) => {
  //   removeProductFromCart(pid);
  // };

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

  // Function to handle order cancellation
  const handleCancelOrder = async () => {
    try {
      const response = await axios.post(
        `${url}/order/cancelOrder/${orderId}`,
        {},
        {
          headers: { "Content-Type": "application/json", auth: token },
        }
      );

      if (response.data.success) {
        toast.success("Order cancelled successfully");
        setOrder((prevOrder) => ({
          ...prevOrder,
          orderStatus: "CANCELLED",
        }));
      } else {
        toast.error("Failed to cancel order.");
      }
    } catch (error) {
      toast.error("Error cancelling order.", error);
    } finally {
      setIsModalOpen(false);
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

  if (loading) return <p>Loading...</p>;
  if (!order) return <p>Failed to fetch order.</p>;

  return (
    <>
      <div className="max-w-screen-2xl mx-auto mt-6">
        {/* Main Container for Order Details */}
        <div className="flex flex-col xl:flex-row gap-8">
          {/* Order Details */}
          <div className="flex-[3] bg-white p-6 shadow-lg rounded-lg">
            <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
              Order Details
            </h1>

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
                        <p className="text-gray-600">{item.description}</p>
                        <p className="text-gray-600">Price: ₹{item.price}</p>
                        <p className="text-gray-600">Quantity: {item.qty}</p>
                      </div>
                    </div>
                  </div>
                ))}

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

                    <p>
                      Delivery:{" "}
                      <span className="text-blue-600">
                        {" "}
                        <strong>{order.deliveryStatus}</strong>
                      </span>
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

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
        order.paymentStatus !== "SUCCESS" && ( // Disable payment if already successful
          <div className="flex justify-center items-center mt-4 mb-6 w-full gap-6">
            <button
              className="bg-red-400 hover:bg-red-500 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition duration-300"
              onClick={() => setIsModalOpen(true)}
            >
              Cancel Order
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition duration-300"
              onClick={makePayment}
            >
              Make Payment
            </button>
          </div>
        )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
            <h2 className="text-lg font-semibold mb-4">
              Are you sure you want to cancel the order?
            </h2>
            <div className="flex justify-between mt-4">
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded-lg"
                onClick={() => setIsModalOpen(false)}
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

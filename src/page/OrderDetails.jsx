import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext"; // Import context
import axios from "axios";

const OrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { createOrder, cart, selectedDeliverAddress } = useContext(AuthContext);

  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!orderId) {
      placeOrder();
    } else {
      fetchOrder(orderId);
    }
  }, [orderId]);

  const placeOrder = async () => {
    if (!cart?.data?.items?.length) {
      alert("Your cart is empty.");
      navigate("/cart");
      return;
    }

    if (!selectedDeliverAddress) {
      alert("Please select a delivery address.");
      navigate("/cart");
      return;
    }

    try {
      const response = await createOrder(selectedDeliverAddress, cart.data);
      const newOrderId = response?.data?._id;
      navigate(`/orderDetails/${newOrderId}`);
    } catch (error) {
      console.error("Error creating order:", error);
    }
  };

  const fetchOrder = async (id) => {
    try {
      const response = await axios.get(`/api/orders/${id}`);
      setOrder(response.data);
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

  if (!order) return <p>Loading order details...</p>;

  return (
    <div>
      <h1>Order Summary</h1>
      <p>Order ID: {order._id}</p>
      <p>Total: ₹{order.total}</p>
      <p>Status: {order.status}</p>
      <h2>Items:</h2>
      {order.items.map((item) => (
        <div key={item._id}>
          <p>
            {item.name} - ₹{item.price} x {item.qty}
          </p>
        </div>
      ))}
    </div>
  );
};

export default OrderDetails;

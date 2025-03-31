import { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";

const Cart = () => {
  const {
    cart,
    removeProductFromCart,
    selectedDeliverAddress,
    token,
    imgUrl,
    url,
  } = useContext(AuthContext);
  // console.log("Cart", cart);
  const navigate = useNavigate();

  const handleRemove = (pid) => {
    removeProductFromCart(pid);
  };

  const handlePlaceOrder = async () => {
    if (!cart?.data?.items?.length) {
      toast.error("Your cart is empty.");
      return;
    }

    if (!selectedDeliverAddress) {
      toast.error("Please select a delivery address.");
      return;
    }

    try {
      const response = await axios.post(
        `${url}/order/createOrder`,
        {
          // items: cart.data.items,
          // total: cart.data.total,
          // delivery: cart.data.delivery,
          // address: selectedDeliverAddress,
        },
        {
          headers: { "Content-Type": "application/json", auth: token },
        }
      );

      if (response.data.success) {
        toast.success("Order placed successfully!");
        navigate(`/orderDetails/${response.data.data._id}`);
      } else {
        toast.error("Failed to place order. Try again.");
      }
    } catch (error) {
      console.error(
        "Error placing order:",
        error.response?.data || error.message
      );
      toast.error("Failed to place order. Try again.");
    }
  };

  return (
    <>
      <div className="bg-white p-6 rounded-lg ">
        <div className="mb-4">
          <nav className="text-sm text-gray-600 mb-2">
            <span className="text-blue-500 cursor-pointer">Home</span>
            <span className="mx-2"> &gt; </span>
            <span className="text-gray-800">Products</span>
            <span className="mx-2"> &gt; </span>
            <span className="text-gray-800">Cart</span>
          </nav>
          {/* <h1 className="text-2xl font-semibold text-gray-800">Orders</h1> */}
        </div>

        {cart?.data?.items?.length > 0 ? (
          cart.data.items.map((item) => {
            const imagePath = item?.image?.replace(/\\/g, "/");
            return (
              <div
                key={item?._id}
                className="bg-gray-100 p-4 mb-4 rounded-lg shadow border border-gray-300 flex justify-between items-center"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={`${imgUrl}/${imagePath}`}
                    alt={item?.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div>
                    <p className="text-lg font-bold text-purple-800">
                      {item?.name}
                    </p>
                    <p className="text-sm text-gray-600">₹ {item?.price}</p>
                    <p className="text-sm text-gray-600">
                      Quantity: {item?.qty}
                    </p>
                  </div>
                </div>
                <button
                  className="px-2 py-1 text-red-800 border border-red-800 rounded-lg hover:bg-red-800 hover:text-white transition"
                  onClick={() => handleRemove(item?._id)}
                >
                  Remove
                </button>
              </div>
            );
          })
        ) : (
          <div className="text-center text-lg text-gray-600">
            <p>No products in the cart.</p>
            <div className="mt-4 text-center text-sm">
              <Link
                to="/product"
                className="px-2 py-2 bg-purple-500 rounded-lg hover:bg-purple-600 text-white transition"
              >
                Shop Now
              </Link>
            </div>
          </div>
        )}

        {cart?.data?.items?.length > 0 && (
          <div className="border-b-2 border-gray-300 pb-6 mt-4 mb-6">
            <h1 className="text-2xl font-semibold text-center text-purple-800 mb-6">
              Cart Details
            </h1>
            <div className="flex justify-between items-start">
              <div className="w-1/2 pr-6"></div>
              <div className="w-1/2 pl-6 text-right">
                <h2 className="text-xl font-bold text-gray-800 mb-4">
                  Price Details
                </h2>
                <p className="text-lg text-gray-600">
                  <span className="font-semibold text-gray-800">Subtotal:</span>{" "}
                  ₹{cart?.data?.subtotal}
                </p>
                <p className="text-lg text-gray-600">
                  <span className="font-semibold text-gray-800">
                    Delivery Charges:
                  </span>{" "}
                  ₹{cart?.data?.delivery}
                </p>
                <p className="text-lg text-gray-600">
                  <span className="font-semibold text-gray-800">Total:</span> ₹
                  {cart?.data?.total}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col items-center justify-center mt-10">
          <h2 className="text-2xl font-semibold text-purple-800 mb-6 text-center">
            Delivery Address
          </h2>
          {selectedDeliverAddress ? (
            <p className="bg-gray-100 p-4 mb-4 rounded-lg shadow border border-gray-300 text-center">
              <span className="block text-black font-semibold">
                {selectedDeliverAddress.myAddress}
              </span>
            </p>
          ) : (
            <p className="text-red-500 text-center">
              No address selected.{" "}
              <Link to="/address" className="text-blue-500 underline">
                Add Delivery Address
              </Link>
            </p>
          )}
        </div>

        {selectedDeliverAddress && cart?.data?.items?.length > 0 && (
          <div className="flex justify-center mr-3 mt-4">
            <button
              onClick={handlePlaceOrder}
              className="bg-green-500 text-white py-2 px-4 rounded-sm shadow hover:bg-green-600 transition"
            >
              Place Order ({cart.data.noOfProducts})
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;

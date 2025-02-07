import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Cart = () => {
  const {
    cart,
    removeProductFromCart,
    // address,
    selectedDeliverAddress,
    baseUrl,
    url,
    // createOrder,
  } = useContext(AuthContext);

  // console.log("address", selectedDeliverAddress);

  const navigate = useNavigate();

  const handleRemove = (pid) => {
    removeProductFromCart(pid);
  };

  // const handlePlaceOrder = async () => {
  //   if (!cart?.data?.items?.length) {
  //     alert("Your cart is empty.");
  //     return;
  //   }

  //   if (!selectedDeliverAddress) {
  //     alert("Please select a delivery address.");
  //     return;
  //   }

  //   try {
  //     const orderResponse = await createOrder(
  //       selectedDeliverAddress,
  //       cart.data
  //     );

  //     navigate(`/orderDetails/${orderResponse?.data?._id}`);
  //   } catch (error) {
  //     console.error("Error placing order:", error);
  //   }
  // };

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center text-purple-800 mb-6 mt-5">
          Products
        </h2>

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
                    src={`${baseUrl || url}/${imagePath}`}
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
          <div className="text-center text-2xl text-gray-600">
            <p>No products in the cart.</p>
            <div className="mt-4 text-center text-lg">
              <Link
                to="/product"
                className="px-2 py-2 bg-purple-500 rounded-lg hover:bg-purple-600 text-white transition"
              >
                Shop Now
              </Link>
            </div>
          </div>
        )}

        <div className="border-b-2 border-gray-300 pb-6 mb-6">
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
                <span className="font-semibold text-gray-800">Subtotal:</span> ₹
                {cart?.data?.subTotal}
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

        <div>
          <h2 className="text-2xl font-semibold text-center text-purple-800 mb-6">
            Delivery Address
          </h2>
          {selectedDeliverAddress ? (
            <p className="text-gray-700 font-medium">
              <span className="block text-black font-semibold">
                {selectedDeliverAddress.myAddress}
              </span>
            </p>
          ) : (
            <p className="text-red-500">
              No address selected.<Link>Add Delivery address</Link>{" "}
            </p>
          )}
        </div>

        {selectedDeliverAddress && cart?.data?.items?.length > 0 && (
          <div className="flex justify-center mr-3 mt-4">
            <button
              onClick={() => navigate("/orderDetails")}
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

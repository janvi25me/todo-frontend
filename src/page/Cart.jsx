import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

// import { toast, Toaster } from "sonner";

const Cart = () => {
  const {
    userInfo,
    cart,
    removeProductFromCart,
    address,
    selectedDeliverAddress,
    baseUrl,
    url,
    createOrder,
    // updateDefaultAddress,
  } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleRemove = (pid) => {
    removeProductFromCart(pid);
  };
  const handlePlaceOrder = async () => {
    if (!cart?.data?.items?.length) {
      alert("Your cart is empty.");
      return;
    }

    if (!selectedDeliverAddress) {
      alert("Please select a delivery address.");
      return;
    }

    await createOrder();

    navigate("/order");
  };
  const handleAddAddress = () => {
    navigate("/address");
  };

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        {/* Products */}
        <div>
          <h2 className="text-3xl font-semibold text-center text-purple-800 mb-6 mt-5">
            Products
          </h2>
          <div>
            {cart?.data?.items?.length > 0 ? (
              cart.data.items.map((item) => {
                const imagePath = item?.image?.replace(/\\/g, "/");

                // console.log(cart.data);

                return (
                  <div
                    key={item?._id}
                    className="bg-gray-100 p-4 mb-4 rounded-lg shadow border border-gray-300 flex justify-between items-center"
                  >
                    <div className="flex items-center space-x-4">
                      {/* Image of the product */}
                      <img
                        src={`${baseUrl || url}/${imagePath}`}
                        alt={item?.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div>
                        <p className="text-lg font-bold text-purple-800">
                          {item?.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {item?.description}
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
              <>
                <div className="text-center text-2xl text-gray-600">
                  <p>No products in the cart.</p>
                </div>
                <div className="mt-4 text-center text-lg">
                  <Link
                    to="/product"
                    className="px-2 py-2 bg-purple-500 rounded-lg hover:bg-purple-600 text-white transition"
                  >
                    Shop Now
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>

        {/* cart Details */}
        <div className="border-b-2 border-gray-300 pb-6 mb-6">
          <h1 className="text-2xl font-semibold text-center text-purple-800 mb-6">
            Cart Details
          </h1>

          <div className="flex justify-between items-start">
            <div className="w-1/2 pr-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Buyer Details
              </h2>
              <div className="flex flex-col space-y-2">
                {/* <p className="text-lg text-gray-600">
                  <span className="font-semibold text-gray-800">Id:</span>&nbsp;
                  {cart?.data?.buyerId}
                </p> */}
                <p className="text-lg text-gray-600">
                  <span className="font-semibold text-gray-800">
                    Full Name:
                  </span>
                  &nbsp;
                  {userInfo?.user?.firstName} {userInfo?.user?.lastName}
                </p>
                <p className="text-lg text-gray-600">
                  <span className="font-semibold text-gray-800">Email:</span>
                  &nbsp;
                  {userInfo?.user?.email}
                </p>
                <p className="text-lg text-gray-600">
                  <span className="font-semibold text-gray-800">Role:</span>
                  &nbsp;
                  {userInfo?.user?.role === "1" ? "Buyer" : "Seller"}
                </p>
              </div>
            </div>

            <div className="w-1/2 pl-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 text-right">
                Price Details
              </h2>
              <div className="flex flex-col space-y-2 text-right">
                <p className="text-lg text-gray-600">
                  <span className="font-semibold text-gray-800">
                    Subtotal (Items):
                  </span>
                  &nbsp;₹{cart?.data?.subTotal}
                </p>
                <p className="text-lg text-gray-600">
                  <span className="font-semibold text-gray-800">
                    Delivery Charges:
                  </span>
                  &nbsp;₹{cart?.data?.delivery}
                </p>
                <p className="text-lg text-gray-600">
                  <span className="font-semibold text-gray-800">Total:</span>
                  &nbsp;₹
                  {cart?.data?.total}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        {cart?.data?.items?.length > 0 && (
          <div>
            <h1 className="text-2xl font-semibold text-center text-purple-800 mb-6">
              Delivery Address
            </h1>
            <div className="bg-gray-100 border border-gray-300 rounded-md p-4 text-center">
              {address ? (
                <>
                  {selectedDeliverAddress ? (
                    <div className="mb-4">
                      <p className="text-gray-700 font-medium">
                        Selected Delivery Address:
                        <span className="block text-black font-semibold">
                          {selectedDeliverAddress.myAddress}
                        </span>
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className=" mt-4">
                        <p className="text-red-500 text-md">
                          No address selected. Please select a delivery
                          address..{" "}
                          <button
                            onClick={handleAddAddress}
                            className="text-blue-500 underline"
                          >
                            Add Delivery Address
                          </button>
                        </p>
                      </div>
                    </>
                  )}
                </>
              ) : (
                <p className="text-red-500 text-md">
                  No address data available.
                </p>
              )}
            </div>
          </div>
        )}

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

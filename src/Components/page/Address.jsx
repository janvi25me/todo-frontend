import { useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext";
import { toast } from "sonner";

const Address = () => {
  const { address, setAddress, token, updateDefaultAddress } =
    useContext(AuthContext);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupType, setPopupType] = useState("");
  const [currentAddress, setCurrentAddress] = useState("");
  const [editId, setEditId] = useState("");
  const url = "http://localhost:1000/api";

  // console.log("In address page", address);
  const addAddress = async () => {
    if (!currentAddress.trim()) {
      toast.error("Address cannot be empty");
      return;
    }

    try {
      const response = await axios.post(
        `${url}/address/addAddress`,
        { myAddress: currentAddress },
        {
          headers: {
            "Content-Type": "application/json",
            auth: token,
          },
          withCredentials: true,
        }
      );

      const newAddress = {
        ...response.data.address,
        isDefault: response.data.address.isDefault ?? false,
      };

      setAddress((prev) => [...prev, newAddress]);
      setIsPopupOpen(false);
      setCurrentAddress("");
      toast.success("Address added successfully");
    } catch (err) {
      console.error("Error adding address:", err);
      toast.error("Error adding Address");
    }
  };

  const editAddress = async (eid) => {
    if (!currentAddress.trim()) {
      toast.error("Address cannot be empty");
      return;
    }

    try {
      const response = await axios.patch(
        `${url}/address/editAddress/${eid}`,
        { myAddress: currentAddress },
        {
          headers: {
            "Content-Type": "application/json",
            auth: token,
          },
          withCredentials: true,
        }
      );

      setAddress((prev) =>
        prev.map((item) =>
          item._id === eid ? { ...item, myAddress: currentAddress } : item
        )
      );
      console.log("Update address", response.data);
      setIsPopupOpen(false);
      setCurrentAddress("");
      toast.success("Address updated successfully");
    } catch (err) {
      console.error("Error editing address:", err);
      toast.error("Error updating address");
    }
  };

  const deleteAddress = async (rid) => {
    try {
      await axios.delete(`${url}/address/deleteAddress/${rid}`, {
        headers: {
          "Content-Type": "application/json",
          auth: token,
        },
        withCredentials: true,
      });
      setAddress((prev) => prev.filter((item) => item._id !== rid));
      toast.info("Address deleted successfully");
    } catch (err) {
      console.error("Error deleting address:", err);
      toast.error("Error deleting address");
    }
  };

  const handleAddSubmit = () => {
    addAddress();
  };

  const handleEditSubmit = () => {
    editAddress(editId);
  };

  const handleDefaultAddressChange = async (aid) => {
    try {
      await updateDefaultAddress(aid);
      setAddress((prev) =>
        prev.map((item) =>
          item._id === aid
            ? { ...item, isDefault: true }
            : { ...item, isDefault: false }
        )
      );
    } catch (err) {
      console.error("Error setting default address:", err);
    }
  };
  // console.log("adderss", address);
  return (
    <>
      <div>
        <div className="mb-4">
          <nav className="text-sm text-gray-600 mb-2 mx-5">
            <span className="text-blue-500 cursor-pointer">Home</span>
            <span className="mx-3"> &gt; </span>
            <span className="text-gray-800">Address</span>
          </nav>
        </div>

        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md mx-auto mt-10 mb-10">
          <div className="flex justify-center mb-6">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => {
                setPopupType("add");
                setIsPopupOpen(true);
              }}
            >
              Add Address
            </button>
          </div>
          {/* Address List */}

          {address && address.length > 0 ? (
            address.map((item) => {
              const isDefault = item.isDefault;
              return (
                <div
                  key={item._id}
                  className="mb-4 p-4 border-b border-gray-200"
                >
                  <div className="flex justify-between items-center mb-2"></div>
                  <div className="flex gap-2 items-center text-xs">
                    <input
                      type="radio"
                      name="defaultAddress"
                      value={item._id}
                      checked={isDefault}
                      className="mr-2"
                      onChange={() => handleDefaultAddressChange(item._id)}
                    />
                    <div className="mb-2">
                      <p
                        className={`text-lg ${
                          isDefault
                            ? "text-yellow-600 font-bold"
                            : "text-gray-800"
                        }`}
                      >
                        {item.myAddress}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 text-xs ml-8">
                    <button
                      className="px-3 py-1 border border-gray-300 text-gray-600  rounded-lg"
                      onClick={() => {
                        setPopupType("edit");
                        setCurrentAddress(item.myAddress);
                        setEditId(item._id);
                        setIsPopupOpen(true);
                      }}
                    >
                      Update
                    </button>
                    <button
                      className="px-3 py-1 border border-gray-300 text-gray-600 rounded-lg"
                      onClick={() => deleteAddress(item._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-lg text-gray-500 text-center">
              No address data available.
            </p>
          )}

          {/* Popup */}
          {isPopupOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-4">
                  {popupType === "add" ? "Add Address" : "Edit Address"}
                </h2>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded mb-4"
                  rows="4"
                  value={currentAddress}
                  onChange={(e) => setCurrentAddress(e.target.value)}
                ></textarea>
                <div className="flex justify-end gap-2">
                  <button
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                    onClick={() => setIsPopupOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    onClick={
                      popupType === "add" ? handleAddSubmit : handleEditSubmit
                    }
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Address;

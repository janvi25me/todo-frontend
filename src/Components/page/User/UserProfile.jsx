import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./UserProfile.css";
import { toast } from "sonner";

const UserProfile = () => {
  const url = "http://localhost:1000/api";
  const navigate = useNavigate();

  const { userInfo, selectedDeliverAddress } = useContext(AuthContext);
  const token = userInfo?.user?.token;

  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [userImage, setUserImage] = useState(null);

  // Get Profile Image API
  const getUserProfile = async () => {
    try {
      const response = await axios.get(`${url}/user/profile/getProfile`, {
        headers: {
          auth: token,
        },
        withCredentials: true,
      });

      // console.log("From the userProfile API", response.data);
      setUserImage(response.data.profileImage);
    } catch (err) {
      toast.error("Error fetching profile:", err);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Post Image API
  const handleImageUpload = async () => {
    if (!selectedImage) {
      alert("Please select an image first");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      const response = await axios.post(`${url}/user/profile`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          auth: token,
        },
        withCredentials: true,
      });
      toast.success("Profile Image added successfully");
      console.log("Image uploaded:", response.data);
      setUserImage(response.data.profileImage);
    } catch (err) {
      toast.error("Error uploading image:", err);
    }
  };

  const handleAddAddress = () => {
    navigate("/address");
  };

  const handleYourOrders = () => {
    navigate("/order/history");
  };

  useEffect(() => {
    if (token) {
      getUserProfile();
    }
  }, [token]);

  return (
    <div className="p-5">
      <h1 className="text-center text-xl mb-5">User Profile</h1>
      <div className="flex justify-center items-center">
        <div className="w-full max-w-lg">
          <div className="border p-5 rounded-lg shadow-lg">
            <div className="mb-5 text-center">
              <strong>Email:</strong>{" "}
              {userInfo?.user?.email || "No email available"}
            </div>
            <div className="mb-5 text-center">
              <strong>Name:</strong> {userInfo?.user?.firstName}{" "}
              {userInfo?.user?.lastName || "No last name available"}
            </div>

            {/* Image Upload Section */}
            <div className="text-center">
              <input
                type="file"
                onChange={handleImageChange}
                accept="image/*"
                className="border p-2 rounded-md"
              />
              <button
                onClick={handleImageUpload}
                className="mt-2 px-4 py-2 border rounded-md bg-blue-500 text-white"
              >
                Upload Image
              </button>

              {/* Image Preview Section */}
              {imagePreview && (
                <div className="mt-3 flex justify-center">
                  <img
                    src={imagePreview}
                    alt="Image Preview"
                    className="w-32 h-32 object-cover rounded-full"
                  />
                </div>
              )}

              {/* Display User's Profile Image */}
              {userImage && !imagePreview && (
                <div className="mt-3 flex justify-center">
                  <img
                    src={userImage}
                    alt="User Profile"
                    className="w-32 h-32 object-cover rounded-full"
                  />
                </div>
              )}
            </div>

            {/* Delivery Address Section */}
            {userInfo?.user?.role === "1" &&
              (selectedDeliverAddress ? (
                <div className="mb-4">
                  <p className="text-gray-700 font-medium pt-3">
                    <i className="fa-solid fa-location-dot"></i> Selected
                    Delivery Address:
                    <span className="block text-black font-semibold pb-3">
                      {selectedDeliverAddress.myAddress}
                    </span>
                  </p>
                </div>
              ) : (
                <div className="mt-4">
                  <p className="text-gray-700 font-medium">
                    You don{"'"}t have a delivery address yet.{" "}
                    <button
                      onClick={handleAddAddress}
                      className="text-blue-500 underline"
                    >
                      Add Delivery Address
                    </button>
                  </p>
                </div>
              ))}

            {/* Your Orders Button */}
            <div className="mt-5 text-center">
              <button
                onClick={handleYourOrders}
                className="px-4 py-2 border rounded-md bg-green-500 text-white"
              >
                <i className="fa-solid fa-clock-rotate-left"></i> &nbsp; Order
                History
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

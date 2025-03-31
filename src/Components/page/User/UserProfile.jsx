import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../Context/AuthContext";
import { toast } from "sonner";

const UserProfile = () => {
  const url = "http://localhost:1000/api";

  const { userInfo, selectedDeliverAddress } = useContext(AuthContext);
  const token = userInfo?.user?.token;

  const [imagePreview, setImagePreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [userImage, setUserImage] = useState(null);

  // Fetch user profile data
  const getUserProfile = async () => {
    try {
      const response = await axios.get(`${url}/user/profile/getProfile`, {
        headers: { auth: token },
        withCredentials: true,
      });

      if (response.data.image) {
        const imagePath = response.data.image.replace(/\\/g, "/");
        setUserImage(`${url.replace("/api", "")}/${imagePath}`);
      }
    } catch (err) {
      toast.error("Error fetching profile:", err);
    }
  };

  // Handle image upload
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

      if (response.data.profileImage) {
        const imagePath = response.data.profileImage.replace(/\\/g, "/");
        setUserImage(`${url.replace("/api", "")}/${imagePath}`);
      }
      setImagePreview(null);
      setSelectedImage(null);
    } catch (err) {
      toast.error("Error uploading image:", err);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (token) getUserProfile();
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white p-6 rounded-2xl shadow-xl">
        <div className="mb-4">
          <nav className="text-sm text-gray-600 mb-2">
            <span className="text-blue-500 cursor-pointer">Home</span>
            <span className="mx-2"> &gt; </span>
            <span className="text-gray-800">User Profile</span>
          </nav>
        </div>

        <div className="flex flex-col items-center">
          {userImage ? (
            <img
              src={userImage}
              alt="User Profile"
              className="w-40 h-40 object-cover rounded-full border-4 border-gray-300 shadow-md"
            />
          ) : (
            <div className="w-40 h-40 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-full">
              <span className="text-gray-400">No Image</span>
            </div>
          )}

          <div className="mt-4">
            <input
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
              id="upload"
            />
            <label
              htmlFor="upload"
              className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              {userImage ? "Update Profile Image" : "Add Image"}
            </label>
            {selectedImage && (
              <button
                onClick={handleImageUpload}
                className="ml-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                Upload
              </button>
            )}
          </div>
        </div>

        <div className="mt-6">
          <p className="text-lg">
            <strong>Name:</strong> {userInfo?.user?.firstName}{" "}
            {userInfo?.user?.lastName}
          </p>
          <p className="text-lg">
            <strong>Email:</strong> {userInfo?.user?.email}
          </p>
        </div>

        {userInfo?.user?.role === "1" && selectedDeliverAddress && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold">
              {" "}
              <i className="fa-solid fa-location-dot mr-2"></i>Shipping Address
            </h2>
            <p className="text-gray-700 mt-2">
              {selectedDeliverAddress.myAddress}
            </p>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            to="/order/history"
            className="inline-block bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg text-lg shadow-md"
          >
            <i className="fa-solid fa-clock-rotate-left mr-2"></i>
            View Order History
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

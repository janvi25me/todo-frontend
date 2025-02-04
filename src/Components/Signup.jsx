import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { userValidationSchema } from "./Validation";

const Signup = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(userValidationSchema),
  });

  const url = "http://localhost:1000/api/user";
  const selectedRoleName = watch("role");

  const signup = async (data) => {
    try {
      const formData = new FormData();
      for (const key in data) {
        if (key === "image" && data.image?.length > 0) {
          formData.append("image", data.image[0]);
        } else {
          formData.append(key, data[key]);
        }
      }

      for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      const response = await axios.post(`${url}/signup`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      toast.success("Success..Redirecting");
      console.log("Signup successful:", response);
      navigate("/login");
    } catch (err) {
      console.error("Error signing up", err);
      toast.error("Please try again");
    }
  };

  const onSubmit = (data) => {
    const roleMap = {
      buyer: "1",
      seller: "2",
    };

    const transformedData = {
      ...data,
      role: roleMap[data.role],
    };

    signup(transformedData);
    // console.log("Transformed data", transformedData);
  };

  return (
    <>
      <h3 className="text-center text-xl font-semibold mb-4">
        User Registration
      </h3>
      <div className="my-5 p-6 container mx-auto max-w-lg border-2 bg-gray-100 rounded-lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="relative mb-5">
            <input
              type="text"
              {...register("firstName", { required: "First Name is required" })}
              name="firstName"
              id="firstName"
              className="peer w-full px-3 pt-5 pb-2 border-2 border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              placeholder=" "
            />
            <label
              htmlFor="firstName"
              className="absolute left-3 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
            >
              FirstName
            </label>
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div className="relative mb-5">
            <input
              type="text"
              {...register("middleName", {
                required: "Middle Name is required",
              })}
              name="middleName"
              id="middleName"
              className="peer w-full px-3 pt-5 pb-2 border-2 border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              placeholder=" "
            />
            <label
              htmlFor="middleName"
              className="absolute left-3 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
            >
              MiddleName
            </label>
            {errors.middleName && (
              <p className="text-red-500 text-sm mt-1">
                {errors.middleName.message}
              </p>
            )}
          </div>

          <div className="relative mb-5">
            <input
              type="text"
              {...register("lastName", { required: "Last Name is required" })}
              name="lastName"
              id="lastName"
              className="peer w-full px-3 pt-5 pb-2 border-2 border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              placeholder=" "
            />
            <label
              htmlFor="lastName"
              className="absolute left-3 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
            >
              LastName
            </label>
            {errors.lastName && errors.lastName.message && (
              <p className="text-red-500 text-sm mt-1">
                {errors.lastName.message}
              </p>
            )}
          </div>

          <div className="relative mb-5">
            <input
              type="email"
              {...register("email")}
              name="email"
              id="email"
              className="peer w-full px-3 pt-5 pb-2 border-2 border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              placeholder=" "
            />
            <label
              htmlFor="email"
              className="absolute left-3 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
            >
              Email
            </label>
            {errors.email && errors.email.message && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="relative mb-5">
            <input
              type="password"
              {...register("password")}
              name="password"
              id="password"
              className="peer w-full px-3 pt-5 pb-2 border-2 border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              placeholder=" "
            />
            <label
              htmlFor="password"
              className="absolute left-3 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
            >
              Password
            </label>
            {errors.password && errors.password.message && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* <div className="relative mb-5">
            <input
              type="file"
              accept=".jpg, .png, .jpeg"
              {...register("image", { required: "Profile Image is required" })}
              name="image"
              id="image"
              className="peer w-full px-3 pt-5 pb-2 border-2 border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              placeholder=" "
            />
            <label
              htmlFor="image"
              className="absolute left-3 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
            >
              Profile Image
            </label>
            {errors.image && (
              <p className="text-red-500 text-sm mt-1">
                {errors.image.message}
              </p>
            )}
          </div> */}

          <div className="relative mb-5">
            <input
              type="text"
              {...register("contact")}
              name="contact"
              id="contact"
              className="peer w-full px-3 pt-5 pb-2 border-2 border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              placeholder=" "
            />
            <label
              htmlFor="contact"
              className="absolute left-3 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
            >
              Contact
            </label>
            {errors.contact && errors.contact.message && (
              <p className="text-red-500 text-sm mt-1">
                {errors.contact.message}
              </p>
            )}
          </div>

          {selectedRoleName === "seller" && (
            <div className="relative mb-5">
              <input
                type="text"
                {...register("shopName")}
                name="shopName"
                id="shopName"
                className="peer w-full px-3 pt-5 pb-2 border-2 border-gray-300 rounded-lg outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                placeholder=" "
              />
              <label
                htmlFor="shopName"
                className="absolute left-3 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-2 peer-focus:text-sm peer-focus:text-blue-500"
              >
                ShopName
              </label>
              {errors.shopName && errors.shopName.message && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.shopName.message}
                </p>
              )}
            </div>
          )}

          <div className="relative mb-5">
            <label htmlFor="role"></label>
            <select
              {...register("role")}
              name="role"
              id="role"
              defaultValue=""
              className="border border-gray-300 rounded-md p-2"
            >
              <option value="" disabled>
                Select Role
              </option>
              <option value="buyer"> 1. Buyer</option>
              <option value="seller">2. Seller</option>
            </select>
            {errors.role && (
              <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
            )}
          </div>

          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Signup;

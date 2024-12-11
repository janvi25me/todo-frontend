import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Toaster, toast } from "sonner";
import { userValidationSchema } from "./Validation";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";

const Login = () => {
  let navigate = useNavigate();

  const { token, setToken } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userValidationSchema),
  });

  //Signup API
  const login = async (data) => {
    try {
      const response = await axios.post(
        `http://localhost:1000/api/user/login`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      toast.success("Success..Redirecting");
      const apiToken = response.data.token;
      if (apiToken) {
        localStorage.setItem("token", token);
        setToken(apiToken);
      }

      // console.log("Login successful:", response.data);
      navigate("/");
    } catch (err) {
      console.log("Error signing in", err);
      toast.error("Please try again");
    }
  };

  const onSubmit = (data) => {
    // console.log("Form submitted successfully:", data);
    login(data);
  };

  return (
    <>
      <Toaster richColors position="top-right" />
      <div className="my-5 p-6 container mx-auto max-w-lg border-2 bg-gray-100 rounded-lg">
        <h3 className="text-center text-xl font-semibold mb-4">Login</h3>
        <form onSubmit={handleSubmit(onSubmit)}>
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
            {errors.email && (
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
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="flex justify-center mt-6">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;

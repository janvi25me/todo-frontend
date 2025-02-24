import {
  Route,
  redirect,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import Login from "./Components/page/Auth/Login";
import Signup from "./Components/page/Auth/Signup";
import ProductList from "./Components/page/Product/ProductList";
import { useContext } from "react";
import { AuthContext } from "./Context/AuthContext";
import Layout from "./Components/page/Layout/Layout";
import NotFound from "./Components/page/NotFound";
import Cart from "./Components/page/Cart";
import Home from "./Components/page/Home";
import Address from "./Components/page/Address";
import Order from "./Components/page/Order/Order";
import UserProfile from "./Components/page/User/UserProfile";
import OrderDetails from "./Components/page/Order/OrderDetails";
import OrderHistory from "./Components/page/Order/OrderHistory";
import Checkout from "./Components/page/Checkout";
import Success from "./Components/page/Success";
import Cancel from "./Components/page/Cancel";

const App = () => {
  const { userInfo } = useContext(AuthContext);

  const userLoggedInLoader = () => {
    if (userInfo?.user?.token) {
      return redirect("/product");
    }
    return null;
  };

  const userCanAccessLoader = () => {
    if (!userInfo?.user?.token) {
      return redirect("/login");
    }
    return null;
  };

  const routers = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route
            path="signup"
            element={<Signup />}
            loader={userLoggedInLoader}
          />
          <Route path="login" element={<Login />} loader={userLoggedInLoader} />
          <Route
            path="product"
            element={<ProductList />}
            loader={userCanAccessLoader}
          />
          <Route path="cart" element={<Cart />} loader={userCanAccessLoader} />
          <Route
            path="user"
            element={<UserProfile />}
            loader={userCanAccessLoader}
          />
          <Route
            path="order"
            element={<Order />}
            loader={userCanAccessLoader}
          />
          <Route
            path="/orderDetails/:orderId"
            element={<OrderDetails />}
            loader={userCanAccessLoader}
          />
          <Route
            path="/order/history"
            element={<OrderHistory />}
            loader={userCanAccessLoader}
          />
          <Route
            path="address"
            element={<Address />}
            loader={userCanAccessLoader}
          />
          <Route
            path="checkout"
            element={<Checkout />}
            loader={userCanAccessLoader}
          />
          <Route
            path="success"
            element={<Success />}
            loader={userCanAccessLoader}
          />
          <Route
            path="cancel"
            element={<Cancel />}
            loader={userCanAccessLoader}
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </>
    )
  );

  return (
    <>
      <RouterProvider router={routers} />
    </>
  );
};

export default App;

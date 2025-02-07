import {
  Route,
  redirect,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import ProductList from "./Components/Product/ProductList";
import { useContext } from "react";
import { AuthContext } from "./Context/AuthContext";
import Layout from "./Layout/Layout";
import NotFound from "./page/NotFound/NotFound";
import Cart from "./page/Cart";
import Home from "./Components/Home";
import Address from "./page/Address";
import Order from "./page/Order";
import UserProfile from "./page/UserProfile";
import OrderDetails from "./page/OrderDetails";

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
            path="/orderDetails"
            element={<OrderDetails />}
            loader={userCanAccessLoader}
          />
          <Route
            path="address"
            element={<Address />}
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

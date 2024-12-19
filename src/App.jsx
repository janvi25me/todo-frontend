import {
  Route,
  redirect,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
// import Navbar from "./Components/Navbar";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import TodoList from "./Components/Todo/TodoList";
import { useContext } from "react";
import { AuthContext } from "./Context/AuthContext";
import Layout from "./Layout/Layout";
import NotFound from "./page/NotFound/NotFound";

const App = () => {
  const { userInfo } = useContext(AuthContext);
  // console.log(">>>", userInfo);
  const userLoggedInLoader = () => {
    if (userInfo?.user?.token) {
      return redirect("/todo");
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
          <Route
            path="signup"
            element={<Signup />}
            loader={userLoggedInLoader}
          />
          <Route path="login" element={<Login />} loader={userLoggedInLoader} />
          <Route
            path="todo"
            element={<TodoList />}
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

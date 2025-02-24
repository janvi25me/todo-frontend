import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";
// import Footer from "../Components/Footer";
// import Home from "../Components"
// import ProductList from "../Components/Product/ProductList";
// import Footer from "@/shared/footer/Footer";
import { Toaster } from "sonner";

const Layout = () => {
  return (
    <>
      <Toaster richColors position="top-right" />
      <div className="font-body-text min-h-screen flex flex-col">
        <Navbar />
        <Outlet />
        {/* <Footer /> */}
      </div>
    </>
  );
};

export default Layout;

import { Outlet } from "react-router-dom";
import Navbar from "../Components/Navbar";
// import Footer from "@/shared/footer/Footer";

const Layout = () => {
  return (
    <div className="font-body-text min-h-screen flex flex-col">
      <Navbar />

      <Outlet />
      {/* <Footer /> */}
    </div>
  );
};

export default Layout;

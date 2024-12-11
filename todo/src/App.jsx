import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./Components/Header";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
// import { useEffect, useState } from "react";

const App = () => {
  // const [token, setToken] = useState("");

  // useEffect(() => {
  //   let lstoken = localStorage.getItem("token", token);
  //   if (lstoken) {
  //     console.log(lstoken);
  //   }
  // }, [token]);

  // const logout = () => {
  //   setToken("");
  //   localStorage.removeItem("token");
  // };

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Header />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;

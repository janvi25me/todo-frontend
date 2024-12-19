/* eslint-disable react/prop-types */
import { AuthContext } from "./AuthContext";
import { useEffect, useState } from "react";

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    // console.log(token);
    const storedToken = localStorage.getItem("token");
    return storedToken || null;
  });

  const [userInfo, setUserInfo] = useState(() => {
    const storedUser = localStorage.getItem("user");
    // console.log("._.", storedUser);
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // console.log("userInfo", userInfo);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }

    if (userInfo) {
      localStorage.setItem("user", JSON.stringify(userInfo));
    } else {
      localStorage.removeItem("user");
    }
  }, [userInfo, token]);

  const logout = () => {
    setToken(null);
    setUserInfo(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{ token, setToken, userInfo, setUserInfo, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

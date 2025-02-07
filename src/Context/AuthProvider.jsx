/* eslint-disable react/prop-types */
import { AuthContext } from "./AuthContext";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem("token");
    return storedToken || null;
  });

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [address, setAddress] = useState([]);
  const [selectedDeliverAddress, setSelectedDeliverAddress] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [reload, setReload] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);
  // const [orders, setOrders] = useState([]);
  // const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(() => {
    const storedUser = localStorage.getItem("user");

    return storedUser ? JSON.parse(storedUser) : null;
  });

  const url = "http://localhost:1000/api";
  let baseUrl = "https://526d-103-106-20-199.ngrok-free.app";

  //get user Token
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

  // get Todos
  useEffect(() => {
    if (!token || !userInfo?.user?.id) return;

    const productData = async () => {
      try {
        const endpoint =
          userInfo?.user?.role === "1"
            ? `${url}/product/buyer/${userInfo?.user?.id}?page=${currentPage}&limit=5&search=${searchQuery}&minPrice=${minPrice}&maxPrice=${maxPrice}`
            : `${url}/product/seller/v1/${userInfo?.user?.id}?page=${currentPage}&limit=5&search=${searchQuery}`;

        const response = await axios.get(endpoint, {
          headers: {
            "Content-Type": "application/json",
            auth: token,
          },
          withCredentials: true,
        });
        // console.log(response.data);
        setProducts(response.data.products);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        console.log("Error fetching products", err);
      }
    };

    productData();
  }, [currentPage, userInfo, token, reload, searchQuery, minPrice, maxPrice]);

  useEffect(() => {
    getAllAddress();
  }, [reload, token]);

  // useEffect(() => {
  //   fetchOrders();
  // }, [reload, token]);

  //addToCart API
  const addToCart = async (productId) => {
    try {
      const product = products.find((todo) => todo._id === productId);

      if (!product) {
        toast.error("Product not found");
        return;
      }

      const { name, description, price, image } = product;
      const qty = 1;

      const response = await axios.post(
        `${url}/product/cart/addProducts`,
        { productId, name, description, price, qty, image },
        {
          headers: {
            "Content-Type": "application/json",
            auth: token,
          },
          withCredentials: true,
        }
      );

      setCart(response.data.data);
      setReload((prev) => !prev);
      toast.success("Item added to cart!");
    } catch (err) {
      console.error("Error adding item to cart:", err);
      toast.error("Failed to add item to cart.");
    }
  };

  // getProductsFromBuyerCart API
  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const response = await axios.get(`${url}/product/cart/getProducts`, {
          headers: {
            "Content-Type": "application/json",
            auth: token,
          },
          withCredentials: true,
        });

        setCart(response.data);
        // console.log("Product in Cart", response.data);
      } catch (err) {
        console.error("Error fetching cart products:", err);
      }
    };

    if (token) {
      fetchCartData();
    }
  }, [token, reload]);

  // remove Item from cart
  const removeProductFromCart = async (id) => {
    try {
      const response = await axios.delete(`${url}/product/cart/${id}`, {
        headers: {
          "Content-Type": "application/json",
          auth: token,
        },
        withCredentials: true,
      });

      setCart((prevCart) => ({
        ...prevCart,
        data: {
          ...prevCart.data,
          items: prevCart.data.items.filter((item) => item._id !== id),
          subTotal: response.data.subTotal,
          total: response.data.total,
        },
      }));

      setReload((prev) => !prev);
      toast.info("Item removed from cart!");
    } catch (err) {
      console.error("Error removing product from cart:", err);
    }
  };

  // get All Address
  const getAllAddress = async () => {
    try {
      const response = await axios.get(`${url}/address/getAddress`, {
        headers: {
          "Content-Type": "application/json",
          auth: token,
        },
        withCredentials: true,
      });

      if (Array.isArray(response.data.data)) {
        setAddress(response.data.data);
        const deliverAddress = response.data.data.find(
          (address) => address.isDefault === true
        );
        if (deliverAddress) {
          setSelectedDeliverAddress(deliverAddress);
        }
      } else {
        console.log("Incorrect data format");
      }
    } catch (err) {
      console.error("Error fetching addresses:", err);
    }
  };

  // update Default Address
  const updateDefaultAddress = async (aid) => {
    // console.log("Address ID", aid);
    // console.log("token", token);
    if (!aid) {
      console.error("Address ID is undefined.");
      return;
    }

    try {
      const response = await axios.patch(
        `${url}/address/updateDefaultAddress/${aid}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            auth: token,
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setAddress((prev) =>
          prev.map((addr) => ({
            ...addr,
            isDefault: addr._id === aid,
          }))
        );

        setSelectedDeliverAddress(response.data.address);
        // console.log("Updated Default Address", response.data.address);
        toast.success("Updated default address");
      }
    } catch (err) {
      toast.error("Error updating default address:", err);
    }
  };
  useEffect(() => {
    const deliverAddress = address.find((addr) => addr.isDefault);
    setSelectedDeliverAddress(deliverAddress || null);
  }, [address]);

  //createOrder API
  // const createOrder = async (selectedDeliverAddress, cartData) => {
  //   try {
  //     const response = await axios.post(
  //       `${url}/order/createOrder`,
  //       {
  //         items: cartData?.items,
  //         total: cartData?.total,
  //         delivery: cartData?.delivery,
  //         address: selectedDeliverAddress,
  //       },
  //       {
  //         headers: { "Content-Type": "application/json", auth: token },
  //       }
  //     );
  //     if (response.data.success) {
  //       setOrders(response.data.data);
  //       toast.success("Order created successfully");
  //     } else {
  //       toast.error("Failed to create order. Please try again.");
  //     }
  //   } catch (err) {
  //     console.error("Error creating order:", err.response?.data || err.message);
  //     toast.error("Failed to create order. Please try again.");
  //   }
  // };

  //Buyer Order Filters
  // const fetchOrders = async () => {
  //   try {
  //     const response = await axios.get(`${url}/order/buyerOrders`, {
  //       headers: {
  //         "Content-Type": "application/json",
  //         auth: token,
  //       },
  //     });

  //     // console.log("API Response:", response.data);
  //     if (response.data.success) {
  //       setOrders(response.data.orders);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching orders:", error);
  //   }
  // };

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        userInfo,
        setUserInfo,
        products,
        addToCart,
        cart,
        currentPage,
        setCurrentPage,
        totalPages,
        reload,
        setReload,
        setProducts,
        setCart,
        removeProductFromCart,
        address,
        setAddress,
        selectedDeliverAddress,
        getAllAddress,
        updateDefaultAddress,
        searchQuery,
        setSearchQuery,
        minPrice,
        maxPrice,
        setMinPrice,
        setMaxPrice,
        baseUrl,
        url,
        // orders,
        // setOrders,
        // createOrder,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

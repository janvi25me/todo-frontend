import axios from "axios";
import { useContext, useState } from "react";
import Popup from "reactjs-popup";
import { AuthContext } from "../../Context/AuthContext";
import { toast } from "sonner";
// import AddTask from "./AddTask";

const ProductList = () => {
  const [addTask, setAddTask] = useState({
    name: "",
    description: "",
    price: "",
  });
  const [image, setImage] = useState(null);
  const [editTodo, setEditTodo] = useState(null);
  const [showData, setShowData] = useState(true);
  const [isTaskVisible, setIsTaskVisible] = useState(false);
  const [deleteTodo, setDeleteTodo] = useState(null);
  const [isOpen, setIsOpen] = useState("");

  // const [reload, setReload] = useState(false);

  const {
    userInfo,
    addToCart,
    products,
    currentPage,
    setCurrentPage,
    totalPages,
    reload,
    setReload,
    setProducts,
    searchQuery,
    setSearchQuery,
    minPrice,
    maxPrice,
    setMinPrice,
    setMaxPrice,
  } = useContext(AuthContext);
  const token = userInfo?.user?.token;

  // console.log("Products Data", products);

  const url = "http://localhost:1000/api/product";

  const handleAddTask = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", addTask.name);
      formData.append("description", addTask.description);
      formData.append("price", addTask.price);
      formData.append("image", image);

      const response = await axios.post(`${url}/add`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          auth: token,
        },
        withCredentials: true,
      });

      // console.log("AT ADDTASK", response.data);

      setAddTask({ name: "", description: "", price: "" });
      setImage(null); // Clear the file input state
      setIsTaskVisible(false);
      setReload(!reload);
      toast.success("Task added successfully!");
    } catch (err) {
      console.error("Error while adding task:", err);
      toast.error("Failed to add task");
    }
  };

  const handleEditTodo = async (e, eid) => {
    e.preventDefault();
    // console.log("Edit initiated for:", eid);

    try {
      const response = await axios.patch(`${url}/edit/${eid}`, editTodo, {
        headers: {
          "Content-Type": "application/json",
          auth: token,
        },
        withCredentials: true,
      });

      // alert("Todo updated successfully");

      setProducts((prev) => {
        console.log("Previous todos:", prev);
        const updatedTodos = prev.map((todo) =>
          todo._id === eid ? response.data.updatedTodo : todo
        );

        return updatedTodos;
      });
      setEditTodo(null);
      toast.success("Product updated successfully");
      setReload((prev) => !prev);
      // toast.success("Task updated successfully!");
    } catch (err) {
      console.log(
        "Error while updating the todo:",
        err.response?.data || err.message
      );
      // toast.error("Failed to add task");
    }
  };

  const handleDeleteTodo = async () => {
    try {
      await axios.delete(`${url}/${deleteTodo._id}`, {
        headers: {
          "Content-Type": "application/json",
          auth: token,
        },
        withCredentials: true,
      });
      // console.log("deleteTodo:", deleteTodo);

      // alert("Deleted successfully");
      // console.log(response);
      setProducts((prev) => prev.filter((todo) => todo._id !== deleteTodo._id));
      setDeleteTodo(null);
      setShowData(true);
      setReload(!reload);
      toast.info("Product Deleted successfully!");
      if (products.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (err) {
      console.log("Error while deleting", err);
      toast.error("Error while Deleting!");
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditTodo({ ...editTodo, [name]: value });
  };

  const handleInputAddChange = (e) => {
    const { name, value } = e.target;

    // For the file input
    if (name === "image") {
      setImage(e.target.files[0]);
    } else {
      setAddTask({ ...addTask, [name]: value });
    }
  };

  const handleFilterToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleClear = () => {
    setMinPrice("");
    setMaxPrice("");
    setProducts(products);
  };

  // const handleApply = () => {};

  const handleClose = () => {
    setIsOpen(!isOpen);
  };

  let baseUrl = "https://526d-103-106-20-199.ngrok-free.app";
  // let imagePath = products?.image?.replace(/\\/g, "/");

  return (
    <>
      <div className={deleteTodo ? "filter blur-sm pointer-events-none" : ""}>
        {/* Center: Search Bar */}

        <div className="flex items-center flex-grow justify-center">
          <input
            type="text"
            placeholder="Search for products"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 rounded-lg p-2 w-full max-w-md focus:outline-none focus:ring focus:ring-blue-500"
          />

          {searchQuery.length > 0 && products.length === 0 && (
            <div className="mt-2 text-center text-gray-600">
              <p>No results found</p>
            </div>
          )}

          {userInfo?.user?.role === "1" && (
            <div>
              <button
                onClick={handleFilterToggle}
                className="ml-3 px-2 py-2 text-white border border-purple-600 bg-purple-600 rounded-lg hover:bg-purple-800 hover:border-purple-800 transition"
              >
                <i className="fa-solid fa-filter"></i>Filter
              </button>

              {/* Popup */}
              <Popup
                open={isOpen}
                closeOnDocumentClick
                onClose={() => setIsOpen(false)}
                modal
              >
                <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
                  <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                    <h3 className="text-xl font-semibold mb-4 text-purple-800 flex justify-between items-center">
                      <span
                        className="mr-3 cursor-pointer"
                        onClick={handleClose}
                      >
                        <i className="fa-solid fa-arrow-left"></i>
                      </span>
                      <span className="flex-grow text-center">
                        Filter Products
                      </span>
                      <span
                        className="ml-10 cursor-pointer"
                        onClick={handleClose}
                      >
                        <i className="fa-solid fa-xmark"></i>
                      </span>
                    </h3>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Min Price
                      </label>
                      <input
                        type="number"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
                        placeholder="Enter minimum price"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Max Price
                      </label>
                      <input
                        type="number"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
                        placeholder="Enter maximum price"
                      />
                    </div>

                    <div className="flex justify-between mt-4">
                      <button
                        onClick={handleClear}
                        className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-200"
                      >
                        Clear
                      </button>
                      {/* <button
                        onClick={handleApply}
                        className="px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-800"
                      >
                        Apply
                      </button> */}
                    </div>
                  </div>
                </div>
              </Popup>
            </div>
          )}
        </div>

        {/* Add Product Button */}
        <div className="font-sans text-gray-700 font-semibold m-5">
          <div>
            {userInfo?.user?.role === "2" && (
              <button
                onClick={() => setIsTaskVisible(!isTaskVisible)}
                className="border-1 rounded-md text-white bg-violet-600 p-2 mb-3"
              >
                Add Product
              </button>
            )}
          </div>

          {/* get all products */}
          {showData && !editTodo && !isTaskVisible && (
            <div className="p-10 rounded-lg shadow-lg">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                {products?.map((todo) => {
                  // Correct imagePath derivation
                  const imagePath = todo?.image?.replace(/\\/g, "/");

                  return (
                    <div
                      key={todo?._id}
                      className="bg-white p-4 rounded-lg shadow flex flex-col justify-between"
                    >
                      <div>
                        {/* Image added without affecting other fields */}
                        <img
                          src={`${baseUrl}/${imagePath}`}
                          alt={todo?.name}
                          className="w-full h-64 object-cover-fit rounded-t-lg"
                        />
                        <p className="text-lg font-bold text-purple-800">
                          {todo?.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {todo?.description}
                        </p>
                        <p className="text-sm text-gray-600">₹{todo?.price}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(todo?.createdAt).toLocaleTimeString(
                            "en-us",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}{" "}
                          {new Date(todo?.createdAt).toLocaleDateString(
                            "en-us",
                            {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                            }
                          )}
                        </p>
                      </div>

                      {/* Add to Cart Button */}
                      {userInfo?.user?.role === "1" && (
                        <button
                          onClick={() => addToCart(todo?._id)}
                          className="mt-4 px-2 py-2 text-purple-800 border border-purple-800 rounded-lg hover:bg-purple-800 hover:text-white transition"
                        >
                          Add to Cart
                        </button>
                      )}

                      {/* Edit and Delete Buttons for admin */}
                      {userInfo?.user?.role === "2" && (
                        <div className="flex space-x-2 mt-4">
                          <button
                            onClick={() => setEditTodo(todo)}
                            className="px-3 py-1 text-purple-800 border border-purple-800 rounded-lg hover:bg-purple-800 hover:text-white transition"
                          >
                            Edit
                          </button>

                          <Popup
                            open={deleteTodo !== null}
                            closeOnDocumentClick
                            modal
                          >
                            <div className="p-4 border border-gray-300 bg-gray-100 rounded-md text-center">
                              <p className="font-medium">
                                Are you sure you want to delete this todo item?
                                This action cannot be undone afterwards.
                              </p>
                              <div className="mt-2">
                                <button
                                  className="bg-gray-300 px-4 py-2 rounded-md mr-2"
                                  onClick={() => {
                                    setDeleteTodo(null);
                                    setShowData(true);
                                  }}
                                >
                                  Cancel
                                </button>
                                <button
                                  className="bg-red-500 text-white px-4 py-2 rounded-md"
                                  onClick={() =>
                                    handleDeleteTodo(deleteTodo._id)
                                  }
                                >
                                  Delete Anyway
                                </button>
                              </div>
                            </div>
                          </Popup>

                          <button
                            onClick={() => setDeleteTodo(todo)}
                            className="px-3 py-1 text-red-800 border border-red-800 rounded-lg hover:bg-red-800 hover:text-white transition"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Add */}
          {isTaskVisible && showData && !editTodo && (
            <div>
              <form
                className="mt-6 p-4 bg-purple-200 rounded-md shadow-md"
                onSubmit={handleAddTask}
              >
                <h2 className="text-xl font-bold mb-4">Add Todo</h2>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={addTask.name}
                    onChange={handleInputAddChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    name="description"
                    value={addTask.description}
                    onChange={handleInputAddChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-1">Price</label>
                  <input
                    type="text"
                    name="price"
                    value={addTask.price}
                    onChange={handleInputAddChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 mb-1">Image</label>
                  <input
                    type="file"
                    name="image"
                    onChange={handleInputAddChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    className="bg-gray-300 px-4 py-2 rounded-md mr-2"
                    onClick={() => {
                      setIsTaskVisible(false);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 ml-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Add Task
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Edit */}
          {editTodo && (
            <form
              className="mt-6 p-4  bg-purple-200 rounded-md shadow-md"
              onSubmit={(e) => handleEditTodo(e, editTodo._id)}
            >
              <h2 className="text-xl font-bold mb-4">Edit Todo</h2>
              {/* Form fields for editing */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-1 ">Name</label>
                <input
                  type="text"
                  name="name"
                  value={editTodo?.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  name="description"
                  value={editTodo?.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Price</label>
                <input
                  type="text"
                  name="price"
                  value={editTodo?.price}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Image</label>
                <input
                  type="file"
                  name="image"
                  onChange={handleInputAddChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md mr-2"
                  onClick={() => setEditTodo(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          )}

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <button
              className="px-4 py-2 bg-purple-200 rounded-lg hover:bg-purple-300 transition disabled:opacity-50"
              onClick={handlePrevious}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="text-purple-800 font-semibold">
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="px-4 py-2 bg-purple-200 rounded-lg hover:bg-purple-300 transition disabled:opacity-50"
              onClick={handleNext}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
      {/* </Toaster> */}
    </>
  );
};

export default ProductList;

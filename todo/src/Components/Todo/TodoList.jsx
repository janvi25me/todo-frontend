import axios from "axios";
import { useEffect, useState } from "react";
import Popup from "reactjs-popup";
// import AddTask from "./AddTask";

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [addTask, setAddTask] = useState({ tag: "", description: "" });
  const [editTodo, setEditTodo] = useState(null);
  const [showData, setShowData] = useState(true);
  const [deleteTodo, setDeleteTodo] = useState(null);
  const [isTaskVisible, setIsTaskVisible] = useState(false);

  const url = "http://localhost:1000/api/todo";

  useEffect(() => {
    const todosData = async () => {
      try {
        const response = await axios.get(
          `${url}/all?page=${currentPage}&limit=5`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true,
          }
        );
        console.log("Todos Data", response.data.todos);
        setTodos(response.data.todos);
        setTotalPages(response.data.totalPages);
      } catch (err) {
        console.log("Error fetching todos all", err);
      }
    };
    todosData();
  }, [currentPage, todos]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${url}/add`,
        {
          tag: addTask.tag,
          description: addTask.description,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      alert("Task added successfully!");
      setAddTask({ tag: "", description: "" });
      setIsTaskVisible(false);

      console.log(response.data);
    } catch (err) {
      console.error("Error while adding task:", err);
    }
  };

  const handleEditTodo = async (e, eid) => {
    e.preventDefault();
    console.log("Edit initiated for:", eid);

    try {
      const response = await axios.patch(`${url}/edit/${eid}`, editTodo, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      console.log("API Response:", response.data);
      alert("Todo updated successfully");

      setTodos((prev) => {
        console.log("Previous todos:", prev);
        const updatedTodos = prev.map((todo) =>
          todo._id === eid ? response.data.updatedTodo : todo
        );
        console.log("Updated todos:", updatedTodos);
        return updatedTodos;
      });

      setEditTodo(null);
    } catch (err) {
      console.log(
        "Error while updating the todo:",
        err.response?.data || err.message
      );
    }
  };

  const handleDeleteTodo = async () => {
    try {
      await axios.delete(`${url}/${deleteTodo._id}`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      // console.log("deleteTodo:", deleteTodo);

      alert("Deleted successfully");
      // console.log(response);
      setTodos((prev) => prev.filter((todo) => todo._id !== deleteTodo._id));
      setDeleteTodo(null);
      setShowData(true);
    } catch (err) {
      console.log("Error while deleting", err);
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
    setAddTask({ ...addTask, [name]: value });
  };

  return (
    <>
      <div className={deleteTodo ? "filter blur-sm pointer-events-none" : ""}>
        <div className="font-sans text-gray-700 font-semibold m-5">
          <div>
            <button
              onClick={() => setIsTaskVisible(!isTaskVisible)}
              className="border-1 rounded-md text-white bg-violet-600 p-2"
            >
              {isTaskVisible ? "Close" : "Add Task"}
            </button>
          </div>

          {/* get all todo */}
          {showData && !editTodo && !isTaskVisible && (
            <div className="bg-purple-100 p-6 rounded-lg shadow-lg">
              {todos.map((todo) => (
                <div
                  key={todo._id}
                  className="bg-white p-4 mb-4 rounded-lg shadow flex justify-between items-center"
                >
                  <div>
                    <p className="text-lg font-bold text-purple-800">
                      {todo.tag}
                    </p>
                    <p className="text-sm text-gray-600">{todo.description}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(todo.createdAt).toLocaleTimeString("en-us", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      {new Date(todo.createdAt).toLocaleDateString("en-us", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditTodo(todo)}
                      className="px-3 py-1 text-purple-800 border border-purple-800 rounded-lg hover:bg-purple-800 hover:text-white transition"
                    >
                      Edit
                    </button>

                    <Popup
                      open={deleteTodo !== null}
                      closeOnDocumentClick
                      // onClose={() => setDeleteTodo(null)}
                      modal
                    >
                      <div className="p-4 border border-gray-300 bg-gray-100 rounded-md text-center">
                        <p className="font-medium">
                          Are you sure you want to delete this todo item? This
                          action cannot be undone afterwards.
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
                            onClick={() => handleDeleteTodo(deleteTodo._id)}
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
                </div>
              ))}
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
                  <label className="block text-gray-700 mb-1">Tag</label>
                  <input
                    type="text"
                    name="tag"
                    value={addTask.tag}
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
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
                <label className="block text-gray-700 mb-1 ">Tag</label>
                <input
                  type="text"
                  name="tag"
                  value={editTodo.tag}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  name="description"
                  value={editTodo.description}
                  onChange={handleInputChange}
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
    </>
  );
};

export default Todo;

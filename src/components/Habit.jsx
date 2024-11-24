import React, { useState, useEffect } from "react";
import Modal from "react-modal"; // Modal package for adding and updating habits
import { FaSearch, FaUpload, FaEdit, FaTrash, FaTimes, FaChevronDown } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext"; // Import useTheme from ThemeContext

Modal.setAppElement("#root"); // Set root element for accessibility

const Habit = () => {
  const [habits, setHabits] = useState([]); // Habit list
  const [searchTerm, setSearchTerm] = useState(""); // Search term
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state for adding/editing habit
  const [newHabit, setNewHabit] = useState({ name: "", description: "" }); // New or updated habit data
  const [editingHabitId, setEditingHabitId] = useState(null); // Track habit being edited
  const [sortOrder, setSortOrder] = useState(""); // Sorting state, default is descending
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme(); // Access theme from ThemeContext
  const isDarkMode = theme === "dark";

  // Fetch habits on component mount
useEffect(() => {
  const fetchHabits = async () => {
    try {
      const response = await fetch("https://habit-tracker-backend-0woy.onrender.com/habits");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setHabits(data);
    } catch (error) {
      console.error("Error fetching habits:", error.message);
    } finally{
      setLoading(false);
    }
  };

  fetchHabits();
}, []);

  // Add or update a habit
  const saveHabit = () => {
    const url = editingHabitId
      ? `https://habit-tracker-backend-0woy.onrender.com/habits/${editingHabitId}`
      : "https://habit-tracker-backend-0woy.onrender.com/habits";
    const method = editingHabitId ? "PATCH" : "POST";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newHabit),
    })
      .then((response) => response.json())
      .then((data) => {
        if (editingHabitId) {
          // Update the habit in the list
          setHabits((prev) =>
            prev.map((habit) => (habit._id === editingHabitId ? data : habit))
          );
        } else {
          // Add the new habit to the list
          setHabits((prev) => [...prev, data]);
        }
        setIsModalOpen(false); // Close modal
        setNewHabit({ name: "", description: "" }); // Reset form
        setEditingHabitId(null); // Clear editing state
      })
      .catch((error) => console.error("Error saving habit:", error));
  };

  // Delete a habit
  const deleteHabit = (habitId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this habit?");
    if (!confirmDelete) return;

    fetch(`https://habit-tracker-backend-0woy.onrender.com/habits/${habitId}`, {
      method: "DELETE",
    })
      .then(() => {
        setHabits((prev) => prev.filter((habit) => habit._id !== habitId));
        alert("Habit deleted successfully.");
      })
      .catch((error) => console.error("Error deleting habit:", error));
  };

  const handleDeleteImage = (habitId) => {
    // Ask for confirmation before deleting the image
    const confirmDelete = window.confirm("Are you sure you want to delete today's image?");
    if (!confirmDelete) return;
  
    // Proceed with deleting the image
    fetch(`https://habit-tracker-backend-0woy.onrender.com/habits/${habitId}/upload`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((updatedHabit) => {
        // Update the habits state with the updated habit
        setHabits((prev) =>
          prev.map((habit) => (habit._id === updatedHabit._id ? updatedHabit : habit))
        );
        alert("Today's image has been deleted and streak updated.");
      })
      .catch((error) => {
        console.error("Error deleting today's image:", error);
        alert("Failed to delete image and update streak.");
      });
  };

  const sortHabits = (order) => {
    setSortOrder(order);
    const sortedHabits = [...habits].sort((a, b) => {
      if (order === "asc") {
        return a.streak - b.streak; // Low to High
      } else {
        return b.streak - a.streak; // High to Low
      }
    });
    setHabits(sortedHabits);
  };  

  // Handle daily upload for habit (unchanged)
  const handleDailyUpload = (habitId) => {
    const habit = habits.find((habit) => habit._id === habitId);
    const today = new Date().toDateString();
    const uploads = habit?.uploads || [];
    const lastUpload = uploads.length > 0 ? new Date(uploads[uploads.length - 1]?.date).toDateString() : null;

    if (lastUpload === today) {
      alert("Today's image is already uploaded.");
      return;
    }

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = (e) => {
      const selectedFile = e.target.files[0];
      if (selectedFile) {
        const formData = new FormData();
        formData.append("photo", selectedFile);

        fetch(`https://habit-tracker-backend-0woy.onrender.com/habits/${habitId}/upload`, {
          method: "POST",
          body: formData,
        })
          .then((response) => response.json())
          .then((updatedHabit) => {
            setHabits((prev) =>
              prev.map((habit) =>
                habit._id === updatedHabit._id ? updatedHabit : habit
              )
            );
            alert("Streak updated!");
          })
          .catch((error) => console.error("Error uploading daily habit:", error));
      }
    };
    fileInput.click();
  };

  // Filter habits based on search
  const filteredHabits = habits.filter((habit) =>
    habit.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className={`container mx-auto px-4 py-6 mt-12 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <h2 className="text-3xl font-semibold mb-6 text-center">🏆 Habits 🏆</h2>
      <div className="flex flex-col md:flex-row md:gap-4 mb-4 w-full">
        {/* Search Bar with Icon on Right */}
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search habits..."
            className={`w-full pl-4 pr-10 py-2 rounded border ${
              isDarkMode
                ? "bg-gray-800 text-white border-gray-600 placeholder-gray-400"
                : "bg-gray-100 text-gray-900 border-gray-300 placeholder-gray-500"
            } focus:outline-none focus:ring-2 ${
              isDarkMode ? "focus:ring-orange-700" : "focus:ring-orange-500"
            }`}
            onChange={(e) => setSearchTerm(e.target.value)} // Assuming you have a searchTerm state
          />
          <FaSearch
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-lg ${
              isDarkMode ? "text-gray-400" : "text-gray-500"
            }`}
          />
        </div>

        {/* Sort by Streak Dropdown */}
        <div className="relative w-full md:w-1/3 mt-4 md:mt-0"> {/* Added mt-4 to create gap on smaller screens */}
          <select
            onChange={(e) => sortHabits(e.target.value)}
            value={sortOrder}
            className={`w-full px-4 py-2 rounded-md bg-blue-500 text-white border-none appearance-none transition-all focus:outline-none ${
              sortOrder === "asc" ? "bg-blue-700" : sortOrder === "desc" ? "bg-blue-700" : ""
            }`}
          >
            <option value="">Sort by Streak</option>
            <option value="asc">Low to High</option>
            <option value="desc">High to Low</option>
          </select>
          <div
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-white ${
              sortOrder ? "rotate-180" : ""
            }`}
          >
            <FaChevronDown />
          </div>
        </div>

        {/* Add Habit Button */}
        <button
          onClick={() => {
            setIsModalOpen(true);
            setNewHabit({ name: "", description: "" }); // Reset form for new habit
            setEditingHabitId(null); // Clear editing state
          }}
          className={`w-full md:w-1/3 px-4 py-2 rounded font-semibold transition-all ${
            isDarkMode
              ? "bg-orange-600 text-white hover:bg-orange-700"
              : "bg-orange-500 text-white hover:bg-orange-600"
          } md:mt-0 mt-4`} // Adding gap (margin-top) to the button on smaller screens
        >
          Add Habit
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center md:min-h-screen lg:min-h-screen max-h-screen mt-60 mb-60">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
        </div>
      ) : (
        <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredHabits.map((habit) => (
          <div
            key={habit._id}
            className={`p-6 rounded-lg border shadow-md transition ${
              isDarkMode
                ? "bg-gray-800 border-gray-700 text-white hover:shadow-lg"
                : "bg-white border-gray-300 text-gray-900 hover:shadow-lg"
            }`}
          >
            {/* Title and Description */}
            <div className="flex flex-col items-center">
              <h3 className="text-2xl font-bold mb-2">{habit.name}</h3>
              <p className="text-sm text-center text-gray-500">
                {habit.description}
              </p>
            </div>

            {/* Streak */}
            <div className="flex justify-center items-center mt-4">
              <span
                className={`text-lg font-bold px-3 py-1 rounded-full ${
                  isDarkMode
                    ? "bg-green-700 text-white"
                    : "bg-green-100 text-green-800"
                }`}
              >
                Streak: {habit.streak}🔥
              </span>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              <button
                className={`flex items-center justify-center px-4 py-2 rounded-md ${
                  isDarkMode
                    ? "bg-green-700 text-white hover:bg-green-800"
                    : "bg-green-500 text-white hover:bg-green-600"
                }`}
                onClick={() => handleDailyUpload(habit._id)}
              >
                <FaUpload className="mr-2" />
                Upload
              </button>

              <button
                className={`flex items-center justify-center px-4 py-2 rounded-md ${
                  isDarkMode
                    ? "bg-blue-700 text-white hover:bg-blue-800"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
                onClick={() => {
                  setIsModalOpen(true);
                  setNewHabit({
                    name: habit.name,
                    description: habit.description,
                  });
                  setEditingHabitId(habit._id);
                }}
              >
                <FaEdit className="mr-2" />
                Edit
              </button>

              <button
                className={`flex items-center justify-center px-4 py-2 rounded-md ${
                  isDarkMode
                    ? "bg-red-700 text-white hover:bg-red-800"
                    : "bg-red-500 text-white hover:bg-red-600"
                }`}
                onClick={() => deleteHabit(habit._id)}
              >
                <FaTrash className="mr-2" />
                Delete
              </button>
            </div>

            {/* Delete Today's Upload Button */}
            <div className="mt-4">
              <button
                onClick={() => handleDeleteImage(habit._id)}
                className={`flex items-center justify-center w-full px-4 py-2 rounded-md ${
                  isDarkMode
                    ? "bg-gray-700 text-white hover:bg-red-800"
                    : "bg-gray-500 text-white hover:bg-red-600"
                }`}
              >
                <FaTimes className="mr-2" />
                Delete Today's Upload
              </button>
            </div>
          </div>
        ))}
      </div>
      </>)}

      {/* Modal for Adding/Editing Habit */}
    {isModalOpen && (
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
        onClick={() => setIsModalOpen(false)} // Close the modal when clicking outside
      >
        <div
          className={`relative rounded-lg shadow-lg p-6 w-full max-w-md mx-auto ${
            isDarkMode
              ? "bg-gray-800 text-white border border-gray-700"
              : "bg-white text-gray-900 border border-gray-300"
          }`}
          onClick={(e) => e.stopPropagation()} // Prevent closing the modal when clicking inside it
        >
          {/* Modal Title */}
          <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            {editingHabitId ? "Edit Habit" : "Add Habit"}
          </h2>

          {/* Modal Form */}
          <form>
            {/* Habit Name Field */}
            <div className="mb-4">
              <label
                htmlFor="habitName"
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-800"
                }`}
              >
                Habit Name
              </label>
              <input
                type="text"
                id="habitName"
                className={`w-full px-4 py-2 border rounded ${
                  isDarkMode
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-white text-gray-900 border-gray-300"
                }`}
                value={newHabit.name}
                onChange={(e) =>
                  setNewHabit({ ...newHabit, name: e.target.value })
                }
              />
            </div>

            {/* Habit Description Field */}
            <div className="mb-4">
              <label
                htmlFor="habitDescription"
                className={`block text-sm font-medium mb-2 ${
                  isDarkMode ? "text-gray-300" : "text-gray-800"
                }`}
              >
                Description
              </label>
              <textarea
                id="habitDescription"
                className={`w-full px-4 py-2 border rounded ${
                  isDarkMode
                    ? "bg-gray-700 text-white border-gray-600"
                    : "bg-white text-gray-900 border-gray-300"
                }`}
                value={newHabit.description}
                onChange={(e) =>
                  setNewHabit({ ...newHabit, description: e.target.value })
                }
              />
            </div>

            {/* Modal Action Buttons */}
            <div className="flex justify-end">
              {/* Cancel Button */}
              <button
                type="button"
                className={`px-4 py-2 rounded-md mr-2 ${
                  isDarkMode
                    ? "bg-gray-700 text-white hover:bg-gray-600"
                    : "bg-gray-300 text-gray-900 hover:bg-gray-400"
                }`}
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>

              {/* Save Button */}
              <button
                type="button"
                className={`px-4 py-2 rounded-md ${
                  isDarkMode
                    ? "bg-orange-700 text-white hover:bg-orange-800"
                    : "bg-orange-500 text-white hover:bg-orange-600"
                }`}
                onClick={saveHabit}
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    )}
    </div>
  );
};

export default Habit;
import React, { useState, useEffect } from "react";
import Modal from "react-modal"; // Modal package for adding habits
import { FaSearch, FaPlus, FaUpload } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext"; // Import useTheme from ThemeContext

Modal.setAppElement("#root"); // Set root element for accessibility

const Habit = () => {
  const [habits, setHabits] = useState([]); // Habit list
  const [searchTerm, setSearchTerm] = useState(""); // Search term
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state for adding habit
  const [newHabit, setNewHabit] = useState({ name: "", description: "" }); // New habit data
  const { theme } = useTheme(); // Access theme from ThemeContext
  const isDarkMode = theme === "dark";

  // Fetch habits on component mount
  useEffect(() => {
    fetch("https://habit-tracker-backend-0woy.onrender.com/habits")
      .then((response) => response.json())
      .then((data) => setHabits(data))
      .catch((error) => console.error("Error fetching habits:", error));
  }, []);

  // Add a new habit
  const addHabit = () => {
    fetch("https://habit-tracker-backend-0woy.onrender.com/habits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newHabit),
    })
      .then((response) => response.json())
      .then((data) => {
        setHabits((prev) => [...prev, data]); // Update habits list
        setIsModalOpen(false); // Close modal
        setNewHabit({ name: "", description: "" }); // Reset form
      })
      .catch((error) => console.error("Error adding habit:", error));
  };

  // Handle daily upload for habit
const handleDailyUpload = (habitId) => {
  // Step 1: Find the habit and check if there's already an upload for today
  const habit = habits.find((habit) => habit._id === habitId);
  const today = new Date().toDateString();

  // Ensure that the habit exists and has uploads with valid date
  const uploads = habit?.uploads || [];

  // Step 2: Find the last upload's date
  const lastUpload = uploads.length > 0 ? new Date(uploads[uploads.length - 1]?.date).toDateString() : null;

  // Check if today's upload exists
  if (lastUpload === today) {
    // If today's upload exists, show an alert and don't allow further upload
    alert("Today's image is already uploaded.");
    return;
  }

  // Step 3: If no upload exists for today, open the file picker
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.onchange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const formData = new FormData();
      formData.append("photo", selectedFile); // Add selected file to FormData

      // Step 4: Upload the new file
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
  fileInput.click(); // Trigger the file input
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
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Habit Tracker</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className={`${
            isDarkMode
              ? "bg-orange-700 text-white hover:bg-orange-800"
              : "bg-orange-500 text-white hover:bg-orange-600"
          } px-4 py-2 rounded flex items-center`}
        >
          <FaPlus className="mr-2" /> Add Habit
        </button>
      </div>

      <div className="flex mb-4">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search habits..."
            className={`w-full px-4 py-2 border rounded ${
              isDarkMode
                ? "bg-gray-800 text-white border-gray-700"
                : "bg-white text-gray-900 border-gray-300"
            }`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch
            className={`absolute top-3 right-3 ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredHabits.map((habit) => (
          <div
            key={habit._id}
            className={`p-4 rounded border shadow-md transition ${
              isDarkMode
                ? "bg-gray-800 border-gray-700 text-white hover:shadow-lg"
                : "bg-white border-gray-300 text-gray-900 hover:shadow-lg"
            }`}
          >
            <h3 className="text-xl font-semibold">{habit.name}</h3>
            <p className="text-sm mt-2">{habit.description}</p>
            <div className="mt-2 text-sm">
              Streak: <span className="font-bold">{habit.streak}</span>
            </div>
            <div className="flex justify-between mt-4">
              <button
                className={`${
                  isDarkMode
                    ? "bg-green-700 text-white hover:bg-green-800"
                    : "bg-green-500 text-white hover:bg-green-600"
                } px-4 py-2 rounded-md`}
                onClick={() => handleDailyUpload(habit._id)}
              >
                <FaUpload className="mr-2" /> Upload
              </button>
              <button
            onClick={() => handleDeleteImage(habit._id)}
            className={`${
                isDarkMode
                  ? "bg-gray-700 text-white hover:bg-red-800"
                  : "bg-gray-500 text-white hover:bg-red-600"
              } px-4 py-2 rounded-md`}
          >
            Delete Today's Upload
          </button>
            </div>
          </div>
        ))}
      </div>        

      {/* Modal for Adding Habit */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className={`rounded-lg shadow-lg max-w-md mx-auto p-6 relative ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <h2 className="text-2xl font-bold mb-4">Add a New Habit</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addHabit();
          }}
        >
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Habit Name</label>
            <input
              type="text"
              className={`w-full px-3 py-2 border rounded ${
                isDarkMode
                  ? "bg-gray-700 text-white border-gray-600"
                  : "bg-white text-gray-900 border-gray-300"
              }`}
              value={newHabit.name}
              onChange={(e) =>
                setNewHabit((prev) => ({ ...prev, name: e.target.value }))
              }
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              className={`w-full px-3 py-2 border rounded ${
                isDarkMode
                  ? "bg-gray-700 text-white border-gray-600"
                  : "bg-white text-gray-900 border-gray-300"
              }`}
              value={newHabit.description}
              onChange={(e) =>
                setNewHabit((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              required
            />
          </div>  
          <div className="flex justify-end">
            <button
              type="submit"
              className={`${
                isDarkMode
                  ? "bg-blue-700 text-white hover:bg-blue-800"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              } px-6 py-2 rounded`}
            >
              Add Habit
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Habit;
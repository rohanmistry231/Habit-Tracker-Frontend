import React, { useState, useEffect } from "react";
import Modal from "react-modal"; // Modal package for adding habits
import { useTheme } from "../context/ThemeContext"; // Import useTheme from ThemeContext
import HabitAnalytics from "../components/HabitAnalytics";

Modal.setAppElement("#root"); // Set root element for accessibility

const Home = () => {
  const [habits, setHabits] = useState([]); // Habit list
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

  return (
    <div
      className={`container mx-auto px-4 py-6 mt-12 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
            {loading ? (
        <div className="flex justify-center items-center md:min-h-screen lg:min-h-screen max-h-screen mt-60 mb-60">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
        </div>
      ) : (
      <HabitAnalytics habits={habits} />
      )}
    </div>
  );
};

export default Home;
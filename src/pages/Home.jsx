import React, { useState, useEffect } from "react";
import Modal from "react-modal"; // Modal package for adding habits
import { useTheme } from "../context/ThemeContext"; // Import useTheme from ThemeContext
import HabitAnalytics from "../components/HabitAnalytics";

Modal.setAppElement("#root"); // Set root element for accessibility

const Home = () => {
  const [habits, setHabits] = useState([]); // Habit list
  const { theme } = useTheme(); // Access theme from ThemeContext
  const isDarkMode = theme === "dark";

  // Fetch habits on component mount
  useEffect(() => {
    fetch("http://localhost:5000/habits")
      .then((response) => response.json())
      .then((data) => setHabits(data))
      .catch((error) => console.error("Error fetching habits:", error));
  }, []);

  return (
    <div
      className={`container mx-auto px-4 py-6 mt-12 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <HabitAnalytics habits={habits} />
    </div>
  );
};

export default Home;
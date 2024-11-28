import React, { useState, useEffect } from "react";
import Modal from "react-modal"; // Modal package for adding habits
import { useTheme } from "../context/ThemeContext"; // Import useTheme from ThemeContext
import HabitAnalytics from "../components/HabitAnalytics";
import "./Home.css";

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
        const response = await fetch(
          "https://habit-tracker-backend-0woy.onrender.com/habits"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setHabits(data);
      } catch (error) {
        console.error("Error fetching habits:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHabits();
  }, []);

  return (
    <div
      className={`container mx-auto px-4 py-6 pb-2 mt-11 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <div
        className={`ml-2 mr-2 h-12 mt-2 rounded-md relative overflow-hidden ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-black"
        } p-2 mb-2`}
      >
        <div
          className="absolute whitespace-nowrap animate-slide-text text-xl"
          style={{ animationDuration: "10s" }}
        >
          ✨ Own Your Journey: Track Honestly, Grow Consistently. ✨
        </div>
      </div>
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

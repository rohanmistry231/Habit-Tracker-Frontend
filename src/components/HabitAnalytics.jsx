import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext'; // Importing your custom ThemeContext for dark mode
import { useNavigate } from 'react-router-dom';
import { FaFireAlt, FaCheckCircle, FaClipboardList } from 'react-icons/fa'; // Icons for better UI

const HabitAnalytics = ({ habits }) => {
  const [analytics, setAnalytics] = useState({
    highestStreak: 0,
    totalCompletedHabits: 0,
    totalHabits: habits.length,
  });
  const { theme } = useTheme(); // Accessing the theme from ThemeContext
  const navigate = useNavigate();

  useEffect(() => {
    if (habits.length > 0) {
      const highestStreak = Math.max(...habits.map(habit => habit.streak));
      const totalCompletedHabits = habits.filter(habit => habit.is_completed).length;

      setAnalytics({
        highestStreak,
        totalCompletedHabits,
        totalHabits: habits.length,
      });
    }
  }, [habits]);

  return (
    <div
      className={`p-8 rounded-xl pt-2 pb-0 ${
        theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
      }`}
    >
      <h2 className="text-3xl font-bold mb-4 text-center">
        Habit Analytics
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Highest Streak Card */}
        <div
          className={`p-6 rounded-lg shadow-lg transition-all transform ${
            theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'
          } hover:shadow-md`}
        >
          <div className="flex items-center mb-4">
            <FaFireAlt className="text-3xl mr-3" />
            <h3 className="text-xl font-semibold">Highest Streak</h3>
          </div>
          <p className="text-4xl font-bold text-orange-600">{analytics.highestStreak}</p>
        </div>

        {/* Total Completed Habits Card */}
        <div
          className={`p-6 rounded-lg shadow-lg transition-all ${
            theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'
          } hover:shadow-md`}
        >
          <div className="flex items-center mb-4">
            <FaCheckCircle className="text-3xl mr-3" />
            <h3 className="text-xl font-semibold">Total Completed Habits</h3>
          </div>
          <p className="text-3xl font-bold text-orange-600">{analytics.totalCompletedHabits}</p>
        </div>

        {/* Total Habits Card */}
        <div
          className={`p-6 rounded-lg shadow-lg transition-all ${
            theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'
          } hover:shadow-md`}
        >
          <div className="flex items-center mb-4">
            <FaClipboardList className="text-3xl mr-3" />
            <h3 className="text-xl font-semibold">Total Habits</h3>
          </div>
          <p className="text-3xl font-bold text-orange-600">{analytics.totalHabits}</p>
        </div>
      </div>

      {/* Button to View All Habits */}
      <div className="mt-5 text-center">
        <button
          onClick={() => navigate('/habits')}
          className={`py-3 px-6 rounded-md font-semibold transition-all ${
            theme === 'dark' ? 'bg-orange-600 text-white' : 'bg-orange-500 text-white'
          } hover:bg-orange-700  shadow-md`}
        >
          View All Habits
        </button>
      </div>
    </div>
  );
};

export default HabitAnalytics;
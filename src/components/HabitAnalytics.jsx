import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext'; // Importing your custom ThemeContext for dark mode
import { useNavigate } from 'react-router-dom';

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
      className={`p-8 rounded-xl shadow-xl ${
        theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
      }`}
    >
      <h2 className="text-3xl font-bold mb-6 text-center">
        Habit Analytics
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Highest Streak Card */}
        <div
          className={`p-6 rounded-lg shadow-lg transition-all ${
            theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'
          } hover:scale-105 hover:shadow-xl`}
        >
          <h3 className="text-xl font-semibold mb-4">Highest Streak</h3>
          <p className="text-3xl font-bold text-blue-600">{analytics.highestStreak}</p>
        </div>

        {/* Total Completed Habits Card */}
        <div
          className={`p-6 rounded-lg shadow-lg transition-all ${
            theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'
          } hover:scale-105 hover:shadow-xl`}
        >
          <h3 className="text-xl font-semibold mb-4">Total Completed Habits</h3>
          <p className="text-3xl font-bold text-green-600">{analytics.totalCompletedHabits}</p>
        </div>

        {/* Total Habits Card */}
        <div
          className={`p-6 rounded-lg shadow-lg transition-all ${
            theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'
          } hover:scale-105 hover:shadow-xl`}
        >
          <h3 className="text-xl font-semibold mb-4">Total Habits</h3>
          <p className="text-3xl font-bold text-purple-600">{analytics.totalHabits}</p>
        </div>
      </div>

      {/* Button to View All Habits */}
      <div className="mt-8 text-center">
        <button
          onClick={() => navigate('/habits')}
          className={`py-3 px-6 rounded-md font-semibold transition-all ${
            theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
          } hover:bg-blue-700 hover:scale-105 shadow-lg`}
        >
          View All Habits
        </button>
      </div>
    </div>
  );
};

export default HabitAnalytics;
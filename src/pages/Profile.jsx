import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext'; // For dark mode context
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Make sure to install axios: npm install axios

const Profile = ({ user }) => {
  const { theme } = useTheme(); // Accessing theme for dark mode
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    highestStreak: 0,
    totalCompletedHabits: 0,
    totalHabits: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch habits from the backend when the component mounts
    const fetchHabits = async () => {
      try {
        const response = await axios.get('https://habit-tracker-backend-0woy.onrender.com/habits'); // Replace with your actual endpoint
        const habitsData = response.data;
        setHabits(habitsData);
      } catch (error) {
        console.error('Error fetching habits:', error);
      } finally{
        setLoading(false);
      }
    };

    fetchHabits();
  }, []);

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
      className={`max-w-4xl mx-auto p-8 rounded-2xl mt-12 ${
        theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'
      }`}
    >
      {/* Profile Header */}
      <div className="flex items-center mb-8 space-x-6">
        <img
          src="profile.jpg"
          alt="Profile Avatar"
          className="w-24 h-24 rounded-full border-4 border-orange-400 object-cover"
        />
        <div>
          <h2 className="text-3xl font-bold">Rohan Mistry</h2>
          <p className="text-md text-gray-500 mailto:rohanmistry231@gmail.com">rohanmistry231@gmail.com</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center md:min-h-screen lg:min-h-screen max-h-screen mt-60 mb-60">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
        </div>
      ) : (
      <>

      {/* Habit Analytics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Highest Streak Card */}
        <div
          className={`p-6 rounded-lg shadow-lg transition-all ${
            theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'
          } hover:shadow-xl`}
        >
          <h3 className="text-xl font-semibold mb-4">Highest Streak</h3>
          <p className="text-3xl font-bold text-orange-600">{analytics.highestStreak}</p>
        </div>

        {/* Total Completed Habits Card */}
        <div
          className={`p-6 rounded-lg shadow-lg transition-all ${
            theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'
          } hover:shadow-xl`}
        >
          <h3 className="text-xl font-semibold mb-4">Total Completed Habits</h3>
          <p className="text-3xl font-bold text-orange-600">{analytics.totalCompletedHabits}</p>
        </div>

        {/* Total Habits Card */}
        <div
          className={`p-6 rounded-lg shadow-lg transition-all ${
            theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'
          } hover:shadow-xl`}
        >
          <h3 className="text-xl font-semibold mb-4">Total Habits</h3>
          <p className="text-3xl font-bold text-orange-600">{analytics.totalHabits}</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex justify-between items-center">
        <button
          onClick={() => navigate('/habits')}
          className={`py-3 px-6 rounded-lg font-semibold transition-all w-full ${
            theme === 'dark' ? 'bg-orange-600 text-white' : 'bg-orange-500 text-white'
          } hover:bg-orange-700 shadow-md`}
        >
          View Habits
        </button>
      </div>
      </>
      )}
    </div>
  );
};

export default Profile;
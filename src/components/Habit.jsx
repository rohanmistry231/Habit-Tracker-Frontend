import React, { useState, useEffect } from 'react';
import Modal from 'react-modal'; // Modal package for adding habits
import { FaSearch, FaPlus } from 'react-icons/fa';

Modal.setAppElement('#root'); // Set root element for accessibility

const Habit = () => {
  const [habits, setHabits] = useState([]); // Habit list
  const [searchTerm, setSearchTerm] = useState(''); // Search term
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [newHabit, setNewHabit] = useState({ name: '', description: '' }); // New habit data

  // Fetch habits on component mount
  useEffect(() => {
    fetch('http://localhost:5000/habits')
      .then((response) => response.json())
      .then((data) => setHabits(data))
      .catch((error) => console.error('Error fetching habits:', error));
  }, []);

  // Add a new habit
  const addHabit = () => {
    fetch('http://localhost:5000/habits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newHabit),
    })
      .then((response) => response.json())
      .then((data) => {
        setHabits((prev) => [...prev, data]); // Update habits list
        setIsModalOpen(false); // Close modal
        setNewHabit({ name: '', description: '' }); // Reset form
      })
      .catch((error) => console.error('Error adding habit:', error));
  };

  // Filter habits based on search
  const filteredHabits = habits.filter((habit) =>
    habit.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-6 mt-12">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Habit Tracker</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center"
        >
          <FaPlus className="mr-2" /> Add Habit
        </button>
      </div>

      <div className="flex mb-4">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search habits..."
            className="w-full px-4 py-2 border rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute top-3 right-3 text-gray-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredHabits.map((habit) => (
          <div
            key={habit._id}
            className="bg-white shadow-md rounded p-4 border hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold">{habit.name}</h3>
            <p className="text-gray-600">{habit.description}</p>
            <div className="mt-2 text-sm text-gray-500">
              Streak: <span className="font-bold">{habit.streak}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Adding Habit */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        className="bg-white rounded-lg shadow-lg max-w-md mx-auto p-6 relative"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Habit Name
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded"
              value={newHabit.name}
              onChange={(e) =>
                setNewHabit((prev) => ({ ...prev, name: e.target.value }))
              }
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              className="w-full px-3 py-2 border rounded"
              value={newHabit.description}
              onChange={(e) =>
                setNewHabit((prev) => ({ ...prev, description: e.target.value }))
              }
              required
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
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
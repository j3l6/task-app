import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaTrash } from 'react-icons/fa';


interface Task {
  _id: string;
  title: string;
  completed: boolean;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');

  // ¡CAMBIAR EN PRODUCCIÓN!
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API_URL}/tasks`);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => { fetchTasks() }, []);

  const addTask = async () => {
    if (!newTask.trim()) return;
    try {
      await axios.post(`${API_URL}/tasks`, { title: newTask });
      setNewTask('');
      await fetchTasks();
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const PlusIcon = () => (
    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em">
      <path d="M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z"></path>
    </svg>
  );

  const deleteTask = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/tasks/${id}`);
      await fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="container">
      <h1>Task Manager 🚀</h1>
      <div className="input-group">
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="New task..."
          onKeyPress={(e) => e.key === 'Enter' && addTask()}
        />
        <button onClick={addTask}><PlusIcon /> Add</button>

      </div>
      <ul className="task-list">
        {tasks.map(task => (
          <li key={task._id} className="task-item">
            <span>{task.title}</span>
            <button onClick={() => deleteTask(task._id)} className="delete-btn">
              <FaTrash />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
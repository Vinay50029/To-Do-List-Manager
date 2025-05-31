import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [editingId, setEditingId] = useState(null);

  // Fetch all tasks from the backend
  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/tasks');
      setTasks(res.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      alert('Failed to fetch tasks. Please try again later.');
    }
  };

  // Fetch tasks when the component mounts
  useEffect(() => {
    fetchTasks();
  }, []);

  // Add a new task to the database
  const addTask = async () => {
    if (!title.trim()) return; // Ignore empty titles
    try {
      await axios.post('http://localhost:5000/api/tasks', { title });
      setTitle('');
      fetchTasks(); // Refresh the list of tasks
    } catch (error) {
      console.error('Error adding task:', error);
      alert('Failed to add task. Please try again later.');
    }
  };

  // Update an existing task
  const updateTask = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/${id}`, { title });
      setTitle('');
      setEditingId(null);
      fetchTasks(); // Refresh the list of tasks
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task. Please try again later.');
    }
  };

  // Delete a task from the database
  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      fetchTasks(); // Refresh the list of tasks
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task. Please try again later.');
    }
  };

  // Mark a task as completed
  const markDone = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/tasks/${id}`);
      fetchTasks(); // Refresh the list of tasks
    } catch (error) {
      console.error('Error marking task as done:', error);
      alert('Failed to mark task as done. Please try again later.');
    }
  };

  return (
    <div className="App">
      <h1>📝 TO-DO LIST MANAGER</h1>
      <div className="input-group">
        <input
          type="text"
          placeholder="Enter task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button onClick={() => (editingId ? updateTask(editingId) : addTask())}>
          {editingId ? 'Update' : 'Add'}
        </button>
      </div>

      <ul>
        {tasks.map((task) => (
          <li key={task.id} className={task.completed ? 'done' : ''}>
            {task.title}
            <div>
              <button onClick={() => {
                setTitle(task.title);
                setEditingId(task.id);
              }}>✏️</button>
              <button onClick={() => deleteTask(task.id)}>🗑️</button>
              {!task.completed && <button onClick={() => markDone(task.id)}>✅</button>}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

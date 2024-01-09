import React, { useState, useEffect } from 'react';
import { BASE_API_URL } from './constant';
import axios from "axios";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import "./TaskManagement.css";

const TaskManagement = () => {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [editTaskId, setEditTaskId] = useState(null);
  const [editedTask, setEditedTask] = useState('');

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(formatAMPM(new Date()));
    }, 600);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const getTask = async () => {
      await axios.get(`${BASE_API_URL}getTask`).then((res) => {
        setTasks(res.data.data);
      })
    }
    getTask();
  }, [tasks, task]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (task !== "") {
      await axios.post(`${BASE_API_URL}saveTask`, { task }).then((res) => {
        if (res.data.status === 200) {
          setTask("");
          console.log(tasks);
        }
      })
    }
  }
  const handleDeleteTask = async (id) => {
    await axios.post(`${BASE_API_URL}deleteTask`, { id }).then((res) => {
      console.log(res.data);
    });
  }
  const handleUpdateTask = async (taskId, editedTask) => {
    await axios.put(`${BASE_API_URL}updateTask`, { id: taskId, task: editedTask });
  }

  const handleStartEdit = (taskId, taskText) => {
    setEditTaskId(taskId);
    setEditedTask(taskText);
  };

  const handleCancelEdit = () => {
    setEditTaskId(null);
    setEditedTask('');
  };

  const handleUpdate = (taskId) => {
    handleUpdateTask(taskId, editedTask);
    setEditTaskId(null);
    setEditedTask('');
  };

  const handleDoneTask = async (id, task, complete) => {
    await axios.put(`${BASE_API_URL}updateTask`, { id, task, isComplete: !complete });
  }

  function formatAMPM(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;

    const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    const formattedTime = `${formattedHours}:${formattedMinutes}:${formattedSeconds} ${ampm}`;

    return `${formattedDate} ${formattedTime}`;
  }

  return (
    <div className='container'>
      <div className='box'>
        <div>
          <h1>Task Management App</h1>
          <h2>{currentTime}</h2>
        </div>
        <div>
          {tasks ? (
            <>
              {tasks.map((item, index) => (
                <div key={index} className={`task-card ${item.complete ? 'completed' : ''}`}>
                  <div className="task-content">
                    {editTaskId === item.id ? (
                      <>
                        <input
                          type="text"
                          value={editedTask}
                          onChange={(e) => setEditedTask(e.target.value)}
                        />
                        <button onClick={() => handleUpdate(item.id)}>
                          <CheckCircleIcon className="icon" />
                          Update
                        </button>
                        <button onClick={handleCancelEdit}>
                          <DeleteIcon className="icon" />
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>{item.complete ? <p style={{ textDecoration: "line-through" }}>{item.task}</p> : <p>{item.task}</p>}</>
                    )}
                  </div>
                  <div className="task-icons">
                    {editTaskId !== item.id && (
                      <button onClick={() => handleStartEdit(item.id, item.task)}>
                        <EditIcon className="icon" />
                        Edit
                      </button>
                    )}
                    <button onClick={() => handleDoneTask(item.id, item.task, item.complete)}>
                      <CheckCircleIcon className="icon" />
                      Done
                    </button>
                    <button onClick={() => handleDeleteTask(item.id)}>
                      <DeleteIcon className="icon" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <>
              <p>Well done! All tasks are completed.</p>
            </>
          )}
        </div>

        <div className='addTodo'>
          <form onSubmit={handleCreateTask}>
            <input type="text" placeholder="Enter task..." value={task} onChange={(e) => setTask(e.target.value)} />
            <button type='submit'><AddIcon /></button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TaskManagement;

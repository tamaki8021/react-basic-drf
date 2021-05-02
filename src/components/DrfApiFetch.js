import React, { useState, useEffect } from 'react';
import axios from "axios";

const DrfApiFetch = () => {

  const [tasks, setTasks] = useState([])
  const [selectedTask, setSelectedTask] = useState([])
  const [editedTask, setEditedTask] = useState({id: '', title: ''})
  const [id, setId] = useState(1)

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/task/', {
      headers: {
        'Authorization': 'Token 49cd03bf03a122d04d05934cdd0722185604e3cb'
      }
    }).then(res => {
      setTasks(res.data)
    })
  }, [])

  const newTask = (task) => {

    const data = {
      title: task.title
    }

    axios.post(`http://127.0.0.1:8000/api/task/`, data, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token 49cd03bf03a122d04d05934cdd0722185604e3cb'
      }
    }).then(res => {
      setTasks([...tasks, res.data])
      setEditedTask({id: '', title: ''})
    })
  }

  const getTask = () => {
    axios.get(`http://127.0.0.1:8000/api/task/${id}/`, {
      headers: {
        'Authorization': 'Token 49cd03bf03a122d04d05934cdd0722185604e3cb'
      }
    }).then(res => {setSelectedTask(res.data)})
  }

  const editTask = (task) => {
    axios.put(`http://127.0.0.1:8000/api/task/${task.id}/`, task, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token 49cd03bf03a122d04d05934cdd0722185604e3cb'
      }
    }).then(res => {
      setTasks(tasks.map(task => (task.id === editedTask.id ? res.data : task)))
      setEditedTask({id: '', title: ''})
    })
  }


  const deleteTask = (id) => {
    axios.delete(`http://127.0.0.1:8000/api/task/${id}/`, {
      headers: {
        'Authorization': 'Token 49cd03bf03a122d04d05934cdd0722185604e3cb'
      }
    }).then(res => {
      setTasks(tasks.filter(task => task.id !== id))
      setSelectedTask([])
      if (editedTask.id === id) {
        setEditedTask({id: '', title: ''})
      }
    })
  }

  const handleInputChange = e => {
    const value = e.target.value
    const name = e.target.name
    setEditedTask({...editedTask, [name]: value})
  }


  return (
    <div>
      <ul>
        {
          tasks.map(task => (
            <li key={task.id}>
              {task.title} {task.id}
              <button onClick={() => deleteTask(task.id)}>
                <i className="fas fa-trash-alt"></i>
              </button>

              <button onClick={() => setEditedTask(task)}>
                <i className="fas fa-pen"></i>
              </button>
            </li>
          ))
        }
      </ul>

      <br/>
      <p>Set ID</p>
      <input type='test' value={id} onChange={e => setId(e.target.value)}/>

      <br/>
      <button type='button' onClick={() => getTask()}>Get task</button>
      {/*<button type='button' onClick={() => deleteTask()}>delete</button>*/}
      <h3>{selectedTask.title} {selectedTask.id}</h3>

      <input type="text" name="title" value={editedTask.title} onChange={e => handleInputChange(e)} placeholder="New Task ?" required />
      { editedTask.id ?
        <button onClick={() => editTask(editedTask)}>update</button>
        :
        <button onClick={() => newTask(editedTask)}>create</button>
      }
    </div>
  );
};

export default DrfApiFetch;

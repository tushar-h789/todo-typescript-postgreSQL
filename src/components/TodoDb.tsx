'use client';

import { useState, useEffect } from 'react';
import { Todo } from '../types/todo';


const TodoDb = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<string>('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const response = await fetch('/api/todos');
    const todos = await response.json();
    setTodos(todos);
  };

  const addTodo = async () => {
    if (newTodo.trim() === '') return;
    const response = await fetch('/api/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: newTodo }),
    });
    const todo = await response.json();
    setTodos([...todos, todo]);
    setNewTodo('');
  };

  const toggleComplete = async (id: number) => {
    const todo = todos.find(todo => todo.id === id);
    if (!todo) return;

    const response = await fetch('/api/todos', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, completed: !todo.completed }),
    });
    const updatedTodo = await response.json();

    setTodos(
      todos.map(todo =>
        todo.id === id ? updatedTodo : todo
      )
    );
  };

  const deleteTodo = async (id: number) => {
    await fetch('/api/todos', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });

    setTodos(todos.filter(todo => todo.id !== id));
  };
  return (
    <div>
      <h1 className='font-sans font-semibold text-3xl text-white my-3 bg-amber-700 p-2 rounded-lg text-center'>Todo List</h1>
      <input
        type="text"
        value={newTodo}
        onChange={e => setNewTodo(e.target.value)}
        placeholder="Add a new todo"
      />
      <button onClick={addTodo}>Add Todo</button>

      <ul className='mt-6'>
        {todos.map(todo => (
          <li key={todo.id} className='flex items-center'>
            <span
              style={{
                textDecoration: todo.completed ? 'line-through' : 'none',
              }}
            >
              {todo.text}
            </span>
            <div className='flex gap-3 justify-center items-center'>
            <button onClick={() => toggleComplete(todo.id)}>
              {todo.completed ? 'Undo' : 'Complete'}
            </button>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TodoDb
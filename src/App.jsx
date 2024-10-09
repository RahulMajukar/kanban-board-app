import React, { useState, useEffect } from "react";
import { FiArrowLeft, FiArrowRight, FiTrash } from "react-icons/fi";
import "./App.css";

const App = () => {
  const columns = ["todo", "inProgress", "done"];
  const [tasks, setTasks] = useState({
    todo: [],
    inProgress: [],
    done: [],
  });

  // Load tasks from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem("kanbanTasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Save tasks to localStorage
  const saveTasks = (newTasks) => {
    setTasks(newTasks);
    localStorage.setItem("kanbanTasks", JSON.stringify(newTasks));
  };

  const addTask = (column, taskDescription, assignedTo = "Unassigned") => {
    if (taskDescription.trim() !== "") {
      const newTask = {
        description: taskDescription,
        createdAt: new Date().toLocaleString(),
        updatedAt: new Date().toLocaleString(),
        assignedTo: assignedTo,
      };
      const newTasks = { ...tasks, [column]: [...tasks[column], newTask] };
      saveTasks(newTasks);
    }
  };

  const moveTask = (fromColumn, toColumn, taskIndex) => {
    const task = tasks[fromColumn][taskIndex];
    task.updatedAt = new Date().toLocaleString(); // Update the date when task is moved
    const updatedFromColumn = tasks[fromColumn].filter((_, i) => i !== taskIndex);
    const updatedToColumn = [...tasks[toColumn], task];

    saveTasks({
      ...tasks,
      [fromColumn]: updatedFromColumn,
      [toColumn]: updatedToColumn,
    });
  };

  const deleteTask = (column, taskIndex) => {
    const updatedColumn = tasks[column].filter((_, i) => i !== taskIndex);
    saveTasks({ ...tasks, [column]: updatedColumn });
  };

  return (
    <div className="w-full mx-auto py-24 px-8">
      <div className="prose text-gray-500 prose-sm w-full max-w-lg mx-auto">
        <h1>Kanban Board</h1>
        <p>
          Start by adding a task on the to-do card, then press enter or click the ADD button.
        </p>
      </div>
      <div className="container mx-auto p-4 max-w-7xl">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 mt-8">
          {columns.map((column) => (
            <KanbanColumn
              key={column}
              column={column}
              tasks={tasks[column]}
              onAddTask={addTask}
              onMoveTask={moveTask}
              onDeleteTask={deleteTask}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const KanbanColumn = ({ column, tasks, onAddTask, onMoveTask, onDeleteTask }) => {
  const [newTask, setNewTask] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  const handleAddTask = (e) => {
    e.preventDefault();
    onAddTask(column, newTask, assignedTo);
    setNewTask("");
    setAssignedTo("");
  };

  const getNextColumn = (column) => {
    if (column === "todo") return "inProgress";
    if (column === "inProgress") return "done";
    return null;
  };

  const getPreviousColumn = (column) => {
    if (column === "done") return "inProgress";
    if (column === "inProgress") return "todo";
    return null;
  };

  return (
    <div className="flex flex-col gap-2 bg-gray-50 p-8 rounded-3xl h-full">
      <h2 className="block text-sm text-gray-700 capitalize">{column.replaceAll(/([A-Z])/g, ' $1')}</h2>
      <div className="space-y-2">
        {tasks.map((task, index) => (
          <div key={index} className="bg-white p-2 rounded shadow flex flex-col">
            <div className="flex justify-between items-center">
              <p className="flex-grow">{task.description}</p>
              <div className="flex items-center space-x-1">
                {getPreviousColumn(column) && (
                  <button
                    onClick={() => onMoveTask(column, getPreviousColumn(column), index)}
                    className="text-blue-500 hover:text-blue-600 p-1"
                  >
                    <FiArrowLeft />
                  </button>
                )}
                {getNextColumn(column) && (
                  <button
                    onClick={() => onMoveTask(column, getNextColumn(column), index)}
                    className="text-green-500 hover:text-green-600 p-1"
                  >
                    <FiArrowRight />
                  </button>
                )}
                <button
                  onClick={() => onDeleteTask(column, index)}
                  className="text-red-500 hover:text-red-600 p-1"
                >
                  <FiTrash />
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-400">Assigned to: {task.assignedTo}</p>
            <p className="text-xs text-gray-400">Created at: {task.createdAt}</p>
            <p className="text-xs text-gray-400">Updated at: {task.updatedAt}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleAddTask} className="mt-4 flex flex-col">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          className="block w-full h-12 px-4 py-3 placeholder-gray-500 bg-white border border-gray-200 rounded-lg text-blue-500 focus:outline-none focus:ring-2 text-xs"
          placeholder="New task description..."
        />
        <input
          type="text"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          className="block w-full h-12 px-4 py-3 placeholder-gray-500 bg-white border border-gray-200 rounded-lg text-blue-500 focus:outline-none focus:ring-2 text-xs mt-2"
          placeholder="Assign to..."
        />
        <button
          type="submit"
          className="rounded-full bg-blue-600 px-8 py-2 h-12 text-sm font-semibold text-white hover:bg-blue-500 w-full mt-2"
        >
          Add Task
        </button>
      </form>
    </div>
  );
};

export default App;

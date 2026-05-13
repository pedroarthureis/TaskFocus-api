import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { v4 as uuidv4 } from 'uuid';

const TaskContext = createContext();

export const useTaskContext = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useLocalStorage('todos-projects', [
    { id: '1', name: 'Trabalho', color: '#3b82f6' },
    { id: '2', name: 'Estudos', color: '#10b981' },
    { id: '3', name: 'Pessoal', color: '#f59e0b' }
  ]);
  const [theme, setTheme] = useLocalStorage('todos-theme', 'light');

  // Filter controls
  const [filter, setFilter] = useState('all'); // 'all', 'today', 'completed', project-id

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Carregar as tarefas vindo da API ao abrir a aplicação
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/tasks');
        if (response.ok) {
          const data = await response.json();
          // Converte do banco (nomenclatura sql) para o frontend (camelCase do react)
          setTasks(data.map(t => ({ 
            id: t.id,
            title: t.text,
            projectId: t.category,
            priority: t.priority,
            dueDate: t.due_date,
            position: t.position,
            completed: !!t.completed 
          })));
        }
      } catch (error) {
        console.error('Erro ao buscar tarefas:', error);
      }
    };
    fetchTasks();
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const addTask = async (taskProps) => {
    try {
      const response = await fetch('http://localhost:3001/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: taskProps.title,
          category: taskProps.projectId || null,
          priority: taskProps.priority || 'medium',
          due_date: taskProps.dueDate || null,
          position: tasks.length // Salva na ultima posição
        })
      });
      if (response.ok) {
        const newTask = await response.json();
        setTasks(prev => [...prev, { 
          id: newTask.id,
          title: newTask.text,
          projectId: newTask.category,
          priority: newTask.priority,
          dueDate: newTask.due_date,
          position: newTask.position,
          completed: false 
        }]);
      }
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error);
    }
  };

  const updateTask = async (id, updates) => {
    // Atualização otimista na tela (pra não parecer q tá lagado)
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, ...updates } : task
    ));
    
    try {
      const taskToUpdate = tasks.find(t => t.id === id);
      const payload = { ...taskToUpdate, ...updates };
      await fetch(`http://localhost:3001/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: payload.title,
          category: payload.projectId || null,
          priority: payload.priority || 'medium',
          due_date: payload.dueDate || null,
          position: payload.position || 0,
          completed: payload.completed ? 1 : 0
        })
      });
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
    }
  };

  const deleteTask = async (id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    try {
      await fetch(`http://localhost:3001/api/tasks/${id}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
    }
  };

  const toggleTaskComplete = async (id) => {
    const taskToUpdate = tasks.find(t => t.id === id);
    if (!taskToUpdate) return;
    
    const newCompletedState = !taskToUpdate.completed;
    
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, completed: newCompletedState } : task
    ));

    try {
      await fetch(`http://localhost:3001/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: taskToUpdate.title,
          category: taskToUpdate.projectId || null,
          priority: taskToUpdate.priority || 'medium',
          due_date: taskToUpdate.dueDate || null,
          position: taskToUpdate.position || 0,
          completed: newCompletedState ? 1 : 0
        })
      });
    } catch (error) {
      console.error('Erro ao alternar status:', error);
    }
  };

  const addProject = (name, color) => {
    const newProject = {
      id: uuidv4(),
      name,
      color: color || '#6b7280'
    };
    setProjects(prev => [...prev, newProject]);
  };

  const deleteProject = (id) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    // Remove as referências de projeto das tarefas existentes
    setTasks(prev => prev.map(t => t.projectId === id ? { ...t, projectId: null } : t));
    if (filter === id) setFilter('all');
  };

  const reorderTasks = async (reorderedTasks) => {
    setTasks(reorderedTasks);

    try {
      // Mandar pro banco atualização de posição pra todos que mudaram
      await Promise.all(reorderedTasks.map((task, index) => 
        fetch(`http://localhost:3001/api/tasks/${task.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: task.title,
            category: task.projectId || null,
            priority: task.priority || 'medium',
            due_date: task.dueDate || null,
            position: index,
            completed: task.completed ? 1 : 0
          })
        })
      ));
    } catch (error) {
      console.error('Erro ao reordenar no DB:', error);
    }
  };

  return (
    <TaskContext.Provider value={{
      tasks,
      projects,
      theme,
      filter,
      setFilter,
      toggleTheme,
      addTask,
      updateTask,
      deleteTask,
      toggleTaskComplete,
      addProject,
      deleteProject,
      reorderTasks
    }}>
      {children}
    </TaskContext.Provider>
  );
};

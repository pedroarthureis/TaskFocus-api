import React, { useState } from 'react';
import { useTaskContext } from '../../context/TaskContext';
import { 
  CheckCircle2, 
  Calendar, 
  CalendarDays, 
  FolderKanban, 
  Plus, 
  X,
  Trash2
} from 'lucide-react';
import styles from './Sidebar.module.css';

export default function Sidebar({ onClose }) {
  const { projects, addProject, deleteProject, filter, setFilter } = useTaskContext();
  const [isAdding, setIsAdding] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  const handleAddProject = (e) => {
    e.preventDefault();
    if (newProjectName.trim()) {
      // Pick a random color for the project if not specified
      const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      addProject(newProjectName.trim(), randomColor);
      setNewProjectName('');
      setIsAdding(false);
    }
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <div className={styles.logo}>
          <CheckCircle2 className={styles.logoIcon} />
          <h2>TaskFocus</h2>
        </div>
        <button className={styles.closeBtn} onClick={onClose}>
          <X size={20} />
        </button>
      </div>

      <div className={styles.navSection}>
        <div 
          className={`${styles.navItem} ${filter === 'all' ? styles.active : ''}`}
          onClick={() => setFilter('all')}
        >
          <FolderKanban size={18} />
          <span>Todas as Tarefas</span>
        </div>
        <div 
          className={`${styles.navItem} ${filter === 'today' ? styles.active : ''}`}
          onClick={() => setFilter('today')}
        >
          <Calendar size={18} />
          <span>Hoje</span>
        </div>
        <div 
          className={`${styles.navItem} ${filter === 'upcoming' ? styles.active : ''}`}
          onClick={() => setFilter('upcoming')}
        >
          <CalendarDays size={18} />
          <span>Próximas</span>
        </div>
      </div>

      <div className={styles.projectsSection}>
        <div className={styles.projectsHeader}>
          <h3>Projetos</h3>
          <button 
            className={styles.addBtn}
            onClick={() => setIsAdding(!isAdding)}
          >
            <Plus size={16} />
          </button>
        </div>

        {isAdding && (
          <form onSubmit={handleAddProject} className={styles.addForm}>
            <input 
              type="text" 
              placeholder="Nome do projeto..."
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              autoFocus
              className={styles.addInput}
            />
          </form>
        )}

        <div className={styles.projList}>
          {projects.map(proj => (
            <div 
              key={proj.id}
              className={`${styles.projItem} ${filter === proj.id ? styles.active : ''}`}
              onClick={() => setFilter(proj.id)}
            >
              <div className={styles.projContent}>
                <div 
                  className={styles.projColor} 
                  style={{ backgroundColor: proj.color }} 
                />
                <span className={styles.projName}>{proj.name}</span>
              </div>
              <button 
                className={styles.deleteProjBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  deleteProject(proj.id);
                }}
                title="Excluir Projeto"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

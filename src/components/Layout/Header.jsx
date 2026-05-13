import React, { useContext } from 'react';
import { useTaskContext } from '../../context/TaskContext';
import { AuthContext } from '../../context/AuthContext';
import { Menu, Moon, Sun, Bell, LogOut } from 'lucide-react';
import { isToday } from 'date-fns';
import styles from './Header.module.css';

export default function Header({ onMenuClick }) {
  const { tasks, theme, toggleTheme } = useTaskContext();
  const { user, logout } = useContext(AuthContext);

  const todaysTasks = tasks.filter(task => {
    if (!task.dueDate) return false;
    return isToday(new Date(task.dueDate));
  });

  const completedToday = todaysTasks.filter(t => t.completed).length;
  const totalToday = todaysTasks.length;
  const progressPercent = totalToday === 0 ? 0 : Math.round((completedToday / totalToday) * 100);

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <button className={styles.menuBtn} onClick={onMenuClick}>
          <Menu size={24} />
        </button>
        <div className={styles.greeting}>
          <h1>Olá, {user?.nome || 'Usuário'}!</h1>
          <p>Você tem {totalToday - completedToday} tarefas para hoje.</p>
        </div>
      </div>

      <div className={styles.right}>
        <div className={styles.progressContainer}>
          <div className={styles.progressText}>
            <span>Progresso Diário</span>
            <span>{progressPercent}%</span>
          </div>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <button className={styles.iconBtn}>
          <Bell size={20} />
        </button>

        <button className={styles.iconBtn} onClick={toggleTheme} title="Trocar Tema">
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button className={styles.iconBtn} onClick={logout} title="Sair do sistema" style={{ color: '#ef4444' }}>
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}

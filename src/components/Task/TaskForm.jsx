import React, { useState } from 'react';
import { useTaskContext } from '../../context/TaskContext';
import styles from './Task.module.css';

export default function TaskForm({ onClose }) {
  const { addTask, projects } = useTaskContext();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState(projects[0]?.id || '');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    addTask({
      title,
      description,
      projectId,
      priority,
      dueDate: dueDate || null
    });
    
    // Request permission for local notifications as an extra wow-factor
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }

    onClose();
  };

  return (
    <div className={styles.taskFormWrapper}>
      <form className={styles.taskForm} onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="O que precisa ser feito?" 
          className={styles.titleInput}
          value={title}
          onChange={e => setTitle(e.target.value)}
          autoFocus
        />
        
        <textarea 
          placeholder="Descrição (opcional)"
          className={styles.descInput}
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={2}
        />

        <div className={styles.formRow}>
          <div className={styles.inputGroup}>
            <label>Projeto</label>
            <select value={projectId} onChange={e => setProjectId(e.target.value)}>
              <option value="">Nenhum projeto</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label>Prioridade</label>
            <select value={priority} onChange={e => setPriority(e.target.value)}>
              <option value="low">Baixa</option>
              <option value="medium">Média</option>
              <option value="high">Alta</option>
            </select>
          </div>

          <div className={styles.inputGroup}>
            <label>Data</label>
            <input 
              type="date" 
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.formActions}>
          <button type="button" className={styles.cancelBtn} onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className={styles.submitBtn} disabled={!title.trim()}>
            Adicionar Tarefa
          </button>
        </div>
      </form>
    </div>
  );
}

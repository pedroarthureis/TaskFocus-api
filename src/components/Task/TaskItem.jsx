import React, { useState } from 'react';
import { useTaskContext } from '../../context/TaskContext';
import { Check, Calendar, GripVertical, Trash2, Edit2, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '../../utils';
import styles from './Task.module.css';

export default function TaskItem({ task, dragHandleProps, isDragging }) {
  const { toggleTaskComplete, deleteTask, projects } = useTaskContext();
  const [expanded, setExpanded] = useState(false);

  const project = projects.find(p => p.id === task.projectId);

  const priorityColor = {
    high: 'var(--priority-high)',
    medium: 'var(--priority-medium)',
    low: 'var(--priority-low)'
  }[task.priority] || 'var(--text-secondary)';

  return (
    <div className={cn(styles.taskItem, task.completed && styles.completed, isDragging && styles.dragging)}>
      <div className={styles.taskMain}>
        <div 
          className={styles.dragHandle} 
          {...dragHandleProps}
        >
          <GripVertical size={16} />
        </div>

        <button 
          className={cn(styles.checkbox, task.completed && styles.checked)}
          onClick={() => toggleTaskComplete(task.id)}
        >
          {task.completed && <Check size={14} />}
        </button>

        <div className={styles.content} onClick={() => setExpanded(!expanded)}>
          <h3 className={styles.title}>{task.title}</h3>
          <div className={styles.meta}>
            {task.dueDate && (
              <span className={styles.metaItem}>
                <Calendar size={12} />
                {new Date(task.dueDate).toLocaleDateString()}
              </span>
            )}
            {project && (
              <span className={styles.metaItem}>
                <span 
                  className={styles.projectDot} 
                  style={{ backgroundColor: project.color }} 
                />
                {project.name}
              </span>
            )}
            {task.priority && (
              <span className={styles.metaItem} style={{ color: priorityColor }}>
                Priority: {task.priority}
              </span>
            )}
          </div>
        </div>

        <div className={styles.actions}>
          <button 
            className={styles.iconBtn} 
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          <button 
            className={cn(styles.iconBtn, styles.danger)}
            onClick={() => deleteTask(task.id)}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {expanded && (
        <div className={styles.details}>
          {task.description ? (
            <p className={styles.description}>{task.description}</p>
          ) : (
            <p className={styles.noDescription}>Sem descrição adicional.</p>
          )}
          
          {/* Subtasks could go here */}
        </div>
      )}
    </div>
  );
}

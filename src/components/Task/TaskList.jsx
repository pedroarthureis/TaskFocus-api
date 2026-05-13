import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useTaskContext } from '../../context/TaskContext';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';
import { Plus } from 'lucide-react';
import { isToday, parseISO, compareAsc } from 'date-fns';
import styles from './Task.module.css';

export default function TaskList() {
  const { tasks, filter, reorderTasks } = useTaskContext();
  const [isAddingTask, setIsAddingTask] = useState(false);

  // Filter Logic
  let filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'today') {
      return task.dueDate && isToday(parseISO(task.dueDate));
    }
    if (filter === 'upcoming') {
      return task.dueDate && !isToday(parseISO(task.dueDate)) && new Date(task.dueDate) > new Date();
    }
    // Filter by project id
    return task.projectId === filter;
  });

  // Sort logic (Incomplete first, then by date, then priority)
  const priorityWeight = { high: 3, medium: 2, low: 1 };
  filteredTasks.sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    if (a.dueDate && b.dueDate) {
      const dateCmp = compareAsc(parseISO(a.dueDate), parseISO(b.dueDate));
      if (dateCmp !== 0) return dateCmp;
    }
    if (a.priority && b.priority) {
      return priorityWeight[b.priority] - priorityWeight[a.priority];
    }
    return 0;
  });

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    // Create a new array from the full tasks pool
    // To properly support reorder within filtered views, we need to map the reordered item back to the main array.
    // However, @hello-pangea/dnd is tricky array indexes when filtered. For simplicity in this demo,
    // we only allow reordering if filter === 'all'
    if (filter !== 'all') {
      alert("A reordenação manual só está disponível na visão 'Todas as Tarefas'.");
      return;
    }

    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    reorderTasks(items);
  };

  return (
    <div className={styles.taskListContainer}>
      <div className={styles.header}>
        <h2>{
          filter === 'all' ? 'Todas as Tarefas' :
          filter === 'today' ? 'Tarefas de Hoje' :
          filter === 'upcoming' ? 'Próximas Tarefas' :
          'Projeto Específico'
        }</h2>
        <button 
          className={styles.addBtnSolid}
          onClick={() => setIsAddingTask(true)}
        >
          <Plus size={16} /> Nova Tarefa
        </button>
      </div>

      {isAddingTask && (
        <TaskForm onClose={() => setIsAddingTask(false)} />
      )}

      {filteredTasks.length === 0 && !isAddingTask && (
        <div className={styles.emptyState}>
          <img src="https://illustrations.popsy.co/amber/freelancer.svg" alt="Empty state" width={200} />
          <p>Nenhuma tarefa encontrada. Aproveite seu tempo livre!</p>
        </div>
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="task-list">
          {(provided) => (
            <div 
              {...provided.droppableProps} 
              ref={provided.innerRef}
              className={styles.list}
            >
              {filteredTasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                    >
                      <TaskItem 
                        task={task} 
                        dragHandleProps={provided.dragHandleProps}
                        isDragging={snapshot.isDragging}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}

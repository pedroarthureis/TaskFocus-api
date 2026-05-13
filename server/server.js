const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');
const sequelize = require('./dbSequelize');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

// 1. Get todas as tarefas
app.get('/api/tasks', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM tasks ORDER BY position ASC, id ASC');
    res.json(rows);
  } catch (error) {
    console.error("Erro no GET /api/tasks:", error);
    res.status(500).json({ error: 'Erro ao buscar tarefas' });
  }
});

// 2. Criar uma nova tarefa
app.post('/api/tasks', async (req, res) => {
  const { text, category, priority, due_date, position } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO tasks (text, category, priority, due_date, position) VALUES (?, ?, ?, ?, ?)',
      [text, category || null, priority || 'medium', due_date || null, position || 0]
    );
    res.status(201).json({ id: result.insertId, text, category, priority, due_date, position, completed: 0 });
  } catch (error) {
    console.error("Erro no POST /api/tasks:", error);
    res.status(500).json({ error: 'Erro ao criar tarefa' });
  }
});

// 3. Atualizar uma tarefa 
app.put('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { text, category, priority, due_date, completed, position } = req.body;
  try {
    await db.query(
      'UPDATE tasks SET text = ?, category = ?, priority = ?, due_date = ?, completed = ?, position = ? WHERE id = ?',
      [text, category, priority, due_date, completed, position, id]
    );
    res.json({ message: 'Tarefa atualizada' });
  } catch (error) {
    console.error("Erro no PUT /api/tasks/:id :", error);
    res.status(500).json({ error: 'Erro ao atualizar tarefa' });
  }
});

// 4. Deletar uma tarefa
app.delete('/api/tasks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM tasks WHERE id = ?', [id]);
    res.json({ message: 'Tarefa deletada' });
  } catch (error) {
    console.error("Erro no DELETE /api/tasks/:id :", error);
    res.status(500).json({ error: 'Erro ao deletar tarefa' });
  }
});

// Sincronizar Sequelize e iniciar servidor
const PORT = process.env.PORT || 3001;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`[Backend] Servidor rodando na porta ${PORT}`);
  });
}).catch(err => {
  console.error('Erro ao conectar ao banco de dados com Sequelize:', err);
});

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario');
const Perfil = require('../models/Perfil');

// 1. Criar usuário e perfil
router.post('/', async (req, res) => {
  const { nome, email, senha, perfil_nome } = req.body;
  try {
    if (!nome || !email || !senha || !perfil_nome) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const emailExiste = await Usuario.findOne({ where: { email } });
    if (emailExiste) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    // Cria Perfil
    const novoPerfil = await Perfil.create({ perfil_nome });

    // Hash da senha
    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);

    // Cria Usuário com o ID do perfil criado
    const novoUsuario = await Usuario.create({
      nome,
      email,
      senha: senhaHash,
      id_perfil: novoPerfil.id
    });

    // Buscar com o relacionamento para retornar tudo
    const usuarioCompleto = await Usuario.findByPk(novoUsuario.id, {
      include: [{ model: Perfil, as: 'perfil' }]
    });

    res.status(201).json(usuarioCompleto);
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    res.status(500).json({ error: 'Erro interno ao criar usuário/perfil' });
  }
});

// 2. Listar todos trazendo o perfil ("uso de relacionamento do ORM")
router.get('/', async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({
      include: [{ model: Perfil, as: 'perfil' }]
    });
    res.json(usuarios);
  } catch (error) {
    console.error("Erro ao listar usuários:", error);
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
});

// 3. Deletar usuário (apaga perfil se for o caso)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findByPk(id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const id_perfil = usuario.id_perfil;
    await usuario.destroy(); // Apaga do DB
    
    // Deleta o perfil correspondente
    if (id_perfil) {
      await Perfil.destroy({ where: { id: id_perfil } });
    }
    
    res.json({ message: 'Usuário e Perfil deletados' });
  } catch (error) {
    console.error("Erro ao deletar usuário:", error);
    res.status(500).json({ error: 'Erro ao deletar usuário' });
  }
});

module.exports = router;

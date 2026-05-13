const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const Perfil = require('../models/Perfil');

router.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  try {
    if (!email || !senha) {
       return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    const usuario = await Usuario.findOne({ 
       where: { email },
       include: [{ model: Perfil, as: 'perfil' }]
    });

    if (!usuario) {
       return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const isMatch = await bcrypt.compare(senha, usuario.senha);
    if (!isMatch) {
       return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const token = jwt.sign(
       { id: usuario.id, email: usuario.email },
       process.env.JWT_SECRET || 'secret_para_desenvolvimento',
       { expiresIn: '1d' }
    );

    res.json({
       token,
       usuario: {
         id: usuario.id,
         nome: usuario.nome,
         email: usuario.email,
         perfil: usuario.perfil ? usuario.perfil.perfil_nome : null
       }
    });
  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
});

// A Rota de cadastro já é gerenciada por /api/users no momento (o POST já faz hash)
// Vamos adicionar um alias em /api/auth/register que chama o mesmo código para simplificar o fetch
router.post('/register', async (req, res) => {
    // Usamos a lógica básica se o usuário quiser se registrar como "Membro" (Perfil padrão)
    const { nome, email, senha } = req.body;
    try {
        if (!nome || !email || !senha) {
          return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
        }
    
        const emailExiste = await Usuario.findOne({ where: { email } });
        if (emailExiste) {
          return res.status(400).json({ error: 'Email já cadastrado' });
        }
    
        const novoPerfil = await Perfil.create({ perfil_nome: 'Membro' });
    
        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(senha, salt);
    
        const novoUsuario = await Usuario.create({
          nome,
          email,
          senha: senhaHash,
          id_perfil: novoPerfil.id
        });
    
        const usuarioCompleto = await Usuario.findByPk(novoUsuario.id, {
          include: [{ model: Perfil, as: 'perfil' }]
        });
        
        // Retorna o token para autologar
        const token = jwt.sign(
            { id: usuarioCompleto.id, email: usuarioCompleto.email },
            process.env.JWT_SECRET || 'secret_para_desenvolvimento',
            { expiresIn: '1d' }
        );

        res.status(201).json({
            token,
            usuario: {
              id: usuarioCompleto.id,
              nome: usuarioCompleto.nome,
              email: usuarioCompleto.email,
              perfil: usuarioCompleto.perfil ? usuarioCompleto.perfil.perfil_nome : null
            }
        });
      } catch (error) {
        console.error("Erro ao registrar usuário:", error);
        res.status(500).json({ error: 'Erro interno ao registrar' });
      }
});

module.exports = router;

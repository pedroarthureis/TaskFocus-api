import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    perfil_nome: ''
  });
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/users');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const res = await fetch('http://localhost:3001/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error);
      }
      setFormData({ nome: '', email: '', senha: '', perfil_nome: '' });
      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:3001/api/users/${id}`, { method: 'DELETE' });
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Gerenciamento de Usuários</h2>
      
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <input 
          type="text" name="nome" placeholder="Nome" value={formData.nome} onChange={handleChange}
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" required
        />
        <input 
          type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange}
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" required
        />
        <input 
          type="password" name="senha" placeholder="Senha" value={formData.senha} onChange={handleChange}
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" required
        />
        <input 
          type="text" name="perfil_nome" placeholder="Nome do Perfil (ex: Admin)" value={formData.perfil_nome} onChange={handleChange}
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" required
        />
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium p-2 rounded col-span-1 md:col-span-2 mx-auto w-full max-w-sm transition-colors">
          Criar Usuário e Perfil
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white text-left text-sm text-gray-700">
          <thead className="bg-gray-100 text-gray-600 font-semibold border-b">
            <tr>
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">Nome</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Perfil</th>
              <th className="py-3 px-4 text-center">Ação</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">{u.id}</td>
                <td className="py-3 px-4">{u.nome}</td>
                <td className="py-3 px-4">{u.email}</td>
                <td className="py-3 px-4">
                  <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                    {u.perfil ? u.perfil.perfil_nome : 'N/A'}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <button onClick={() => handleDelete(u.id)} className="text-red-500 hover:text-red-700 hover:bg-red-100 p-1 rounded-full transition-colors">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr><td colSpan="5" className="py-4 text-center text-gray-500">Nenhum usuário cadastrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;

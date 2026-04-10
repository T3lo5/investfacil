import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Register({ setUser }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    const mockUser = { email, name: email.split('@')[0] };
    localStorage.setItem('investfacil_user', JSON.stringify(mockUser));
    setUser(mockUser);
    navigate('/onboarding');
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Criar Conta</h2>
      <form onSubmit={handleRegister} className="space-y-4">
        <input type="email" placeholder="Seu e-mail" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
        <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700">Cadastrar</button>
      </form>
      <p className="mt-4 text-center text-sm">
        Já tem conta? <Link to="/login" className="text-blue-600 hover:underline">Faça login</Link>
      </p>
    </div>
  );
}

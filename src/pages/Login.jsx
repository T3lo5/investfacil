import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login({ setUser }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  
  const handleLogin = (e) => {
    e.preventDefault();
    const mockUser = { email, name: email.split('@')[0] };
    localStorage.setItem('investfacil_user', JSON.stringify(mockUser));
    setUser(mockUser);
    navigate('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Entrar</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input type="email" placeholder="Seu e-mail" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">Entrar</button>
      </form>
      <p className="mt-4 text-center text-sm">
        Não tem conta? <Link to="/register" className="text-blue-600 hover:underline">Cadastre-se</Link>
      </p>
    </div>
  );
}

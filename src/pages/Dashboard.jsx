import { Link } from 'react-router-dom';

export default function Dashboard({ user }) {
  const profile = user?.profile || {};
  
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold mb-2">Olá, {user?.name || 'Investidor'}!</h1>
        <p className="opacity-90">Seu perfil: <span className="font-bold capitalize">{profile.risk || 'Não definido'}</span></p>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
            <p className="text-xs opacity-80">Objetivo</p>
            <p className="font-bold capitalize">{profile.goal || '-'}</p>
          </div>
          <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
            <p className="text-xs opacity-80">Horizonte</p>
            <p className="font-bold capitalize">{profile.horizon || '-'}</p>
          </div>
          <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
            <p className="text-xs opacity-80">Inicial</p>
            <p className="font-bold">R$ {profile.initialAmount || '0'}</p>
          </div>
          <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
            <p className="text-xs opacity-80">Aporte Mensal</p>
            <p className="font-bold">R$ {profile.monthlyContribution || '0'}</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <h3 className="text-xl font-bold mb-4">Buscar Ativos</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Encontre ações e fundos imobiliários analisados pela nossa IA.</p>
          <Link to="/search" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">Ir para Busca</Link>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
          <h3 className="text-xl font-bold mb-4">Recomendações para Você</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Baseado no seu perfil {profile.risk}, temos oportunidades interessantes.</p>
          <div className="text-sm text-yellow-600 bg-yellow-50 p-3 rounded border border-yellow-200">
            ⚠️ Em breve: Análise automática de ativos baseada no seu aporte.
          </div>
        </div>
      </div>
    </div>
  );
}

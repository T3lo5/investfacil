import { Link } from 'react-router-dom';
import { useAssets } from '../hooks/useAssets';

export default function Dashboard({ user }) {
  const { assets, loading, isUsingMockData } = useAssets();
  const profile = user?.profile || {};

  // Filtrar ativos baseados no perfil de risco do usuário
  const getRecommendedAssets = () => {
    if (!assets.length || !profile.risk) return [];

    // Filtrar por risco compatível
    const compatibleRisk = profile.risk === 'conservador' ? ['baixo', 'medio'] :
                          profile.risk === 'moderado' ? ['baixo', 'medio', 'alto'] :
                          ['alto', 'medio'];

    const filtered = assets.filter(asset => compatibleRisk.includes(asset.risk));

    // Ordenar por Dividend Yield e retornar top 3
    return filtered
      .sort((a, b) => (b.dividendYield || 0) - (a.dividendYield || 0))
      .slice(0, 3);
  };

  const recommendedAssets = getRecommendedAssets();

  return (
    <div className="space-y-6">
      {isUsingMockData && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded shadow-sm">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="font-semibold">Dados Simulados</span>
          </div>
          <p className="mt-1 text-sm">
            Não foi possível conectar à API de dados financeiros. Os dados exibidos são simulados e podem não refletir os valores reais de mercado.
          </p>
        </div>
      )}

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
          <p className="text-gray-600 dark:text-gray-400 mb-4">Baseado no seu perfil {profile.risk || ''}, temos oportunidades interessantes.</p>
          {loading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
          ) : recommendedAssets.length > 0 ? (
            <ul className="space-y-2">
              {recommendedAssets.map(asset => (
                <li key={asset.ticker} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                  <div>
                    <p className="font-bold">{asset.ticker}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{asset.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{asset.dividendYield?.toFixed(2)}%</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">DY</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-sm">Nenhuma recomendação disponível no momento.</p>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow">
        <h3 className="text-xl font-bold mb-4">⚠️ Em breve: Análise automática de ativos baseada no seu aporte.</h3>
        <p className="text-gray-600 dark:text-gray-400">Nossa IA vai analisar automaticamente os melhores ativos considerando quanto você pode investir por mês.</p>
      </div>
    </div>
  );
}

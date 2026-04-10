import { Link } from 'react-router-dom';
import { useAssets } from '../hooks/useAssets';

export default function Dashboard({ user }) {
  const { assets, loading } = useAssets();
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
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Baseado no seu perfil <span className="font-bold capitalize">{profile.risk}</span>, selecionamos estes ativos:
          </p>
          
          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : recommendedAssets.length > 0 ? (
            <div className="space-y-3">
              {recommendedAssets.map(asset => (
                <div key={asset.ticker} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <p className="font-bold">{asset.ticker}</p>
                    <p className="text-xs text-gray-500">{asset.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-600">R$ {asset.price?.toFixed(2)}</p>
                    <p className="text-xs text-green-600 font-bold">DY: {asset.dividendYield?.toFixed(2)}%</p>
                  </div>
                </div>
              ))}
              <Link to="/search" className="block text-center text-sm text-blue-600 hover:text-blue-700 font-medium mt-4">
                Ver todos os ativos →
              </Link>
            </div>
          ) : (
            <div className="text-sm text-yellow-600 bg-yellow-50 p-3 rounded border border-yellow-200">
              ⚠️ Carregando recomendações... Visite a página de busca para ver todos os ativos disponíveis.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react'
import { useAssets } from '../hooks/useAssets'
import DetailModal from '../components/DetailModal'
import SearchBar from '../components/SearchBar'

export default function AssetSearch({ user }) {
  const { assets, loading, error, searchAsset, getQuote, analyzeInvestment } = useAssets()
  const [filteredAssets, setFilteredAssets] = useState([])
  const [selectedAsset, setSelectedAsset] = useState(null)
  const [aiAnalysis, setAiAnalysis] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)

  // Filtrar e ordenar ativos
  const handleFilterAndSort = (searchTerm, typeFilter, riskFilter, sortBy) => {
    let filtered = [...assets]

    // Filtro por busca
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(asset => 
        asset.ticker.toLowerCase().includes(term) || 
        asset.name.toLowerCase().includes(term)
      )
    }

    // Filtro por tipo
    if (typeFilter && typeFilter !== 'todos') {
      filtered = filtered.filter(asset => asset.type === typeFilter)
    }

    // Filtro por risco
    if (riskFilter && riskFilter !== 'todos') {
      filtered = filtered.filter(asset => asset.risk === riskFilter)
    }

    // Ordenação
    switch (sortBy) {
      case 'preco_crescente':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'preco_decrescente':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'rentabilidade':
        filtered.sort((a, b) => (b.dividendYield || 0) - (a.dividendYield || 0))
        break
      case 'nome':
      default:
        filtered.sort((a, b) => a.name.localeCompare(b.name))
    }

    setFilteredAssets(filtered)
  }

  const handleViewDetails = async (asset) => {
    setSelectedAsset(asset)
    setAiAnalysis(null)
    
    // Buscar análise de IA se tiver perfil do usuário
    if (user?.profile) {
      setAnalyzing(true)
      try {
        const analysis = await analyzeInvestment(asset.ticker, user.profile)
        setAiAnalysis(analysis)
      } catch (err) {
        console.error('Erro na análise:', err)
      } finally {
        setAnalyzing(false)
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow">
        <h1 className="text-2xl font-bold mb-2">Buscar Ativos</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Encontre ações e fundos imobiliários analisados pela nossa IA.
        </p>
        
        <SearchBar 
          onSearch={(term) => handleFilterAndSort(term, 'todos', 'todos', 'nome')}
          onFilterType={(type) => handleFilterAndSort('', type, 'todos', 'nome')}
          onFilterRisk={(risk) => handleFilterAndSort('', 'todos', risk, 'nome')}
          onSort={(sort) => handleFilterAndSort('', 'todos', 'todos', sort)}
        />

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Carregando ativos...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {!loading && !error && filteredAssets.length === 0 && assets.length > 0 && (
          <div className="text-center py-12 text-gray-500">
            Nenhum ativo encontrado com os filtros selecionados.
          </div>
        )}

        {!loading && !error && assets.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Nenhum ativo disponível no momento.</p>
            <p className="text-sm text-gray-400">Use a busca para encontrar ativos específicos.</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(filteredAssets.length > 0 ? filteredAssets : assets).map((asset) => (
            <div 
              key={asset.ticker} 
              className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg hover:shadow-md transition cursor-pointer"
              onClick={() => handleViewDetails(asset)}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-lg">{asset.ticker}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">{asset.name}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                  asset.risk === 'baixo' ? 'bg-green-100 text-green-800' :
                  asset.risk === 'medio' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {asset.risk === 'baixo' ? 'Baixo' : asset.risk === 'medio' ? 'Médio' : 'Alto'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-blue-600">R$ {asset.price?.toFixed(2)}</span>
                <span className={`text-sm font-bold ${asset.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {asset.change >= 0 ? '+' : ''}{asset.change?.toFixed(2)}%
                </span>
              </div>
              {asset.dividendYield && (
                <p className="text-xs text-gray-500 mt-2">
                  Dividend Yield: {asset.dividendYield.toFixed(2)}%
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {selectedAsset && (
        <DetailModal 
          asset={{...selectedAsset, aiAnalysis}} 
          onClose={() => {
            setSelectedAsset(null)
            setAiAnalysis(null)
          }} 
        />
      )}
    </div>
  )
}

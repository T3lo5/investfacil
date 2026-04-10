import { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export function useAssets() {
  const [assets, setAssets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [isUsingMockData, setIsUsingMockData] = useState(false)
  
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        setLoading(true)
        setIsUsingMockData(false)
        
        // Fetch from backend API (which uses Brapi.dev with cache)
        const response = await axios.get(`${API_URL}/api/assets/all`)
        
        const formattedStocks = response.data.map(stock => ({
          ticker: stock.symbol || stock.ticker,
          name: stock.name || stock.companyName || stock.ticker,
          type: stock.type === 'fund' || stock.ticker?.endsWith('11') ? 'FIIs' : 'Ações',
          price: stock.regularMarketPrice || stock.price || 0,
          change: stock.regularMarketChangePercent || stock.change || 0,
          marketCap: formatMarketCap(stock.marketCap || stock.market_cap),
          peRatio: stock.pe || stock.trailingPE,
          dividendYield: stock.dividendYield ? stock.dividendYield * 100 : (stock.fundsDividendYield || 0),
          risk: getRiskLevel(stock.pe || stock.trailingPE, stock.dividendYield || stock.fundsDividendYield),
          description: 'Dados em tempo real via Brapi.dev',
          pros: ['Preço atualizado', 'Dados reais de mercado'],
          cons: ['Free tier - limite de requests']
        }))

        setAssets(formattedStocks)
        setError(null)
      } catch (err) {
        console.error('API Error:', err.message)
        setError('Não foi possível carregar dados em tempo real. Verifique sua conexão.')
        // Dados mock para fallback quando API está offline
        setIsUsingMockData(true)
        const mockAssets = [
          { ticker: 'PETR4', name: 'Petróleo Brasileiro S.A.', type: 'Ações', price: 38.50, change: 1.2, marketCap: '500B', peRatio: 4.5, dividendYield: 8.5, risk: 'baixo', description: 'Dados simulados (offline)', pros: ['Alto dividend yield'], cons: ['Dados não atualizados'] },
          { ticker: 'VALE3', name: 'Vale S.A.', type: 'Ações', price: 68.90, change: -0.8, marketCap: '350B', peRatio: 5.2, dividendYield: 7.2, risk: 'baixo', description: 'Dados simulados (offline)', pros: ['Empresa sólida'], cons: ['Dados não atualizados'] },
          { ticker: 'ITUB4', name: 'Itaú Unibanco', type: 'Ações', price: 33.20, change: 0.5, marketCap: '320B', peRatio: 9.8, dividendYield: 5.5, risk: 'medio', description: 'Dados simulados (offline)', pros: ['Banco líder'], cons: ['Dados não atualizados'] },
          { ticker: 'BBAS3', name: 'Banco do Brasil', type: 'Ações', price: 55.40, change: -1.1, marketCap: '180B', peRatio: 7.5, dividendYield: 6.8, risk: 'medio', description: 'Dados simulados (offline)', pros: ['Bom valuation'], cons: ['Dados não atualizados'] },
          { ticker: 'WEGE3', name: 'WEG S.A.', type: 'Ações', price: 42.10, change: 2.3, marketCap: '280B', peRatio: 28.5, dividendYield: 1.8, risk: 'alto', description: 'Dados simulados (offline)', pros: ['Crescimento consistente'], cons: ['Dados não atualizados'] },
          { ticker: 'MXRF11', name: 'Maxi Renda', type: 'FIIs', price: 10.50, change: 0.2, marketCap: '5B', peRatio: null, dividendYield: 12.5, risk: 'baixo', description: 'Dados simulados (offline)', pros: ['High yield'], cons: ['Dados não atualizados'] },
        ]
        setAssets(mockAssets)
      } finally {
        setLoading(false)
      }
    }

    fetchAssets()
  }, [])

  const searchAsset = async (query) => {
    if (!query || query.length < 2) return []
    
    try {
      const response = await axios.get(`${API_URL}/api/search?q=${query}`)
      return response.data.results || []
    } catch (err) {
      console.error('Search error:', err.message)
      return []
    }
  }

  const getQuote = async (ticker) => {
    try {
      const response = await axios.get(`${API_URL}/api/quote/${ticker}`)
      return response.data
    } catch (err) {
      console.error('Quote error:', err.message)
      throw new Error('Não foi possível obter cotação')
    }
  }

  const analyzeInvestment = async (ticker, userProfile) => {
    try {
      const response = await axios.post(`${API_URL}/api/analyze`, {
        ticker,
        userProfile
      })
      return response.data
    } catch (err) {
      console.error('Analysis error:', err.message)
      throw new Error('Não foi possível analisar investimento')
    }
  }

  return { 
    assets, 
    loading, 
    error,
    isUsingMockData,
    searchAsset,
    getQuote,
    analyzeInvestment,
    searchQuery,
    setSearchQuery
  }
}

function formatMarketCap(value) {
  if (!value) return 'N/A'
  if (value >= 1e12) return `${(value / 1e12).toFixed(1)}T`
  if (value >= 1e9) return `${(value / 1e9).toFixed(0)}B`
  if (value >= 1e6) return `${(value / 1e6).toFixed(0)}M`
  return value.toString()
}

function getRiskLevel(peRatio, dividendYield) {
  if (!peRatio) return 'medio'
  if (peRatio < 10 && dividendYield > 0.05) return 'baixo'
  if (peRatio > 20 || dividendYield < 0.02) return 'alto'
  return 'medio'
}

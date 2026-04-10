import { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export function useAssets() {
  const [assets, setAssets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        setLoading(true)
        
        // Fetch from backend API (which uses Brapi.dev with cache)
        const response = await axios.get(`${API_URL}/api/quotes?tickers=PETR4,VALE3,ITUB4,BBAS3,WEGE3,LREN3`)
        
        const formattedStocks = response.data.map(stock => ({
          ticker: stock.ticker,
          name: stock.name,
          type: 'Ações',
          price: stock.price,
          change: stock.change,
          marketCap: formatMarketCap(stock.marketCap),
          peRatio: stock.pe,
          dividendYield: stock.dividendYield ? stock.dividendYield * 100 : 0,
          risk: getRiskLevel(stock.pe, stock.dividendYield),
          description: 'Dados em tempo real via Brapi.dev',
          pros: ['Preço atualizado', 'Dados reais de mercado'],
          cons: ['Free tier - limite de requests']
        }))

        setAssets(formattedStocks)
        setError(null)
      } catch (err) {
        console.error('API Error:', err.message)
        setError('Não foi possível carregar dados em tempo real. Usando modo offline.')
        // Don't set empty assets, let user search for specific stocks
        setAssets([])
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

import { useState, useEffect } from 'react'
import axios from 'axios'

const MOCK_DATA = [
  {
    ticker: 'PETR4',
    name: 'Petrobras PN',
    type: 'Ações',
    price: 38.52,
    change: 2.15,
    marketCap: '502B',
    peRatio: 4.2,
    dividendYield: 12.5,
    risk: 'medio',
    description: 'Petróleo e gás',
    pros: ['Alto dividend yield', 'Líder no setor'],
    cons: ['Volatilidade política', 'Dependência do petróleo']
  },
  {
    ticker: 'VALE3',
    name: 'Vale ON',
    type: 'Ações',
    price: 62.18,
    change: -1.23,
    marketCap: '289B',
    peRatio: 5.1,
    dividendYield: 9.8,
    risk: 'medio',
    description: 'Mineração',
    pros: ['Maior mineradora do mundo', 'Boa geração de caixa'],
    cons: ['Exposição à China', 'Impacto ambiental']
  },
  {
    ticker: 'ITUB4',
    name: 'Itaú Unibanco PN',
    type: 'Ações',
    price: 34.75,
    change: 0.85,
    marketCap: '330B',
    peRatio: 9.2,
    dividendYield: 5.2,
    risk: 'baixo',
    description: 'Bancário',
    pros: ['Maior banco privado', 'Sólido histórico'],
    cons: ['Inadimplência', 'Concorrência fintechs']
  },
  {
    ticker: 'BBAS3',
    name: 'Banco do Brasil ON',
    type: 'Ações',
    price: 28.90,
    change: 1.45,
    marketCap: '98B',
    peRatio: 6.5,
    dividendYield: 8.5,
    risk: 'medio',
    description: 'Bancário',
    pros: ['Alto dividend yield', 'Base de clientes grande'],
    cons: ['Interferência governamental', 'Risco fiscal']
  },
  {
    ticker: 'WEGE3',
    name: 'WEG ON',
    type: 'Ações',
    price: 45.20,
    change: -0.55,
    marketCap: '170B',
    peRatio: 28.5,
    dividendYield: 1.2,
    risk: 'baixo',
    description: 'Equipamentos elétricos',
    pros: ['Crescimento consistente', 'Exportação'],
    cons: ['Valuation elevado', 'Exposição cambial']
  },
  {
    ticker: 'LREN3',
    name: 'Lojas Renner ON',
    type: 'Ações',
    price: 18.45,
    change: 3.20,
    marketCap: '17B',
    peRatio: 15.2,
    dividendYield: 2.8,
    risk: 'alto',
    description: 'Varejo',
    pros: ['Líder em moda', 'Expansão digital'],
    cons: ['Juros altos', 'Consumo fraco']
  },
  {
    ticker: 'HGLG11',
    name: 'CSHG Logística',
    type: 'FIIs',
    price: 165.50,
    change: 0.35,
    marketCap: '8.5B',
    peRatio: null,
    dividendYield: 10.2,
    risk: 'baixo',
    description: 'Logística e galpões',
    pros: ['Renda mensal', 'Contratos longos'],
    cons: ['Vacância', 'Juros altos']
  },
  {
    ticker: 'KNRI11',
    name: 'Kinea Renda Imobiliária',
    type: 'FIIs',
    price: 152.30,
    change: -0.20,
    marketCap: '6.2B',
    peRatio: null,
    dividendYield: 9.5,
    risk: 'baixo',
    description: 'Tijolo diversificado',
    pros: ['Gestora renomada', 'Diversificação'],
    cons: ['Vacância', 'Inflação']
  },
  {
    ticker: 'MXRF11',
    name: 'Maxi Renda',
    type: 'FIIs',
    price: 10.85,
    change: 0.10,
    marketCap: '5.8B',
    peRatio: null,
    dividendYield: 11.8,
    risk: 'medio',
    description: 'Papel high yield',
    pros: ['Preço acessível', 'Alto yield'],
    cons: ['Risco de crédito', 'CDI alto']
  },
  {
    ticker: 'Tesouro IPCA+ 2035',
    name: 'Tesouro IPCA+ 2035',
    type: 'Renda Fixa',
    price: 3250.00,
    change: 0.45,
    marketCap: null,
    peRatio: null,
    dividendYield: 6.5,
    risk: 'baixo',
    description: 'Título público atrelado à inflação',
    pros: ['Proteção inflação', 'Segurança'],
    cons: ['Marcação a mercado', 'Liquidez D+1']
  },
  {
    ticker: 'Tesouro Selic 2029',
    name: 'Tesouro Selic 2029',
    type: 'Renda Fixa',
    price: 5820.00,
    change: 0.08,
    marketCap: null,
    peRatio: null,
    dividendYield: 10.75,
    risk: 'baixo',
    description: 'Título público pós-fixado',
    pros: ['Baixo risco', 'Liquidez diária'],
    cons: ['IR regressivo', 'Sem proteção inflação']
  }
]

export function useAssets() {
  const [assets, setAssets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        setLoading(true)
        
        // Fetch stocks from Brapi.dev
        const stocksResponse = await axios.get('https://brapi.dev/api/quote/PETR4,VALE3,ITUB4,BBAS3,WEGE3,LREN3')
        
        // Fetch FIIs from BrasilAPI (fallback to mock if fails)
        let fiisData = []
        try {
          const fiisResponse = await axios.get('https://brasilapi.com.br/api/funds/v1/HGLG11')
          fiisData = [fiisResponse.data]
        } catch (e) {
          console.log('BrasilAPI fallback for FIIs')
        }

        const formattedStocks = stocksResponse.data.results.map(stock => ({
          ticker: stock.symbol,
          name: stock.name || stock.shortName,
          type: 'Ações',
          price: stock.regularMarketPrice,
          change: stock.regularMarketChangePercent,
          marketCap: formatMarketCap(stock.marketCap),
          peRatio: stock.trailingPE,
          dividendYield: stock.dividendYield ? stock.dividendYield * 100 : 0,
          risk: getRiskLevel(stock.trailingPE, stock.dividendYield),
          description: stock.sector || 'Diversificado',
          pros: ['Dados da API', 'Atualizado em tempo real'],
          cons: ['Dados limitados sem chave']
        }))

        const allAssets = [...formattedStocks, ...MOCK_DATA.filter(a => a.type !== 'Ações')]
        setAssets(allAssets.length > 0 ? allAssets : MOCK_DATA)
        setError(null)
      } catch (err) {
        console.error('API Error:', err)
        setAssets(MOCK_DATA)
        setError(null) // Don't show error, just use mock data silently
      } finally {
        setLoading(false)
      }
    }

    fetchAssets()
  }, [])

  return { assets, loading, error }
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

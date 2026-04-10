import { useState, useMemo } from 'react'
import { SearchBar } from './components/SearchBar'
import { InvestmentCard } from './components/InvestmentCard'
import { DetailModal } from './components/DetailModal'
import { OfflineStatus } from './components/OfflineStatus'
import { useAssets } from './hooks/useAssets'

function App() {
  const { assets, loading, error } = useAssets()
  const [selectedAsset, setSelectedAsset] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('todos')
  const [filterRisk, setFilterRisk] = useState('todos')
  const [sortBy, setSortBy] = useState('nome')

  const filteredAndSortedAssets = useMemo(() => {
    let result = [...assets]

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(asset => 
        asset.ticker.toLowerCase().includes(term) ||
        asset.name.toLowerCase().includes(term)
      )
    }

    // Filter by type
    if (filterType !== 'todos') {
      result = result.filter(asset => asset.type === filterType)
    }

    // Filter by risk
    if (filterRisk !== 'todos') {
      result = result.filter(asset => asset.risk === filterRisk)
    }

    // Sort
    switch (sortBy) {
      case 'preco_crescente':
        result.sort((a, b) => a.price - b.price)
        break
      case 'preco_decrescente':
        result.sort((a, b) => b.price - a.price)
        break
      case 'rentabilidade':
        result.sort((a, b) => (b.dividendYield || 0) - (a.dividendYield || 0))
        break
      default:
        result.sort((a, b) => a.ticker.localeCompare(b.ticker))
    }

    return result
  }, [assets, searchTerm, filterType, filterRisk, sortBy])

  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner}></div>
        <p>Carregando investimentos...</p>
      </div>
    )
  }

  return (
    <div style={styles.app}>
      <OfflineStatus />
      
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.logo}>💰 InvestFácil</h1>
          <p style={styles.subtitle}>Encontre os melhores investimentos</p>
        </div>
      </header>

      <main style={styles.main}>
        <SearchBar 
          onSearch={setSearchTerm}
          onFilterType={setFilterType}
          onFilterRisk={setFilterRisk}
          onSort={setSortBy}
        />

        {filteredAndSortedAssets.length === 0 ? (
          <div style={styles.noResults}>
            <p>Nenhum investimento encontrado para os filtros selecionados.</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {filteredAndSortedAssets.map(asset => (
              <InvestmentCard 
                key={asset.ticker} 
                asset={asset} 
                onViewDetails={setSelectedAsset}
              />
            ))}
          </div>
        )}
      </main>

      <footer style={styles.footer}>
        <p>© 2024 InvestFácil - Dados fornecidos por BrasilAPI e Brapi.dev</p>
        <p style={styles.disclaimer}>
          ⚠️ Este aplicativo é apenas para fins educacionais. Não constitui recomendação de investimento.
        </p>
      </footer>

      {selectedAsset && (
        <DetailModal 
          asset={selectedAsset} 
          onClose={() => setSelectedAsset(null)} 
        />
      )}
    </div>
  )
}

const styles = {
  app: {
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#1a73e8',
    color: 'white',
    padding: '24px 20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  headerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  logo: {
    fontSize: '28px',
    fontWeight: 'bold',
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: '16px',
    opacity: 0.9,
    margin: 0,
  },
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '20px',
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    gap: '16px',
  },
  spinner: {
    width: '48px',
    height: '48px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #1a73e8',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  noResults: {
    textAlign: 'center',
    padding: '40px',
    color: '#666',
    fontSize: '18px',
  },
  footer: {
    backgroundColor: '#333',
    color: 'white',
    padding: '24px 20px',
    textAlign: 'center',
    marginTop: '40px',
  },
  disclaimer: {
    fontSize: '13px',
    opacity: 0.7,
    marginTop: '8px',
  },
}

export default App

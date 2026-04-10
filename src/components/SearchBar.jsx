import { useState } from 'react'

export function SearchBar({ onSearch, onFilterType, onFilterRisk, onSort }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('todos')
  const [selectedRisk, setSelectedRisk] = useState('todos')
  const [sortBy, setSortBy] = useState('nome')

  const handleSearch = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    onSearch(value)
  }

  const handleTypeChange = (e) => {
    const value = e.target.value
    setSelectedType(value)
    onFilterType(value)
  }

  const handleRiskChange = (e) => {
    const value = e.target.value
    setSelectedRisk(value)
    onFilterRisk(value)
  }

  const handleSortChange = (e) => {
    const value = e.target.value
    setSortBy(value)
    onSort(value)
  }

  return (
    <div style={styles.container}>
      <input
        type="text"
        placeholder="🔍 Buscar por ticker ou nome..."
        value={searchTerm}
        onChange={handleSearch}
        style={styles.searchInput}
      />
      
      <div style={styles.filters}>
        <select value={selectedType} onChange={handleTypeChange} style={styles.select}>
          <option value="todos">Todos os Tipos</option>
          <option value="Ações">Ações</option>
          <option value="FIIs">FIIs</option>
          <option value="Renda Fixa">Renda Fixa</option>
        </select>

        <select value={selectedRisk} onChange={handleRiskChange} style={styles.select}>
          <option value="todos">Todos os Riscos</option>
          <option value="baixo">Baixo</option>
          <option value="medio">Médio</option>
          <option value="alto">Alto</option>
        </select>

        <select value={sortBy} onChange={handleSortChange} style={styles.select}>
          <option value="nome">Ordenar por Nome</option>
          <option value="preco_crescente">Preço: Menor para Maior</option>
          <option value="preco_decrescente">Preço: Maior para Menor</option>
          <option value="rentabilidade">Maior Rentabilidade</option>
        </select>
      </div>
    </div>
  )
}

const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  searchInput: {
    width: '100%',
    padding: '12px 16px',
    fontSize: '16px',
    border: '2px solid #ddd',
    borderRadius: '8px',
    marginBottom: '12px',
    outline: 'none',
  },
  filters: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  select: {
    padding: '10px 14px',
    fontSize: '14px',
    border: '2px solid #ddd',
    borderRadius: '8px',
    backgroundColor: 'white',
    cursor: 'pointer',
    flex: '1',
    minWidth: '150px',
  }
}

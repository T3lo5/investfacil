import { useState } from 'react'

export function InvestmentCard({ asset, onViewDetails }) {
  const riskColors = {
    baixo: '#4caf50',
    medio: '#ff9800',
    alto: '#f44336'
  }

  const riskLabels = {
    baixo: 'Baixo',
    medio: 'Médio',
    alto: 'Alto'
  }

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div>
          <h3 style={styles.ticker}>{asset.ticker}</h3>
          <p style={styles.name}>{asset.name}</p>
        </div>
        <span 
          style={{
            ...styles.riskBadge,
            backgroundColor: riskColors[asset.risk]
          }}
        >
          {riskLabels[asset.risk]}
        </span>
      </div>

      <div style={styles.priceSection}>
        <span style={styles.price}>R$ {asset.price?.toFixed(2)}</span>
        <span style={{
          ...styles.change,
          color: asset.change >= 0 ? '#4caf50' : '#f44336'
        }}>
          {asset.change >= 0 ? '+' : ''}{asset.change?.toFixed(2)}%
        </span>
      </div>

      <div style={styles.metrics}>
        {asset.dividendYield && (
          <div style={styles.metric}>
            <span style={styles.metricLabel}>Div Yield</span>
            <span style={styles.metricValue}>{asset.dividendYield.toFixed(2)}%</span>
          </div>
        )}
        {asset.peRatio && (
          <div style={styles.metric}>
            <span style={styles.metricLabel}>P/L</span>
            <span style={styles.metricValue}>{asset.peRatio.toFixed(1)}</span>
          </div>
        )}
        {asset.marketCap && (
          <div style={styles.metric}>
            <span style={styles.metricLabel}>Market Cap</span>
            <span style={styles.metricValue}>{asset.marketCap}</span>
          </div>
        )}
      </div>

      <p style={styles.description}>{asset.description}</p>

      <button 
        onClick={() => onViewDetails(asset)}
        style={styles.button}
      >
        Ver detalhes
      </button>
    </div>
  )
}

const styles = {
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
  },
  ticker: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#1a73e8',
    margin: '0 0 4px 0',
  },
  name: {
    fontSize: '14px',
    color: '#666',
    margin: 0,
  },
  riskBadge: {
    padding: '4px 12px',
    borderRadius: '16px',
    fontSize: '12px',
    fontWeight: 'bold',
    color: 'white',
    textTransform: 'uppercase',
  },
  priceSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  price: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
  },
  change: {
    fontSize: '16px',
    fontWeight: 'bold',
  },
  metrics: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
    marginBottom: '16px',
    padding: '12px 0',
    borderTop: '1px solid #eee',
    borderBottom: '1px solid #eee',
  },
  metric: {
    textAlign: 'center',
  },
  metricLabel: {
    display: 'block',
    fontSize: '12px',
    color: '#666',
    marginBottom: '4px',
  },
  metricValue: {
    display: 'block',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#333',
  },
  description: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '16px',
    lineHeight: '1.4',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#1a73e8',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  }
}

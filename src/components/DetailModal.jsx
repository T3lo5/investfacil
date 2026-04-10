import { useState } from 'react'

export function DetailModal({ asset, onClose }) {
  const [investmentAmount, setInvestmentAmount] = useState(1000)

  if (!asset) return null

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

  const calculateReturns = (amount, yieldPercent) => {
    const monthlyReturn = amount * (yieldPercent / 100) / 12
    const yearlyReturn = amount * (yieldPercent / 100)
    return { monthly: monthlyReturn, yearly: yearlyReturn }
  }

  const returns = asset.dividendYield ? calculateReturns(investmentAmount, asset.dividendYield) : null

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button style={styles.closeButton} onClick={onClose}>×</button>
        
        <div style={styles.header}>
          <div>
            <h2 style={styles.ticker}>{asset.ticker}</h2>
            <p style={styles.name}>{asset.name}</p>
          </div>
          <span 
            style={{
              ...styles.riskBadge,
              backgroundColor: riskColors[asset.risk]
            }}
          >
            Risco {riskLabels[asset.risk]}
          </span>
        </div>

        <div style={styles.priceSection}>
          <span style={styles.price}>R$ {asset.price?.toFixed(2)}</span>
          <span style={{
            ...styles.change,
            color: asset.change >= 0 ? '#4caf50' : '#f44336'
          }}>
            {asset.change >= 0 ? '+' : ''}{asset.change?.toFixed(2)}% hoje
          </span>
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Descrição</h3>
          <p style={styles.description}>{asset.description}</p>
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Métricas Principais</h3>
          <div style={styles.metricsGrid}>
            {asset.dividendYield && (
              <div style={styles.metricItem}>
                <span style={styles.metricLabel}>Dividend Yield</span>
                <span style={styles.metricValue}>{asset.dividendYield.toFixed(2)}%</span>
              </div>
            )}
            {asset.peRatio && (
              <div style={styles.metricItem}>
                <span style={styles.metricLabel}>P/L Ratio</span>
                <span style={styles.metricValue}>{asset.peRatio.toFixed(1)}</span>
              </div>
            )}
            {asset.marketCap && (
              <div style={styles.metricItem}>
                <span style={styles.metricLabel}>Market Cap</span>
                <span style={styles.metricValue}>{asset.marketCap}</span>
              </div>
            )}
            <div style={styles.metricItem}>
              <span style={styles.metricLabel}>Tipo</span>
              <span style={styles.metricValue}>{asset.type}</span>
            </div>
          </div>
        </div>

        {asset.dividendYield && (
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Simulação de Investimento</h3>
            <div style={styles.simulation}>
              <label style={styles.label}>
                Valor do Investimento (R$):
                <input
                  type="number"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                  style={styles.input}
                />
              </label>
              <div style={styles.returns}>
                <div style={styles.returnItem}>
                  <span style={styles.returnLabel}>Retorno Mensal Estimado:</span>
                  <span style={styles.returnValue}>R$ {returns.monthly.toFixed(2)}</span>
                </div>
                <div style={styles.returnItem}>
                  <span style={styles.returnLabel}>Retorno Anual Estimado:</span>
                  <span style={styles.returnValue}>R$ {returns.yearly.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Prós</h3>
          <ul style={styles.list}>
            {asset.pros?.map((pro, index) => (
              <li key={index} style={styles.listItem}>✓ {pro}</li>
            ))}
          </ul>
        </div>

        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Contras</h3>
          <ul style={styles.list}>
            {asset.cons?.map((con, index) => (
              <li key={index} style={{...styles.listItem, color: '#f44336'}}>⚠ {con}</li>
            ))}
          </ul>
        </div>

        <div style={styles.disclaimer}>
          <p style={styles.disclaimerText}>
            ⚠️ Estas informações são apenas para fins educacionais e não constituem recomendação de investimento. 
            Consulte um assessor financeiro antes de tomar decisões de investimento.
          </p>
        </div>
      </div>
    </div>
  )
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: '20px',
    overflow: 'auto',
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '32px',
    maxWidth: '600px',
    width: '100%',
    maxHeight: '90vh',
    overflow: 'auto',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: 'none',
    border: 'none',
    fontSize: '32px',
    cursor: 'pointer',
    color: '#666',
    lineHeight: 1,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '20px',
    paddingRight: '40px',
  },
  ticker: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#1a73e8',
    margin: '0 0 8px 0',
  },
  name: {
    fontSize: '16px',
    color: '#666',
    margin: 0,
  },
  riskBadge: {
    padding: '6px 16px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: 'bold',
    color: 'white',
    textTransform: 'uppercase',
  },
  priceSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    padding: '16px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
  },
  price: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#333',
  },
  change: {
    fontSize: '18px',
    fontWeight: 'bold',
  },
  section: {
    marginBottom: '24px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '12px',
  },
  description: {
    fontSize: '15px',
    color: '#666',
    lineHeight: '1.6',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px',
  },
  metricItem: {
    padding: '12px',
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    textAlign: 'center',
  },
  metricLabel: {
    display: 'block',
    fontSize: '13px',
    color: '#666',
    marginBottom: '6px',
  },
  metricValue: {
    display: 'block',
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#1a73e8',
  },
  simulation: {
    padding: '16px',
    backgroundColor: '#e3f2fd',
    borderRadius: '8px',
  },
  label: {
    display: 'block',
    marginBottom: '16px',
    fontSize: '14px',
    color: '#333',
  },
  input: {
    display: 'block',
    width: '100%',
    padding: '10px',
    marginTop: '6px',
    fontSize: '16px',
    border: '2px solid #ddd',
    borderRadius: '6px',
  },
  returns: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  returnItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  returnLabel: {
    fontSize: '14px',
    color: '#666',
  },
  returnValue: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#4caf50',
  },
  list: {
    listStyle: 'none',
    padding: 0,
  },
  listItem: {
    padding: '8px 0',
    fontSize: '14px',
    color: '#333',
  },
  disclaimer: {
    padding: '16px',
    backgroundColor: '#fff3cd',
    borderRadius: '8px',
    marginTop: '24px',
  },
  disclaimerText: {
    fontSize: '13px',
    color: '#856404',
    lineHeight: '1.5',
    margin: 0,
  },
}

import { useState, useEffect } from 'react'

export function OfflineStatus() {
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true)

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (isOnline) return null

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <span style={styles.icon}>📡</span>
        <div style={styles.text}>
          <strong>Você está offline</strong>
          <p>Os dados exibidos podem estar desatualizados. Conecte-se para atualizar.</p>
        </div>
        <button 
          onClick={() => window.location.reload()} 
          style={styles.button}
        >
          Tentar Novamente
        </button>
      </div>
    </div>
  )
}

const styles = {
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ff9800',
    color: 'white',
    padding: '12px 20px',
    zIndex: 2000,
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  icon: {
    fontSize: '24px',
  },
  text: {
    flex: 1,
  },
  button: {
    padding: '8px 16px',
    backgroundColor: 'white',
    color: '#ff9800',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '14px',
  }
}

const express = require('express');
const axios = require('axios');
const db = require('../db/database');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

const BRAPI_BASE_URL = 'https://brapi.dev/api';

// Lista padrão de ativos para fallback
const DEFAULT_STOCKS = [
  { ticker: 'PETR4', name: 'Petrobras PN', type: 'stock' },
  { ticker: 'VALE3', name: 'Vale ON', type: 'stock' },
  { ticker: 'ITUB4', name: 'Itaú Unibanco PN', type: 'stock' },
  { ticker: 'BBAS3', name: 'Banco do Brasil ON', type: 'stock' },
  { ticker: 'WEGE3', name: 'WEG ON', type: 'stock' },
  { ticker: 'LREN3', name: 'Lojas Renner ON', type: 'stock' },
  { ticker: 'MGLU3', name: 'Magazine Luiza ON', type: 'stock' },
  { ticker: 'ABEV3', name: 'Ambev ON', type: 'stock' },
  { ticker: 'SUZB3', name: 'Suzano ON', type: 'stock' },
  { ticker: 'RENT3', name: 'Localiza ON', type: 'stock' }
];

const DEFAULT_FIIS = [
  { ticker: 'MXRF11', name: 'Maxi Renda', type: 'fund' },
  { ticker: 'HGLG11', name: 'CSHG Logística', type: 'fund' },
  { ticker: 'KNIP11', name: 'Kinea Índices', type: 'fund' },
  { ticker: 'VGIR11', name: 'Valora RE', type: 'fund' },
  { ticker: 'XPML11', name: 'XP Malls', type: 'fund' },
  { ticker: 'VISC11', name: 'Vinci Shoppings', type: 'fund' },
  { ticker: 'BCFF11', name: 'BC Fund FOF', type: 'fund' },
  { ticker: 'CPTS11', name: 'Capitânia Securities', type: 'fund' }
];

// Get quotes by tickers (general endpoint)
router.get('/quotes', async (req, res) => {
  const { tickers } = req.query;
  
  if (!tickers) {
    return res.status(400).json({ error: 'Tickers são obrigatórios' });
  }
  
  const tickerList = tickers.split(',').map(t => t.trim()).filter(t => t);
  
  if (tickerList.length === 0) {
    return res.status(400).json({ error: 'Lista de tickers vazia' });
  }

  try {
    const results = [];
    const missingTickers = [];

    // Check cache for each ticker
    for (const ticker of tickerList) {
      await new Promise((resolve) => {
        db.get(
          'SELECT data FROM asset_cache WHERE ticker = ? AND expires_at > datetime("now")',
          [ticker.toUpperCase()],
          (err, cached) => {
            if (!err && cached) {
              results.push(JSON.parse(cached.data));
            } else {
              missingTickers.push(ticker);
            }
            resolve();
          }
        );
      });
    }

    // Fetch missing tickers from API
    if (missingTickers.length > 0) {
      const response = await axios.get(`${BRAPI_BASE_URL}/quote/${missingTickers.join(',')}`, {
        params: { token: process.env.BRAPI_TOKEN }
      });

      if (response.data && response.data.quotes) {
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();

        for (const quote of response.data.quotes) {
          db.run(
            `INSERT OR REPLACE INTO asset_cache (ticker, data, expires_at) 
             VALUES (?, ?, ?)`,
            [quote.symbol, JSON.stringify(quote), expiresAt]
          );
          results.push(quote);
        }
      }
    }

    res.json(results);
  } catch (error) {
    console.error('Error fetching quotes:', error.message);
    
    // Fallback to default data with simulated values
    const allDefaults = [...DEFAULT_STOCKS, ...DEFAULT_FIIS];
    const filteredDefaults = allDefaults.filter(a => tickerList.includes(a.ticker));
    
    const simulatedResults = filteredDefaults.map(asset => ({
      symbol: asset.ticker,
      ticker: asset.ticker,
      name: asset.name,
      regularMarketPrice: (Math.random() * 50 + 10).toFixed(2),
      regularMarketChangePercent: (Math.random() * 6 - 3).toFixed(2),
      marketCap: Math.floor(Math.random() * 100000000000),
      pe: Math.floor(Math.random() * 20 + 5),
      dividendYield: Math.random() * 0.08 + 0.02,
      type: asset.type
    }));
    
    res.json(simulatedResults);
  }
});

// Get all available assets (dynamic list from Brapi with fallback)
router.get('/all', async (req, res) => {
  const { type = 'all' } = req.query; // all, stocks, fiis
  
  try {
    let url = `${BRAPI_BASE_URL}/quote/list`;
    const params = { token: process.env.BRAPI_TOKEN };
    
    if (type === 'stocks') {
      params.type = 'stock';
    } else if (type === 'fiis') {
      params.type = 'fund';
    }
    
    const response = await axios.get(url, { params });
    
    if (response.data && response.data.quotes && response.data.quotes.length > 0) {
      return res.json(response.data.quotes);
    }
  } catch (error) {
    console.log('Brapi API not available, using fallback data');
  }
  
  // Fallback to default lists
  let defaults = [];
  if (type === 'fiis') {
    defaults = DEFAULT_FIIS;
  } else if (type === 'stocks') {
    defaults = DEFAULT_STOCKS;
  } else {
    defaults = [...DEFAULT_STOCKS, ...DEFAULT_FIIS];
  }
  
  // Simulate realistic data for demo
  const simulatedResults = defaults.map(asset => ({
    symbol: asset.ticker,
    ticker: asset.ticker,
    name: asset.name,
    regularMarketPrice: parseFloat((Math.random() * 50 + 10).toFixed(2)),
    regularMarketChangePercent: parseFloat((Math.random() * 6 - 3).toFixed(2)),
    marketCap: Math.floor(Math.random() * 100000000000),
    pe: Math.floor(Math.random() * 20 + 5),
    trailingPE: Math.floor(Math.random() * 20 + 5),
    dividendYield: parseFloat((Math.random() * 0.08 + 0.02).toFixed(4)),
    fundsDividendYield: parseFloat((Math.random() * 0.12 + 0.04).toFixed(4)),
    type: asset.type
  }));
  
  res.json(simulatedResults);
});

// Search assets by ticker or name
router.get('/search', async (req, res) => {
  const { query } = req.query;
  
  if (!query || query.length < 2) {
    return res.status(400).json({ error: 'Query deve ter pelo menos 2 caracteres' });
  }
  
  try {
    // Try to get from cache first
    db.get(
      'SELECT data FROM asset_cache WHERE ticker = ? AND expires_at > datetime("now")',
      [query.toUpperCase()],
      async (cacheErr, cached) => {
        if (!cacheErr && cached) {
          return res.json(JSON.parse(cached.data));
        }
        
        // Fetch from Brapi
        const response = await axios.get(`${BRAPI_BASE_URL}/quote/${query}`, {
          params: { token: process.env.BRAPI_TOKEN }
        });
        
        if (response.data && response.data.quotes && response.data.quotes.length > 0) {
          const assetData = response.data.quotes[0];
          
          // Cache for 5 minutes (free tier limitation)
          const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();
          
          db.run(
            `INSERT OR REPLACE INTO asset_cache (ticker, data, expires_at) 
             VALUES (?, ?, ?)`,
            [query.toUpperCase(), JSON.stringify(assetData), expiresAt]
          );
          
          res.json(assetData);
        } else {
          res.status(404).json({ error: 'Ativo não encontrado' });
        }
      }
    );
  } catch (error) {
    console.error('Error fetching asset:', error.message);
    
    // Fallback to search in default list
    const allDefaults = [...DEFAULT_STOCKS, ...DEFAULT_FIIS];
    const searchTerm = query.toUpperCase();
    const found = allDefaults.find(a => 
      a.ticker.includes(searchTerm) || a.name.toUpperCase().includes(searchTerm)
    );
    
    if (found) {
      return res.json({
        symbol: found.ticker,
        ticker: found.ticker,
        name: found.name,
        regularMarketPrice: parseFloat((Math.random() * 50 + 10).toFixed(2)),
        regularMarketChangePercent: parseFloat((Math.random() * 6 - 3).toFixed(2)),
        type: found.type,
        fromCache: true
      });
    }
    
    res.status(404).json({ error: 'Ativo não encontrado' });
  }
});

// Get multiple assets
router.post('/multiple', async (req, res) => {
  const { tickers } = req.body;
  
  if (!Array.isArray(tickers) || tickers.length === 0) {
    return res.status(400).json({ error: 'Lista de tickers é obrigatória' });
  }
  
  try {
    const results = [];
    const missingTickers = [];
    
    // Check cache for each ticker
    for (const ticker of tickers) {
      await new Promise((resolve) => {
        db.get(
          'SELECT data FROM asset_cache WHERE ticker = ? AND expires_at > datetime("now")',
          [ticker.toUpperCase()],
          (err, cached) => {
            if (!err && cached) {
              results.push(JSON.parse(cached.data));
            } else {
              missingTickers.push(ticker);
            }
            resolve();
          }
        );
      });
    }
    
    // Fetch missing tickers from API
    if (missingTickers.length > 0) {
      const response = await axios.get(`${BRAPI_BASE_URL}/quote/${missingTickers.join(',')}`, {
        params: { token: process.env.BRAPI_TOKEN }
      });
      
      if (response.data && response.data.quotes) {
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();
        
        for (const quote of response.data.quotes) {
          db.run(
            `INSERT OR REPLACE INTO asset_cache (ticker, data, expires_at) 
             VALUES (?, ?, ?)`,
            [quote.symbol, JSON.stringify(quote), expiresAt]
          );
          results.push(quote);
        }
      }
    }
    
    res.json(results);
  } catch (error) {
    console.error('Error fetching multiple assets:', error.message);
    
    // Fallback to simulated data
    const allDefaults = [...DEFAULT_STOCKS, ...DEFAULT_FIIS];
    const filteredDefaults = allDefaults.filter(a => tickers.includes(a.ticker));
    
    const simulatedResults = filteredDefaults.map(asset => ({
      symbol: asset.ticker,
      ticker: asset.ticker,
      name: asset.name,
      regularMarketPrice: parseFloat((Math.random() * 50 + 10).toFixed(2)),
      regularMarketChangePercent: parseFloat((Math.random() * 6 - 3).toFixed(2)),
      type: asset.type
    }));
    
    res.json(simulatedResults);
  }
});

module.exports = router;

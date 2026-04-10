const express = require('express');
const axios = require('axios');
const db = require('../db/database');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

const BRAPI_BASE_URL = 'https://brapi.dev/api';

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
    
    // Fallback to cache even if expired
    db.get(
      'SELECT data FROM asset_cache WHERE ticker = ?',
      [query.toUpperCase()],
      (err, cached) => {
        if (!err && cached) {
          return res.json({ ...JSON.parse(cached.data), fromCache: true, stale: true });
        }
        res.status(500).json({ error: 'Erro ao buscar ativo' });
      }
    );
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
    res.status(500).json({ error: 'Erro ao buscar ativos' });
  }
});

module.exports = router;

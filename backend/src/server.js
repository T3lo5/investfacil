import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import NodeCache from 'node-cache';
import { initDB, saveAnalysis, getAnalyses, getUserProfile, saveUserProfile } from './database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const BRAPI_KEY = process.env.VITE_BRAPI_KEY;

// Cache configuration
const cache = new NodeCache({ 
  stdTTL: 300, // 5 minutes for general data
  checkperiod: 60 
});

// Special cache for stock prices (shorter TTL for real-time accuracy)
const priceCache = new NodeCache({ 
  stdTTL: 60, // 1 minute for prices
  checkperiod: 30 
});

app.use(cors());
app.use(express.json());

// Initialize database
initDB();

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get stock quote from Brapi.dev
app.get('/api/quote/:ticker', async (req, res) => {
  const { ticker } = req.params;
  const cacheKey = `quote_${ticker}`;
  
  // Check cache first
  const cached = priceCache.get(cacheKey);
  if (cached) {
    return res.json({ ...cached, fromCache: true });
  }
  
  try {
    const response = await axios.get(
      `https://brapi.dev/api/quote/${ticker}?token=${BRAPI_KEY}`
    );
    
    const data = response.data;
    if (!data.results || data.results.length === 0) {
      return res.status(404).json({ error: 'Ticker not found' });
    }
    
    const quote = data.results[0];
    const result = {
      ticker: quote.symbol,
      name: quote.name,
      price: quote.regularMarketPrice,
      change: quote.regularMarketChangePercent,
      high: quote.regularMarketDayHigh,
      low: quote.regularMarketDayLow,
      open: quote.regularMarketOpen,
      previousClose: quote.regularMarketPreviousClose,
      volume: quote.regularMarketVolume,
      marketCap: quote.marketCap,
      pe: quote.trailingPE,
      pb: quote.priceToBook,
      dividendYield: quote.dividendYield,
      eps: quote.eps,
      beta: quote.beta,
      fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh,
      fiftyTwoWeekLow: quote.fiftyTwoWeekLow,
      timestamp: new Date().toISOString(),
      fromCache: false
    };
    
    // Cache the result
    priceCache.set(cacheKey, result);
    
    res.json(result);
  } catch (error) {
    console.error('Error fetching quote:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch quote', 
      message: error.message 
    });
  }
});

// Get multiple quotes
app.get('/api/quotes', async (req, res) => {
  const { tickers } = req.query;
  if (!tickers) {
    return res.status(400).json({ error: 'Tickers parameter required' });
  }
  
  const tickerList = tickers.split(',').map(t => t.trim());
  const results = [];
  
  for (const ticker of tickerList) {
    const cacheKey = `quote_${ticker}`;
    const cached = priceCache.get(cacheKey);
    
    if (cached) {
      results.push({ ...cached, fromCache: true });
    } else {
      try {
        const response = await axios.get(
          `https://brapi.dev/api/quote/${ticker}?token=${BRAPI_KEY}`
        );
        
        if (response.data.results && response.data.results.length > 0) {
          const quote = response.data.results[0];
          const result = {
            ticker: quote.symbol,
            name: quote.name,
            price: quote.regularMarketPrice,
            change: quote.regularMarketChangePercent,
            pe: quote.trailingPE,
            pb: quote.priceToBook,
            dividendYield: quote.dividendYield,
            marketCap: quote.marketCap,
            timestamp: new Date().toISOString(),
            fromCache: false
          };
          
          priceCache.set(cacheKey, result);
          results.push(result);
        }
      } catch (error) {
        console.error(`Error fetching ${ticker}:`, error.message);
        results.push({ ticker, error: error.message });
      }
    }
  }
  
  res.json(results);
});

// Analyze investment based on user profile
app.post('/api/analyze', async (req, res) => {
  const { ticker, userProfile } = req.body;
  
  if (!ticker || !userProfile) {
    return res.status(400).json({ error: 'Ticker and userProfile required' });
  }
  
  try {
    // Get fresh quote data
    const response = await axios.get(
      `https://brapi.dev/api/quote/${ticker}?token=${BRAPI_KEY}`
    );
    
    if (!response.data.results || response.data.results.length === 0) {
      return res.status(404).json({ error: 'Ticker not found' });
    }
    
    const quote = response.data.results[0];
    
    // Investment analysis algorithm
    const analysis = analyzeInvestment(quote, userProfile);
    
    // Save to database
    const savedAnalysis = await saveAnalysis({
      ticker: quote.symbol,
      userId: userProfile.userId || 'anonymous',
      analysis: analysis,
      quoteData: quote,
      userProfile
    });
    
    res.json({
      ...analysis,
      quote: {
        ticker: quote.symbol,
        name: quote.name,
        price: quote.regularMarketPrice,
        change: quote.regularMarketChangePercent
      },
      fromCache: false,
      analysisId: savedAnalysis.id
    });
  } catch (error) {
    console.error('Error analyzing investment:', error.message);
    res.status(500).json({ 
      error: 'Failed to analyze investment', 
      message: error.message 
    });
  }
});

// Investment Analysis Algorithm
function analyzeInvestment(quote, userProfile) {
  const {
    regularMarketPrice: price,
    trailingPE: pe,
    priceToBook: pb,
    dividendYield: dy,
    beta,
    eps,
    fiftyTwoWeekHigh,
    fiftyTwoWeekLow,
    marketCap
  } = quote;
  
  const {
    riskProfile, // 'conservative', 'moderate', 'aggressive'
    investmentGoal,
    timeHorizon, // years
    currentPortfolio,
    monthlyContribution
  } = userProfile;
  
  let score = 0;
  const factors = [];
  const recommendations = [];
  
  // Risk assessment based on beta
  let riskScore = 0;
  if (beta < 0.8) {
    riskScore = 1; // Low risk
    factors.push({ name: 'Baixa volatilidade', impact: 'positive', value: '+15pts' });
    score += 15;
  } else if (beta < 1.2) {
    riskScore = 2; // Moderate risk
    factors.push({ name: 'Volatilidade média', impact: 'neutral', value: '+10pts' });
    score += 10;
  } else if (beta < 1.5) {
    riskScore = 3; // High risk
    factors.push({ name: 'Alta volatilidade', impact: 'negative', value: '-5pts' });
    score -= 5;
  } else {
    riskScore = 4; // Very high risk
    factors.push({ name: 'Volatilidade muito alta', impact: 'negative', value: '-15pts' });
    score -= 15;
  }
  
  // Profile matching
  if (riskProfile === 'conservative' && riskScore <= 2) {
    factors.push({ name: 'Adequado ao perfil conservador', impact: 'positive', value: '+20pts' });
    score += 20;
  } else if (riskProfile === 'moderate' && riskScore <= 3) {
    factors.push({ name: 'Adequado ao perfil moderado', impact: 'positive', value: '+15pts' });
    score += 15;
  } else if (riskProfile === 'aggressive') {
    factors.push({ name: 'Perfil agressivo - busca retorno', impact: 'positive', value: '+10pts' });
    score += 10;
  } else if (riskProfile === 'conservative' && riskScore > 2) {
    factors.push({ name: 'Muito arriscado para perfil conservador', impact: 'negative', value: '-25pts' });
    score -= 25;
    recommendations.push('Considere ativos de menor risco');
  }
  
  // Valuation (P/E ratio)
  if (pe && pe > 0) {
    if (pe < 10) {
      factors.push({ name: 'P/L muito atrativo', impact: 'positive', value: '+20pts' });
      score += 20;
      recommendations.push('Ação pode estar subvalorizada');
    } else if (pe < 15) {
      factors.push({ name: 'P/L justo', impact: 'positive', value: '+10pts' });
      score += 10;
    } else if (pe < 25) {
      factors.push({ name: 'P/L elevado', impact: 'neutral', value: '0pts' });
    } else {
      factors.push({ name: 'P/L muito alto', impact: 'negative', value: '-15pts' });
      score -= 15;
      recommendations.push('Avalie se o crescimento justifica o preço');
    }
  }
  
  // Price to Book
  if (pb && pb > 0) {
    if (pb < 1.5) {
      factors.push({ name: 'P/VP atrativo', impact: 'positive', value: '+15pts' });
      score += 15;
    } else if (pb < 3) {
      factors.push({ name: 'P/VP razoável', impact: 'neutral', value: '+5pts' });
      score += 5;
    } else {
      factors.push({ name: 'P/VP elevado', impact: 'negative', value: '-10pts' });
      score -= 10;
    }
  }
  
  // Dividend Yield
  if (dy && dy > 0) {
    const annualizedDY = dy * 100;
    if (annualizedDY > 8) {
      factors.push({ name: 'Dividend Yield excelente', impact: 'positive', value: '+20pts' });
      score += 20;
      if (riskProfile === 'conservative') {
        recommendations.push('Ótima opção para geração de renda');
      }
    } else if (annualizedDY > 5) {
      factors.push({ name: 'Dividend Yield bom', impact: 'positive', value: '+10pts' });
      score += 10;
    } else if (annualizedDY > 2) {
      factors.push({ name: 'Dividend Yield médio', impact: 'neutral', value: '+5pts' });
      score += 5;
    }
  }
  
  // Price position in 52 weeks
  if (fiftyTwoWeekHigh && fiftyTwoWeekLow && price) {
    const position = (price - fiftyTwoWeekLow) / (fiftyTwoWeekHigh - fiftyTwoWeekLow);
    if (position < 0.3) {
      factors.push({ name: 'Preço próximo do mínimo anual', impact: 'positive', value: '+15pts' });
      score += 15;
      recommendations.push('Pode ser boa oportunidade de entrada');
    } else if (position > 0.8) {
      factors.push({ name: 'Preço próximo do máximo anual', impact: 'negative', value: '-10pts' });
      score -= 10;
      recommendations.push('Aguarde correção ou avalie fundamentos');
    }
  }
  
  // Time horizon adjustment
  if (timeHorizon >= 5) {
    factors.push({ name: 'Longo prazo permite maior risco', impact: 'positive', value: '+10pts' });
    score += 10;
  } else if (timeHorizon < 2) {
    factors.push({ name: 'Curto prazo exige cautela', impact: 'negative', value: '-10pts' });
    score -= 10;
    recommendations.push('Considere ativos mais estáveis');
  }
  
  // Market cap consideration
  if (marketCap) {
    if (marketCap > 50000000000) { // Large cap
      factors.push({ name: 'Empresa de grande porte', impact: 'positive', value: '+10pts' });
      score += 10;
    } else if (marketCap > 10000000000) { // Mid cap
      factors.push({ name: 'Empresa de médio porte', impact: 'neutral', value: '+5pts' });
      score += 5;
    } else { // Small cap
      if (riskProfile === 'aggressive') {
        factors.push({ name: 'Small cap - potencial de crescimento', impact: 'positive', value: '+10pts' });
        score += 10;
      } else {
        factors.push({ name: 'Small cap - maior risco', impact: 'negative', value: '-5pts' });
        score -= 5;
      }
    }
  }
  
  // Calculate recommendation
  let recommendation = 'NEUTRO';
  let action = 'AGUARDAR';
  
  if (score >= 70) {
    recommendation = 'FORTE COMPRA';
    action = 'COMPRAR';
  } else if (score >= 50) {
    recommendation = 'COMPRA';
    action = 'COMPRAR_PARCIAL';
  } else if (score >= 30) {
    recommendation = 'NEUTRO';
    action = 'MANTER';
  } else if (score >= 10) {
    recommendation = 'VENDA';
    action = 'REDUZIR';
  } else {
    recommendation = 'FORTE VENDA';
    action = 'VENDER';
  }
  
  // Portfolio allocation suggestion
  let suggestedAllocation = 5; // Default 5%
  if (riskProfile === 'aggressive' && score >= 50) {
    suggestedAllocation = 15;
  } else if (riskProfile === 'moderate' && score >= 60) {
    suggestedAllocation = 10;
  } else if (riskProfile === 'conservative' && score >= 70) {
    suggestedAllocation = 8;
  }
  
  // Project returns based on historical data and profile
  const projectedReturn = calculateProjectedReturn(pe, dy, beta, timeHorizon, riskProfile);
  
  return {
    score: Math.max(0, Math.min(100, score)),
    recommendation,
    action,
    riskLevel: riskScore,
    factors,
    recommendations,
    suggestedAllocation: `${suggestedAllocation}%`,
    projectedReturn,
    timestamp: new Date().toISOString()
  };
}

function calculateProjectedReturn(pe, dy, beta, timeHorizon, riskProfile) {
  // Simplified projection model
  const baseReturn = 10; // Base annual return expectation
  
  let adjustedReturn = baseReturn;
  
  // Adjust for valuation
  if (pe && pe > 0) {
    if (pe < 10) adjustedReturn += 3;
    else if (pe < 15) adjustedReturn += 1;
    else if (pe > 25) adjustedReturn -= 2;
  }
  
  // Add dividend yield
  if (dy && dy > 0) {
    adjustedReturn += dy * 100;
  }
  
  // Risk adjustment
  if (beta && beta > 1.2) {
    adjustedReturn += 2; // Higher risk, higher expected return
  }
  
  // Time horizon adjustment
  const totalReturn = ((1 + adjustedReturn / 100) ** timeHorizon - 1) * 100;
  
  return {
    annual: `${adjustedReturn.toFixed(1)}%`,
    total: `${totalReturn.toFixed(1)}%`,
    period: `${timeHorizon} anos`
  };
}

// Get user analyses history
app.get('/api/analyses/:userId', async (req, res) => {
  const { userId } = req.params;
  const { limit = 10 } = req.query;
  
  try {
    const analyses = await getAnalyses(userId, parseInt(limit));
    res.json(analyses);
  } catch (error) {
    console.error('Error fetching analyses:', error.message);
    res.status(500).json({ error: 'Failed to fetch analyses' });
  }
});

// Save user profile
app.post('/api/profile', async (req, res) => {
  const { userId, profile } = req.body;
  
  if (!userId || !profile) {
    return res.status(400).json({ error: 'userId and profile required' });
  }
  
  try {
    const saved = await saveUserProfile(userId, profile);
    res.json(saved);
  } catch (error) {
    console.error('Error saving profile:', error.message);
    res.status(500).json({ error: 'Failed to save profile' });
  }
});

// Get user profile
app.get('/api/profile/:userId', async (req, res) => {
  const { userId } = req.params;
  
  try {
    const profile = await getUserProfile(userId);
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error.message);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Search tickers
app.get('/api/search', async (req, res) => {
  const { q } = req.query;
  
  if (!q) {
    return res.status(400).json({ error: 'Query parameter required' });
  }
  
  try {
    const response = await axios.get(
      `https://brapi.dev/api/search?q=${q}&token=${BRAPI_KEY}`
    );
    
    res.json(response.data);
  } catch (error) {
    console.error('Error searching:', error.message);
    res.status(500).json({ error: 'Failed to search' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
  console.log(`📊 Using Brapi.dev API`);
  console.log(`💾 Cache enabled: 5min general, 1min prices`);
  console.log(`🗄️  SQLite database initialized`);
});

const express = require('express');
const db = require('../db/database');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Investment Analysis Algorithm
function analyzeInvestment(assetData, profile, userFinancials) {
  const {
    risk_tolerance,
    investment_horizon,
    monthly_investment,
    current_savings,
    future_goal
  } = profile;

  // Extract asset metrics
  const currentPrice = assetData.regularMarketPrice || 0;
  const peRatio = assetData.pe || 0;
  const pbRatio = assetData.pb || 0;
  const dividendYield = assetData.dividendYield || 0;
  const beta = assetData.beta || 1;
  const marketCap = assetData.marketCap || 0;
  
  // Risk scoring (1-5 scale)
  let riskScore = 0;
  
  // Volatility factor (beta)
  if (beta > 1.5) riskScore += 2;
  else if (beta > 1.2) riskScore += 1;
  else if (beta < 0.8) riskScore -= 1;
  
  // Valuation factor (P/E)
  if (peRatio > 25) riskScore += 1.5;
  else if (peRatio > 15) riskScore += 0.5;
  else if (peRatio < 10) riskScore -= 1;
  
  // Dividend yield stability
  if (dividendYield < 0.02) riskScore += 0.5;
  else if (dividendYield > 0.06) riskScore -= 0.5;
  
  // Normalize risk score to 1-5
  riskScore = Math.max(1, Math.min(5, Math.round(riskScore + 3)));
  
  // Compatibility with investor profile
  const profileCompatibility = Math.abs(riskScore - risk_tolerance);
  let compatibilityScore = Math.max(0, 100 - (profileCompatibility * 20));
  
  // Growth potential analysis
  let growthScore = 50;
  if (peRatio > 0 && peRatio < 15) growthScore += 20; // Undervalued
  else if (peRatio > 25) growthScore -= 15; // Overvalued
  
  if (dividendYield > 0.04) growthScore += 15; // Good dividends
  else if (dividendYield > 0.02) growthScore += 8;
  
  // Time horizon adjustment
  const horizonFactor = investment_horizon / 10; // Normalize to 10 years
  if (investment_horizon >= 10 && peRatio > 20) {
    growthScore += 10; // Long term can handle growth stocks
  }
  
  // Calculate final recommendation score (0-100)
  const finalScore = (compatibilityScore * 0.4) + (growthScore * 0.4) + ((100 - (riskScore * 10)) * 0.2);
  
  // Generate recommendation
  let recommendation = 'NEUTRO';
  if (finalScore >= 75) recommendation = 'COMPRA FORTE';
  else if (finalScore >= 60) recommendation = 'COMPRA';
  else if (finalScore <= 30) recommendation = 'VENDA';
  else if (finalScore <= 45) recommendation = 'AGUARDAR';
  
  // Projection calculation
  const yearsToGoal = investment_horizon;
  const totalInvestment = current_savings + (monthly_investment * 12 * yearsToGoal);
  
  // Simple projection based on historical averages adjusted by risk
  const expectedAnnualReturn = 0.08 + ((riskScore - 3) * 0.02); // 8% base, adjusted by risk
  const projectedValue = current_savings * Math.pow(1 + expectedAnnualReturn, yearsToGoal) +
                        (monthly_investment * 12 * ((Math.pow(1 + expectedAnnualReturn, yearsToGoal) - 1) / expectedAnnualReturn));
  
  const goalAchievementProbability = Math.min(100, Math.round((projectedValue / future_goal) * 100));
  
  return {
    score: Math.round(finalScore),
    recommendation,
    riskScore,
    compatibilityScore: Math.round(compatibilityScore),
    growthScore: Math.round(growthScore),
    analysis: {
      valuation: peRatio > 0 && peRatio < 15 ? 'SUBAVALIADO' : peRatio > 25 ? 'SOBREVALIADO' : 'JUSTO',
      volatility: beta > 1.2 ? 'ALTA' : beta < 0.8 ? 'BAIXA' : 'MODERADA',
      dividendAppeal: dividendYield > 0.04 ? 'ALTO' : dividendYield > 0.02 ? 'MODERADO' : 'BAIXO'
    },
    projection: {
      yearsToGoal,
      totalInvestment: Math.round(totalInvestment),
      projectedValue: Math.round(projectedValue),
      goalAchievementProbability,
      expectedAnnualReturn: (expectedAnnualReturn * 100).toFixed(1)
    },
    pros: [],
    cons: []
  };
}

// Get analysis for a specific asset
router.post('/analyze', authMiddleware, (req, res) => {
  const { ticker, assetData } = req.body;

  if (!ticker || !assetData) {
    return res.status(400).json({ error: 'Ticker e dados do ativo são obrigatórios' });
  }

  // Get user profile
  db.get(
    'SELECT * FROM investor_profiles WHERE user_id = ?',
    [req.user.id],
    (err, profile) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao buscar perfil' });
      }

      if (!profile) {
        return res.status(400).json({ 
          error: 'Perfil de investidor não configurado. Configure seu perfil primeiro.' 
        });
      }

      const userFinancials = {
        current_savings: profile.current_savings,
        monthly_investment: profile.monthly_investment,
        future_goal: profile.future_goal
      };

      const analysis = analyzeInvestment(assetData, profile, userFinancials);

      // Save analysis to history
      db.run(
        `INSERT INTO analysis_history (user_id, ticker, recommendation, score, details)
         VALUES (?, ?, ?, ?, ?)`,
        [req.user.id, ticker, analysis.recommendation, analysis.score, JSON.stringify(analysis)],
        (insertErr) => {
          if (!insertErr) {
            console.log(`Analysis saved for ${ticker} by user ${req.user.id}`);
          }
        }
      );

      res.json({ analysis, profile: profile.profile_type });
    }
  );
});

// Get analysis history
router.get('/history', authMiddleware, (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  
  db.all(
    'SELECT * FROM analysis_history WHERE user_id = ? ORDER BY created_at DESC LIMIT ?',
    [req.user.id, limit],
    (err, history) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao buscar histórico' });
      }
      
      const parsedHistory = history.map(item => ({
        ...item,
        details: JSON.parse(item.details)
      }));
      
      res.json(parsedHistory);
    }
  );
});

module.exports = router;

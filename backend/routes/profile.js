const express = require('express');
const db = require('../db/database');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

// Get user profile
router.get('/', authMiddleware, (req, res) => {
  db.get(
    'SELECT * FROM investor_profiles WHERE user_id = ?',
    [req.user.id],
    (err, profile) => {
      if (err) {
        return res.status(500).json({ error: 'Erro ao buscar perfil' });
      }
      
      if (!profile) {
        return res.json({ profile: null });
      }
      
      res.json({ profile });
    }
  );
});

// Create or update profile
router.post('/', authMiddleware, (req, res) => {
  const {
    profile_type,
    risk_tolerance,
    investment_horizon,
    monthly_investment,
    current_savings,
    future_goal,
    goal_description
  } = req.body;

  // Validation
  if (!profile_type || !risk_tolerance || !investment_horizon || 
      !monthly_investment || !future_goal) {
    return res.status(400).json({ 
      error: 'Campos obrigatórios: profile_type, risk_tolerance, investment_horizon, monthly_investment, future_goal' 
    });
  }

  if (!['conservador', 'moderado', 'agressivo'].includes(profile_type)) {
    return res.status(400).json({ error: 'Tipo de perfil inválido' });
  }

  if (risk_tolerance < 1 || risk_tolerance > 5) {
    return res.status(400).json({ error: 'Tolerância ao risco deve ser entre 1 e 5' });
  }

  if (investment_horizon < 1 || investment_horizon > 30) {
    return res.status(400).json({ error: 'Horizonte de investimento deve ser entre 1 e 30 anos' });
  }

  db.run(
    `INSERT OR REPLACE INTO investor_profiles 
     (user_id, profile_type, risk_tolerance, investment_horizon, 
      monthly_investment, current_savings, future_goal, goal_description, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime("now"))`,
    [
      req.user.id,
      profile_type,
      risk_tolerance,
      investment_horizon,
      monthly_investment,
      current_savings || 0,
      future_goal,
      goal_description || ''
    ],
    function (err) {
      if (err) {
        return res.status(500).json({ error: 'Erro ao salvar perfil' });
      }

      db.get(
        'SELECT * FROM investor_profiles WHERE user_id = ?',
        [req.user.id],
        (getErr, profile) => {
          if (getErr) {
            return res.status(500).json({ error: 'Erro ao buscar perfil atualizado' });
          }
          res.json({ message: 'Perfil salvo com sucesso', profile });
        }
      );
    }
  );
});

module.exports = router;

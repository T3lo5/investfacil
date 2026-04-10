import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DB_PATH = join(__dirname, '../data/investfacil.db');

let db;

export function initDB() {
  db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
      console.error('Error opening database:', err.message);
    } else {
      console.log('✅ Connected to SQLite database');
      createTables();
    }
  });
}

function createTables() {
  // User profiles table
  db.run(`
    CREATE TABLE IF NOT EXISTS user_profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId TEXT UNIQUE NOT NULL,
      riskProfile TEXT NOT NULL,
      investmentGoal TEXT,
      timeHorizon INTEGER,
      currentPortfolio REAL,
      monthlyContribution REAL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating user_profiles table:', err.message);
    } else {
      console.log('✅ user_profiles table ready');
    }
  });

  // Investment analyses table
  db.run(`
    CREATE TABLE IF NOT EXISTS analyses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ticker TEXT NOT NULL,
      userId TEXT NOT NULL,
      score INTEGER NOT NULL,
      recommendation TEXT NOT NULL,
      action TEXT NOT NULL,
      riskLevel INTEGER NOT NULL,
      factors TEXT,
      recommendations TEXT,
      suggestedAllocation TEXT,
      projectedReturn TEXT,
      quoteData TEXT,
      userProfile TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error creating analyses table:', err.message);
    } else {
      console.log('✅ analyses table ready');
    }
  });

  // Create indexes for better performance
  db.run('CREATE INDEX IF NOT EXISTS idx_analyses_user ON analyses(userId)', (err) => {
    if (err) console.error('Error creating index:', err.message);
  });
  
  db.run('CREATE INDEX IF NOT EXISTS idx_analyses_ticker ON analyses(ticker)', (err) => {
    if (err) console.error('Error creating index:', err.message);
  });
  
  db.run('CREATE INDEX IF NOT EXISTS idx_analyses_created ON analyses(createdAt)', (err) => {
    if (err) console.error('Error creating index:', err.message);
  });
}

export function saveAnalysis(analysisData) {
  return new Promise((resolve, reject) => {
    const {
      ticker,
      userId,
      analysis,
      quoteData,
      userProfile
    } = analysisData;

    const sql = `
      INSERT INTO analyses (
        ticker, userId, score, recommendation, action, riskLevel,
        factors, recommendations, suggestedAllocation, projectedReturn,
        quoteData, userProfile
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      ticker,
      userId,
      analysis.score,
      analysis.recommendation,
      analysis.action,
      analysis.riskLevel,
      JSON.stringify(analysis.factors),
      JSON.stringify(analysis.recommendations),
      analysis.suggestedAllocation,
      JSON.stringify(analysis.projectedReturn),
      JSON.stringify(quoteData),
      JSON.stringify(userProfile)
    ];

    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID, ...analysisData });
      }
    });
  });
}

export function getAnalyses(userId, limit = 10) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT * FROM analyses 
      WHERE userId = ? 
      ORDER BY createdAt DESC 
      LIMIT ?
    `;

    db.all(sql, [userId, limit], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        // Parse JSON fields
        const parsed = rows.map(row => ({
          ...row,
          factors: JSON.parse(row.factors || '[]'),
          recommendations: JSON.parse(row.recommendations || '[]'),
          projectedReturn: JSON.parse(row.projectedReturn || '{}'),
          quoteData: JSON.parse(row.quoteData || '{}'),
          userProfile: JSON.parse(row.userProfile || '{}')
        }));
        resolve(parsed);
      }
    });
  });
}

export function saveUserProfile(userId, profile) {
  return new Promise((resolve, reject) => {
    const {
      riskProfile,
      investmentGoal,
      timeHorizon,
      currentPortfolio,
      monthlyContribution
    } = profile;

    const sql = `
      INSERT INTO user_profiles (
        userId, riskProfile, investmentGoal, timeHorizon,
        currentPortfolio, monthlyContribution
      ) VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(userId) DO UPDATE SET
        riskProfile = excluded.riskProfile,
        investmentGoal = excluded.investmentGoal,
        timeHorizon = excluded.timeHorizon,
        currentPortfolio = excluded.currentPortfolio,
        monthlyContribution = excluded.monthlyContribution,
        updatedAt = CURRENT_TIMESTAMP
    `;

    const params = [
      userId,
      riskProfile,
      investmentGoal || null,
      timeHorizon || null,
      currentPortfolio || null,
      monthlyContribution || null
    ];

    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID, userId, ...profile });
      }
    });
  });
}

export function getUserProfile(userId) {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM user_profiles WHERE userId = ?';

    db.get(sql, [userId], (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row || null);
      }
    });
  });
}

export function closeDB() {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

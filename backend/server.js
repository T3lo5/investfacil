const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/auth');
const assetRoutes = require('./routes/assets');
const profileRoutes = require('./routes/profile');
const analysisRoutes = require('./routes/analysis');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/analysis', analysisRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// NOTA PARA DESENVOLVIMENTO:
// O frontend deve ser rodado separadamente com 'npm run dev' na raiz do projeto.
// O Vite servirá os arquivos estáticos em http://localhost:5173
// O backend roda em http://localhost:5000 apenas para API.
// Isso evita problemas de MIME type com hashes dos arquivos buildados.

app.listen(PORT, () => {
  console.log(`🚀 Backend API rodando em http://localhost:${PORT}`);
  console.log(`📡 Frontend deve rodar em http://localhost:5173 (com 'npm run dev')`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
});

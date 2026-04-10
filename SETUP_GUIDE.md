# 🚀 Guia de Setup - InvestFácil

## Visão Geral

InvestFácil é uma plataforma de análise de investimentos com:
- **Frontend**: React + Vite + PWA
- **Backend**: Node.js + Express + SQLite
- **API de Dados**: Brapi.dev (gratuita)
- **Cache**: Inteligente para otimizar requests
- **Docker**: Para deploy fácil do backend

## 🔐 Segurança das Chaves de API

**IMPORTANTE**: As chaves de API estão no arquivo `.env` que NUNCA deve ser commitado no Git.

```
.env                    # ✅ No Git (listado no .gitignore)
.env.example            # ✅ Pode ir pro Git (sem valores reais)
```

## 📋 Pré-requisitos

### Frontend
- Node.js 18+
- npm ou yarn

### Backend (opcional, se não usar Docker)
- Node.js 18+

### Docker (recomendado para backend)
- Docker
- Docker Compose

## 🛠️ Instalação

### 1. Clonar Repositório

```bash
git clone https://github.com/T3lo5/investfacil.git
cd investfacil
```

### 2. Configurar Variáveis de Ambiente

O arquivo `.env` já está configurado com a chave da Brapi.dev:

```env
VITE_BRAPI_KEY=ibzaP6a625W7s14TiWLVHZ
VITE_API_URL=http://localhost:3001
PORT=3001
```

**⚠️ Nunca compartilhe ou commite este arquivo!**

### 3. Instalar Frontend

```bash
npm install
```

### 4. Escolher Opção de Backend

#### Opção A: Usando Docker (Recomendado)

```bash
cd backend
docker-compose up -d --build
```

Verificar se está rodando:
```bash
docker-compose ps
curl http://localhost:3001/api/health
```

#### Opção B: Rodando Localmente

```bash
cd backend
npm install
npm start
```

O servidor rodará em `http://localhost:3001`

### 5. Rodar Frontend

```bash
# Na raiz do projeto
npm run dev
```

Acesse `http://localhost:5173`

## 🧪 Testando a Integração

### Testar Backend

```bash
# Health check
curl http://localhost:3001/api/health

# Buscar cotação
curl http://localhost:3001/api/quote/PETR4

# Analisar investimento
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "ticker": "PETR4",
    "userProfile": {
      "userId": "user123",
      "riskProfile": "moderate",
      "timeHorizon": 10
    }
  }'
```

### Testar Frontend

1. Abra o navegador em `http://localhost:5173`
2. Use a busca para encontrar ações
3. Clique em "Ver detalhes" para ver análise completa
4. Configure seu perfil de investidor

## 📊 Como Funciona o Cache

### Backend Cache
- **Preços**: 1 minuto (para capturar oportunidades)
- **Dados gerais**: 5 minutos
- **Análises**: Salvas no SQLite permanentemente

### Frontend Cache (React Query)
- **Stale Time**: 15 minutos
- **Cache Time**: 30 minutos
- **Refetch on window focus**: Opcional

### Fluxo de Requests

```
Usuário busca PETR4
    ↓
Frontend verifica cache (15 min)
    ↓ (cache miss)
Backend verifica cache (1 min)
    ↓ (cache miss)
Brapi.dev API
    ↓
Backend armazena no cache (1 min)
    ↓
Frontend armazena no cache (15 min)
    ↓
Resposta para usuário
```

## 🧠 Algoritmo de Análise

O algoritmo considera:

1. **Beta (Volatilidade)** - Adequação ao perfil
2. **P/L** - Valuation
3. **P/VP** - Preço justo
4. **Dividend Yield** - Geração de renda
5. **Posição 52 semanas** - Oportunidade
6. **Time Horizon** - Longo vs curto prazo
7. **Market Cap** - Porte da empresa

### Scores

- **70-100**: FORTE COMPRA ⭐⭐⭐
- **50-69**: COMPRA ⭐⭐
- **30-49**: NEUTRO ➖
- **10-29**: VENDA ⬇️
- **0-9**: FORTE VENDA ⬇️⬇️

## 🐳 Comandos Docker Úteis

```bash
# Iniciar
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar
docker-compose down

# Rebuild
docker-compose up -d --build

# Limpar tudo
docker-compose down -v
```

## 📁 Estrutura de Pastas

```
investfacil/
├── .env                 # ⚠️ NÃO COMMITAR
├── .gitignore           # ✅ Configurado para ignorar .env
├── package.json         # Frontend deps
├── vite.config.js       # Vite config
├── src/                 # Frontend code
│   ├── components/
│   ├── hooks/
│   └── App.jsx
├── backend/             # Backend code
│   ├── .env             # Link para ../.env
│   ├── package.json     # Backend deps
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── src/
│   │   ├── server.js    # API principal
│   │   └── database.js  # SQLite
│   └── data/            # SQLite database
└── public/              # Static assets
```

## 🔧 Troubleshooting

### Backend não inicia

```bash
# Verificar logs
docker-compose logs backend

# Ou localmente
cd backend
npm start
```

### Erro de conexão com API

1. Verifique se o backend está rodando
2. Confira a URL em `VITE_API_URL` no `.env`
3. Teste manualmente: `curl http://localhost:3001/api/health`

### Dados não atualizam

1. Limpe cache do navegador
2. Verifique console do browser por erros
3. Reinicie backend para limpar cache

### SQLite errors

```bash
# Delete database e reinicie
rm backend/data/investfacil.db
docker-compose restart backend
```

## 📈 Monitoramento

### Logs do Backend

```bash
docker-compose logs -f backend
```

### Health Check

```bash
curl http://localhost:3001/api/health
```

### Status do Cache

O backend loga quando usa cache:
```json
{
  "ticker": "PETR4",
  "fromCache": true,
  "timestamp": "..."
}
```

## 🚀 Deploy em Produção

### Backend

1. Configure variáveis de ambiente no servidor
2. Use Docker Compose ou Kubernetes
3. Configure reverse proxy (Nginx)
4. Habilite HTTPS

### Frontend

```bash
npm run build
# Deploy da pasta dist/ para Vercel, Netlify, etc.
```

### Variáveis de Produção

```env
VITE_BRAPI_KEY=sua_chave
VITE_API_URL=https://api.seudominio.com
NODE_ENV=production
```

## 📞 Suporte

- Issues: https://github.com/T3lo5/investfacil/issues
- Docs: `/backend/README.md`

---

**⚠️ Lembre-se**: Nunca commite `.env` ou dados sensíveis!

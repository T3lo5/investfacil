# Backend do InvestFácil

Backend Node.js com API para análise de investimentos, cache e banco de dados SQLite.

## 🚀 Funcionalidades

- **API REST** para cotações de ações (Brapi.dev)
- **Algoritmo de análise** baseado no perfil do investidor
- **Cache inteligente** (1min para preços, 5min para outros dados)
- **Banco de dados SQLite** para histórico de análises e perfis
- **Docker** para fácil deploy

## 📋 Pré-requisitos

- Node.js 18+
- Docker e Docker Compose (opcional)
- Chave da Brapi.dev (já configurada no .env)

## 🔧 Instalação Local

```bash
# Instalar dependências
npm install

# Copiar .env.example para .env (se necessário)
cp ../.env .

# Iniciar servidor
npm start
```

O servidor rodará em `http://localhost:3001`

## 🐳 Usando Docker

```bash
# Build e run
docker-compose up -d --build

# Ver logs
docker-compose logs -f

# Parar
docker-compose down
```

## 📡 Endpoints da API

### Cotação de Ação
```
GET /api/quote/:ticker
```

### Múltiplas Cotações
```
GET /api/quotes?tickers=PETR4,VALE3,ITUB4
```

### Analisar Investimento
```
POST /api/analyze
Body: {
  "ticker": "PETR4",
  "userProfile": {
    "userId": "user123",
    "riskProfile": "moderate",
    "investmentGoal": "Aposentadoria",
    "timeHorizon": 10,
    "currentPortfolio": 50000,
    "monthlyContribution": 1000
  }
}
```

### Histórico de Análises
```
GET /api/analyses/:userId?limit=10
```

### Salvar Perfil
```
POST /api/profile
Body: {
  "userId": "user123",
  "profile": { ... }
}
```

### Buscar Perfil
```
GET /api/profile/:userId
```

### Buscar Tickers
```
GET /api/search?q=petro
```

### Health Check
```
GET /api/health
```

## 🔐 Variáveis de Ambiente

As variáveis devem estar no arquivo `.env` na raiz do projeto:

```
VITE_BRAPI_KEY=sua_chave_aqui
PORT=3001
```

**⚠️ NUNCA commitar o arquivo .env!**

## 🧠 Algoritmo de Análise

O algoritmo considera:

1. **Volatilidade (Beta)** - Adequação ao perfil de risco
2. **P/L (Preço/Lucro)** - Valuation da ação
3. **P/VP (Preço/Valor Patrimonial)** - Preço justo
4. **Dividend Yield** - Geração de renda
5. **Posição nos 52 semanas** - Oportunidade de entrada
6. **Horizonte de tempo** - Longo vs curto prazo
7. **Market Cap** - Porte da empresa

### Score de Recomendação

- **70-100**: FORTE COMPRA
- **50-69**: COMPRA
- **30-49**: NEUTRO
- **10-29**: VENDA
- **0-9**: FORTE VENDA

## 📊 Cache

- **Preços**: 1 minuto (atualização frequente para oportunidades)
- **Dados gerais**: 5 minutos
- **Análises**: Salvas no banco de dados para histórico

## 🗄️ Banco de Dados

SQLite armazena:

- Perfis de usuários
- Histórico de análises
- Dados das cotações analisadas

Local: `backend/data/investfacil.db`

## 🛡️ Segurança

- Chaves de API no `.env` (não versionado)
- CORS configurado
- Validação de inputs
- Rate limiting pode ser adicionado

## 📝 License

MIT

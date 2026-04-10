# InvestFácil 📈

Plataforma inteligente de análise de investimentos com perfil de investidor personalizado.

## 🚀 Funcionalidades

- **Autenticação**: Login e registro de usuários
- **Perfil de Investidor**: Conservador, Moderado ou Agressivo
- **Busca de Ativos**: Integração com Brapi.dev (ações brasileiras)
- **Análise Inteligente**: Algoritmo que considera seu perfil para recomendar investimentos
- **Cache Inteligente**: Reduz requisições à API (importante para free tier)
- **PWA**: Funciona offline com service worker
- **Modo Escuro**: Toggle de tema claro/escuro

## 🛠️ Tecnologias

### Frontend
- React + Vite
- TailwindCSS
- React Router DOM
- React Query (cache)

### Backend
- Node.js + Express
- SQLite (banco de dados local)
- JWT (autenticação)
- bcryptjs (hash de senhas)

## 📦 Instalação

### Backend
```bash
cd backend
npm install
cp .env.example .env  # Edite com suas chaves
npm start
```

### Frontend
```bash
npm install
npm run dev
```

### Docker
```bash
cd backend
docker-compose up -d
```

## 🔐 Variáveis de Ambiente

O arquivo `.env` no backend contém:
- `BRAPI_TOKEN`: Token da API Brapi.dev
- `JWT_SECRET`: Chave secreta para JWT
- `PORT`: Porta do servidor (5000)

**Nunca commitar o .env no Git!**

## 📊 Algoritmo de Análise

O sistema considera:
1. **Perfil de Risco**: Compatibilidade entre risco do ativo e tolerância do usuário
2. **Valuation**: P/E ratio para identificar ativos sub/sobrevalorizados
3. **Dividendos**: Yield para investidores focados em renda
4. **Horizonte Temporal**: Ajusta recomendações baseado no tempo até o objetivo
5. **Projeção Financeira**: Calcula probabilidade de atingir metas

## 🎯 Perfis de Investidor

- **Conservador**: Prioriza segurança, baixa tolerância a risco (1-2)
- **Moderado**: Equilíbrio entre segurança e crescimento (3)
- **Agressivo**: Foco em maximizar retornos, alta tolerância (4-5)

## ⚠️ Aviso Legal

Este sistema é apenas para fins educacionais. Não constitui recomendação de investimento. Consulte um profissional financeiro antes de investir.

## 📝 License

MIT

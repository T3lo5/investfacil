# 🚀 Guia de Configuração do InvestFácil

## ⚠️ IMPORTANTE: Configuração das Variáveis de Ambiente

Este projeto usa chaves de API sensíveis que **NUNCA** devem ser commitadas no GitHub.

### 1️⃣ Backend - Criar arquivo `.env`

No diretório `/backend`, crie um arquivo chamado `.env` com o seguinte conteúdo:

```env
PORT=5000
BRAPI_TOKEN=ibzaP6a625W7s14TiWLVHZ
JWT_SECRET=sua_chave_secreta_aqui_use_uma_forte
NODE_ENV=development
DB_PATH=./data/investfacil.db
```

**🔐 Notas de Segurança:**
- `BRAPI_TOKEN`: Token da API Brapi.dev (já incluso, mas você pode gerar o seu em https://brapi.dev/)
- `JWT_SECRET`: **IMPORTANTE!** Troque por uma chave secreta forte em produção
- O arquivo `.env` já está no `.gitignore` e nunca será commitado

### 2️⃣ Frontend - Criar arquivo `.env`

No diretório raiz do frontend (ou `/frontend` se existir), crie um arquivo `.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=InvestFácil
```

---

## 📦 Instalação e Execução

### Backend

```bash
cd backend
npm install
npm run dev
```

O servidor irá rodar em `http://localhost:5000`

### Frontend

```bash
npm install
npm run dev
```

O frontend irá rodar em `http://localhost:5173` (ou outra porta disponível)

---

## 🐳 Usando Docker (Opcional)

Se preferir usar Docker:

```bash
cd backend
docker-compose up --build
```

Isso irá subir o backend e o banco de dados automaticamente.

---

## 🔑 Funcionalidades Implementadas

### ✅ Autenticação
- Registro de usuários
- Login com JWT
- Rotas protegidas

### ✅ Perfil de Investidor
- Tipos: Conservador, Moderado, Agressivo
- Tolerância a risco (1-5)
- Horizonte de investimento (meses)
- Investimento mensal
- Economia atual
- Meta futura

### ✅ APIs Integradas
- **Brapi.dev**: Dados de ações brasileiras (gratuita)
- Cache inteligente para reduzir requisições
- Fallback para dados mock em caso de falha

### ✅ Algoritmo de Análise
- Recomendações baseadas no perfil do usuário
- Score de investimento (0-100)
- Histórico de análises salvo no banco

### ✅ PWA
- Service Worker configurado
- Cache de 15 minutos
- Funciona offline

---

## 🛡️ Segurança

### O que NÃO vai para o Git:
- ✅ `.env` (variáveis de ambiente)
- ✅ `*.db` (banco de dados)
- ✅ `node_modules/`
- ✅ `*.log`

### O que VAI para o Git:
- ✅ Código fonte
- ✅ `.env.example` (modelo sem valores reais)
- ✅ `package.json`
- ✅ Configurações

---

## 📝 Comandos Úteis

### Testar API
```bash
# Health check
curl http://localhost:5000/api/health

# Registrar usuário
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"teste@test.com","password":"123456","name":"Teste"}'

# Buscar ativo
curl http://localhost:5000/api/assets/search?q=PETR4
```

### Limpar Banco de Dados
```bash
rm backend/data/investfacil.db
npm run dev  # Recria automaticamente
```

---

## 🎯 Próximos Passos

1. Configure seu `.env` conforme instruções acima
2. Execute `npm install` em backend e frontend
3. Rode `npm run dev` em ambos
4. Acesse `http://localhost:5173` no navegador
5. Crie sua conta e configure seu perfil de investidor

---

## 🆘 Problemas Comuns

### Erro: MODULE_NOT_FOUND '../db/database'
- Verifique se está na pasta correta (`backend`)
- Execute `npm install` novamente

### Erro: EADDRINUSE :::5000
- Outro processo está usando a porta 5000
- Execute: `pkill -f "node server.js"` e tente novamente

### Erro: BRAPI_TOKEN inválido
- Verifique se o token está correto no `.env`
- Token atual: `ibzaP6a625W7s14TiWLVHZ`

---

## 📞 Suporte

Para mais informações, consulte:
- `SPEC.md` - Especificações do projeto
- `checklist.md` - Lista de tarefas
- `README.md` - Documentação geral

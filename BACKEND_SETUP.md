# 🚀 Setup do Backend - InvestFácil

## ⚠️ IMPORTANTE: Segurança das Chaves de API

As chaves de API **NUNCA** devem ser commitadas no Git. Este guia mostra como configurar corretamente.

## 📋 Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn

## 🔧 Configuração Passo a Passo

### 1. Instalar Dependências

```bash
cd backend
npm install
```

### 2. Criar Arquivo .env

O arquivo `.env` contém informações sensíveis e **não deve ser versionado**.

```bash
# Copie o exemplo
cp .env.example .env

# Edite com suas informações
nano .env  # ou use seu editor preferido
```

### 3. Configurar Variáveis de Ambiente

Edite o arquivo `.env` com suas credenciais:

```env
PORT=5000
BRAPI_TOKEN=ibzaP6a625W7s14TiWLVHZ
JWT_SECRET=investfacil_super_secret_key_change_in_prod_2024
NODE_ENV=development
DB_PATH=./data/investfacil.db
```

**🔒 Notas de Segurança:**
- `BRAPI_TOKEN`: Token da API Brapi.dev (já incluso, mas você pode criar o seu em https://brapi.dev)
- `JWT_SECRET`: Altere para uma string aleatória única em produção
- Em produção, use variáveis de ambiente do seu servidor ao invés de arquivo .env

### 4. Iniciar o Servidor

```bash
# Modo desenvolvimento (com auto-reload)
npm run dev

# Modo produção
npm start
```

O servidor estará disponível em `http://localhost:5000`

## 🐳 Usando Docker (Recomendado para Produção)

### 1. Criar .env na raiz do backend

```bash
cp .env.example .env
# Edite com suas credenciais
```

### 2. Subir com Docker Compose

```bash
docker-compose up -d
```

### 3. Verificar Logs

```bash
docker-compose logs -f
```

## 📁 Estrutura de Arquivos Sensíveis

```
backend/
├── .env              # ❌ NUNCA commitar (contém segredos)
├── .env.example      # ✅ Pode commitar (modelo sem segredos)
├── .gitignore        # ✅ Configurado para ignorar .env
├── data/
│   └── investfacil.db  # ❌ Banco de dados local (ignorado pelo git)
└── ...
```

## 🔍 Verificando se está Seguro

Antes de commitar, verifique:

```bash
# Veja quais arquivos serão commitados
git status

# O .env NÃO deve aparecer na lista de arquivos a serem commitados
```

Se o `.env` aparecer, adicione ao `.gitignore`:

```bash
echo ".env" >> .gitignore
```

## 🛡️ Boas Práticas de Segurança

1. **Nunca commitar .env**: O `.gitignore` já está configurado, mas sempre verifique
2. **Alterar JWT_SECRET em produção**: Use uma string aleatória longa
3. **Usar HTTPS em produção**: Nunca exponha a API sem SSL
4. **Limitar CORS**: Configure origens permitidas no production
5. **Rate Limiting**: Implemente para proteger contra abuso da API

## 📊 Endpoints da API

| Método | Endpoint | Descrição | Autenticação |
|--------|----------|-----------|--------------|
| POST | `/api/auth/register` | Registrar usuário | Não |
| POST | `/api/auth/login` | Login | Não |
| GET | `/api/auth/me` | Dados do usuário | Sim |
| GET | `/api/profile` | Buscar perfil | Sim |
| POST | `/api/profile` | Criar/atualizar perfil | Sim |
| GET | `/api/assets/search` | Buscar ativo | Não |
| POST | `/api/assets/multiple` | Múltiplos ativos | Não |
| POST | `/api/analysis/analyze` | Analisar investimento | Sim |
| GET | `/api/analysis/history` | Histórico de análises | Sim |

## 🎯 Testando a API

```bash
# Testar health check
curl http://localhost:5000/api/health

# Registrar usuário
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Teste","email":"teste@test.com","password":"123456"}'
```

## ⚠️ Troubleshooting

### Erro: "Cannot find module"
```bash
npm install
```

### Erro: "Port already in use"
```bash
# Mude a porta no .env
PORT=5001
```

### Erro: "Database locked"
```bash
# Delete o banco e reinicie
rm data/investfacil.db
npm start
```

## 📞 Suporte

Em caso de dúvidas, consulte o README principal ou abra uma issue.

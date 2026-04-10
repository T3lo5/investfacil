# 📤 Como Subir para o GitHub

## ⚠️ IMPORTANTE: Segurança

O arquivo `.env` com suas chaves de API **NÃO** deve ser commitado. Ele já está no `.gitignore`.

## 🚀 Passo a Passo

### 1. Baixe o ZIP
Baixe o arquivo `investfacil-complete.zip` deste ambiente.

### 2. Extraia no Seu Computador
```bash
unzip investfacil-complete.zip
cd investfacil-complete  # ou nome da pasta extraída
```

### 3. Configure o Backend

```bash
cd backend

# Copie o exemplo de .env
cp .env.example .env

# Edite com SUAS credenciais (use nano, vscode, etc)
# BRAPI_TOKEN=ibzaP6a625W7s14TiWLVHZ
# JWT_SECRET=mude_para_algo_seguro_em_producao
```

### 4. Instale as Dependências

```bash
# Backend
cd backend
npm install

# Frontend (na raiz do projeto)
cd ..
npm install
```

### 5. Inicialize o Git e Suba

```bash
# Verifique que .env NÃO aparece
git status

# Se .env aparecer, adicione ao gitignore
echo ".env" >> .gitignore
echo "backend/.env" >> .gitignore

# Adicione todos os arquivos
git add .

# Commit inicial
git commit -m "feat: InvestFácil completo com autenticação, perfil e análise de investimentos"

# Renomeie branch para main
git branch -M main

# Adicione remote (substitua SEU_USUÁRIO se necessário)
git remote add origin https://github.com/T3lo5/investfacil.git

# Faça push
git push -u origin main
```

### 6. Se Pedir Autenticação

Use seu **Personal Access Token** ao invés da senha:
- GitHub → Settings → Developer settings → Personal access tokens
- Gere um token com permissão `repo`
- Use o token como senha no git push

## ✅ Verificação Final

Antes de push, confirme que estes arquivos **NÃO** estão na lista:
- `.env`
- `backend/.env`
- `backend/data/*.db`
- `node_modules/`

Execute:
```bash
git status
```

Se algum desses aparecer, remova:
```bash
git rm --cached .env
git rm --cached backend/.env
git rm -r --cached node_modules
```

## 🎉 Pronto!

Seu repositório estará seguro e suas chaves de API protegidas.

# Guia de Commit e Push para GitHub

## 🚀 Subindo o código para o GitHub

O projeto já está configurado com o remote correto. Para fazer o push, siga estes passos:

### Opção 1: Usando HTTPS (Recomendado para iniciantes)

```bash
# Configure suas credenciais do GitHub (se ainda não configurou)
git config --global user.name "SEU_NOME"
git config --global user.email "SEU_EMAIL"

# Faça o push (vai pedir seu usuário e senha/token do GitHub)
git push -u origin main
```

> ⚠️ **Importante**: O GitHub não aceita mais senhas normais. Use um **Personal Access Token**:
> 1. Acesse https://github.com/settings/tokens
> 2. Clique em "Generate new token (classic)"
> 3. Marque as permissões: `repo`, `workflow`
> 4. Copie o token gerado
> 5. Use o token como senha no git push

### Opção 2: Usando SSH (Mais seguro e conveniente)

```bash
# Gere uma chave SSH (se não tiver)
ssh-keygen -t ed25519 -C "seu_email@email.com"

# Adicione a chave ao GitHub
# 1. Copie o conteúdo da chave:
cat ~/.ssh/id_ed25519.pub
# 2. Vá em https://github.com/settings/keys
# 3. Clique em "New SSH key" e cole o conteúdo

# Mude a URL do remote para SSH
git remote set-url origin git@github.com:T3lo5/investfacil.git

# Faça o push
git push -u origin main
```

### Opção 3: Usando GitHub CLI (Mais fácil)

```bash
# Instale o gh (GitHub CLI)
# Ubuntu/Debian:
sudo apt install gh

# Ou via npm:
npm install -g gh

# Autentique
gh auth login

# Faça o push
git push -u origin main
```

## 📝 Comandos Úteis

```bash
# Verificar status
git status

# Ver histórico de commits
git log --oneline

# Ver branches
git branch -a

# Adicionar todos os arquivos
git add -A

# Fazer commit
git commit -m "mensagem descritiva"

# Puxar mudanças do remoto
git pull origin main

# Forçar push (cuidado!)
git push -f origin main
```

## 🔧 Se der erro no push

### Erro: "Permission denied"
- Verifique se está usando o token correto
- Ou configure SSH corretamente

### Erro: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/T3lo5/investfacil.git
```

### Erro: "Updates were rejected because the remote contains work"
```bash
# Puxe as mudanças primeiro
git pull origin main --rebase
git push -u origin main
```

## ✅ Checklist Final

- [ ] Código está funcionando localmente (`npm run dev`)
- [ ] Build funciona (`npm run build`)
- [ ] Todos os arquivos foram commitados (`git status`)
- [ ] Remote está configurado corretamente (`git remote -v`)
- [ ] Token SSH ou HTTPS configurado
- [ ] Push realizado com sucesso

---

**Dica**: Após o push, acesse https://github.com/T3lo5/investfacil para verificar se tudo está lá!

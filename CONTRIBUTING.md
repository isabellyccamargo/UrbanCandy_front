# Contribuindo para UrbanCandy

Obrigado por querer contribuir! Aqui estão as diretrizes.

## Conventional Commits

Todos os commits devem seguir o padrão [Conventional Commits](https://www.conventionalcommits.org/).

### Formato

```
<type>[optional scope]: <description>
```

### Tipos Aceitos

- **feat**: Nova funcionalidade
- **fix**: Correção de bug
- **docs**: Mudanças em documentação
- **style**: Formatação de código (sem lógica)
- **refactor**: Refatoração de código
- **perf**: Melhorias de performance
- **test**: Adição/atualização de testes
- **build**: Mudanças no sistema de build
- **ci**: Configuração de CI/CD
- **chore**: Outras mudanças (dependências, etc.)

### Exemplos

**✅ Válidos:**
```bash
git commit -m "feat: adicionar autenticação de usuário"
git commit -m "fix: corrigir cálculo do carrinho"
git commit -m "docs: atualizar documentação da API"
git commit -m "test: adicionar testes E2E para login"
git commit -m "refactor: simplificar fluxo de checkout"
```

**❌ Inválidos:**
```bash
git commit -m "oops bad message"
git commit -m "Updated stuff"
git commit -m "fixed things"
git commit -m "WIP"
```

## Fluxo de Trabalho

1. Crie uma branch: `git checkout -b feature/minha-feature`
2. Faça commits com mensagens válidas
3. Push para a branch: `git push origin feature/minha-feature`
4. Abra um Pull Request no GitHub

## Testes

- Certifique-se de que `npm test` passa antes de fazer commit
- Adicione testes para novas funcionalidades

---

Obrigado por contribuir! 🙏

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

## Código Style - ESLint + Prettier

Usamos ESLint para validação de código e Prettier para formatação automática.

### Validar Código Localmente

```bash
npm run lint:check      # Verificar linting (sem modificar)
npm run format:check    # Verificar formatação (sem modificar)
```

### Auto-corrigir Código

```bash
npm run lint --fix      # Corrigir erros de linting automaticamente
npm run format          # Formatar código com Prettier automaticamente
```

### Erros Comuns

- **Semicolons:** Prettier adiciona automaticamente ao final de linhas
- **Aspas:** Use aspas simples (') para strings, não duplas
- **Espaçamento:** Prettier normaliza automaticamente (2 espaços de indentação)
- **console.log:** Use com moderação (warning, não bloqueia commit)
- **React imports:** Não precisa de `import React` no topo de arquivos (React 17+)
- **PropTypes:** Use com moderação (warning, preferir TypeScript)

### Regras Principais

- **Indentação:** 2 espaços (nunca tabs)
- **Line width:** Máximo 100 caracteres
- **Trailing commas:** Adicionar em arrays/objetos (es5: não adiciona em função params)
- **Espaços em objetos:** `{ key: 'value' }` (sempre com espaços)
- **Ponto e vírgula:** Sempre obrigatório ao final de statements
- **Arrow functions:** Sempre com parênteses, ex: `(x) => x + 1`

### Integração com Husky (Pre-commit Hook)

O hook `pre-commit` executa automaticamente:

1. `npm run lint:check` - valida código com ESLint
2. `npm run format:check` - valida formatação com Prettier

Se alguma validação falhar, o commit é bloqueado. Execute os comandos de auto-correção acima e tente novamente.

### Documentação Oficial

- [ESLint Documentation](https://eslint.org/docs/latest/)
- [Prettier Documentation](https://prettier.io/docs/en/index.html)
- [React Documentation](https://react.dev/)

---

Obrigado por contribuir! 🙏

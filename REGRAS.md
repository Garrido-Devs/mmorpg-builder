# Regras do Projeto - MMORPG Builder

Este documento define as regras que devem ser seguidas durante o desenvolvimento.

---

## Regra Principal: Consistencia Total

> **O SITE, O EDITOR e a DOCUMENTACAO devem estar 100% sincronizados.**

Se algo existe em um lugar, deve existir nos outros. Se algo esta faltando, deve ser implementado ou removido de todos.

---

## 1. Sincronizacao Site <-> Editor <-> Docs

### 1.1 Landing Page (Site)
- Toda funcionalidade listada na landing page DEVE existir e funcionar no editor
- Se uma feature esta "em desenvolvimento", deve estar claramente marcada
- Nao prometer o que nao existe

### 1.2 Editor
- Toda funcionalidade do editor DEVE estar documentada
- Toda funcionalidade do editor DEVE ser mencionada no site (se relevante para o usuario)
- Bugs conhecidos devem estar listados no CHECKLIST.md

### 1.3 Documentacao
- Toda documentacao deve refletir o estado ATUAL do editor
- Nao documentar features que nao existem
- Atualizar docs quando o editor mudar

---

## 2. Checklist de Validacao

Antes de fazer merge/deploy, verificar:

- [ ] Funcionalidade existe no editor?
- [ ] Funcionalidade esta documentada?
- [ ] Funcionalidade esta no site (se aplicavel)?
- [ ] CHECKLIST.md esta atualizado?
- [ ] Nao ha promessas falsas na landing page?

---

## 3. Arquivos de Controle

| Arquivo | Proposito |
|---------|-----------|
| `CHECKLIST.md` | Lista TODAS as funcionalidades e seu status real |
| `ASSETS-FALTANDO.md` | Lista assets 3D que precisam ser buscados |
| `REGRAS.md` | Este arquivo - regras do projeto |
| `README.md` | Documentacao principal do projeto |

---

## 4. Fluxo de Trabalho

### Ao adicionar nova funcionalidade:
1. Implementar no editor
2. Testar se funciona
3. Adicionar na documentacao
4. Atualizar CHECKLIST.md
5. Se for feature importante, atualizar landing page

### Ao encontrar bug:
1. Adicionar em "Bugs Conhecidos" no CHECKLIST.md
2. Corrigir o bug
3. Marcar como corrigido no CHECKLIST.md
4. Commitar com mensagem clara

### Ao remover funcionalidade:
1. Remover do editor
2. Remover da documentacao
3. Remover do site/landing
4. Atualizar CHECKLIST.md

---

## 5. O que NAO fazer

- [ ] NAO adicionar features na landing que nao existem
- [ ] NAO documentar features que nao funcionam
- [ ] NAO deixar bugs conhecidos sem registrar
- [ ] NAO fazer commit sem testar
- [ ] NAO prometer prazos no site

---

## 6. Prioridades

### Alta Prioridade
1. Corrigir bugs que quebram funcionalidades existentes
2. Manter consistencia site/editor/docs
3. Funcionalidades core do MMORPG (HUD, inventario, combate)

### Media Prioridade
1. Novas funcionalidades solicitadas
2. Melhorias de UX
3. Novos assets

### Baixa Prioridade
1. Refatoracao de codigo
2. Otimizacoes de performance
3. Features "nice to have"

---

## 7. Commits

Formato das mensagens:
```
tipo: descricao curta em portugues

- detalhe 1
- detalhe 2

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
```

Tipos:
- `feat:` - nova funcionalidade
- `fix:` - correcao de bug
- `docs:` - alteracao em documentacao
- `style:` - formatacao, sem mudanca de codigo
- `refactor:` - refatoracao de codigo
- `test:` - adicao de testes
- `chore:` - tarefas de manutencao

---

## 8. Testes Obrigatorios

Antes de cada deploy, testar:

1. **Autenticacao**: Login, registro, logout funcionam?
2. **Editor**: Consegue criar, salvar, carregar mapa?
3. **Assets**: Todos os assets carregam?
4. **HUD**: Interface do jogo aparece corretamente?
5. **Som**: Sistema de audio funciona?
6. **Responsivo**: Funciona em diferentes tamanhos de tela?

---

## 9. Responsabilidades

### Desenvolvedor
- Implementar seguindo as regras
- Manter CHECKLIST.md atualizado
- Testar antes de commitar

### Revisor (se houver)
- Verificar consistencia site/editor/docs
- Testar funcionalidade
- Aprovar apenas se regras forem seguidas

---

## 10. Lembrete Final

> **Se nao funciona, nao prometa.**
> **Se funciona, documente.**
> **Se documentou, mantenha atualizado.**

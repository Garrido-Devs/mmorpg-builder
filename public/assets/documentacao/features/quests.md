# Sistema de Quests

Como criar missoes e objetivos para os jogadores.

## Tipos de Quest

### Principal
Historia principal do jogo, linear.

### Secundaria
Missoes opcionais que expandem o mundo.

### Diaria
Repetiveis a cada 24 horas.

### Evento
Disponiveis por tempo limitado.

## Estrutura de uma Quest

```
Nome: A Espada Perdida
Tipo: Secundaria
Nivel Minimo: 5
NPC Inicial: Ferreiro
NPC Final: Ferreiro

Objetivos:
1. Falar com o Ferreiro
2. Ir ate a Caverna Escura
3. Derrotar 5 Goblins
4. Encontrar a Espada
5. Retornar ao Ferreiro

Recompensas:
- 500 XP
- 100 Gold
- Espada do Ferreiro (item)
```

## Configurando Quests

1. Crie um NPC quest giver
2. Adicione o componente **Quest Giver**
3. Crie a quest no editor de quests
4. Configure objetivos e recompensas

## Objetivos Disponiveis

| Tipo | Descricao |
|------|-----------|
| Kill | Derrotar X inimigos |
| Collect | Coletar X itens |
| Talk | Falar com NPC |
| Reach | Chegar em local |
| Escort | Proteger NPC |
| Interact | Usar objeto |

## Quest Log

Os jogadores podem ver suas quests ativas no menu, com:
- Descricao
- Objetivos atuais
- Progresso
- Recompensas

# NPCs e Dialogos

Crie NPCs interativos com sistemas de dialogo.

## Tipos de NPC

| Tipo | Funcao |
|------|--------|
| Quest Giver | Da missoes |
| Merchant | Vende itens |
| Trainer | Ensina skills |
| Banker | Acesso ao banco |
| Guard | Protege area |
| Civilian | Ambiente |

## Configurando NPC

1. Adicione um modelo de personagem
2. Adicione componente **NPC**
3. Configure:
   - Nome e titulo
   - Tipo de NPC
   - Dialogos
   - Comportamento

## Sistema de Dialogos

### Estrutura
```
Dialogo: Ferreiro_Intro
├── "Ola aventureiro!"
│   ├── [Opcao] "Ola" -> Ferreiro_Menu
│   ├── [Opcao] "Tem quests?" -> Ferreiro_Quest
│   └── [Opcao] "Adeus" -> FIM
```

### Condicoes
Dialogos podem depender de:
- Quest completada
- Item no inventario
- Nivel do jogador
- Reputacao

## Editor de Dialogos

Use o editor visual para criar arvores de dialogo:

1. Crie nodes de texto
2. Conecte com opcoes de resposta
3. Adicione condicoes
4. Configure acoes (dar item, iniciar quest)

## Animacoes de NPC

NPCs podem ter animacoes:
- Idle (parado)
- Talking (falando)
- Working (trabalhando)
- Greeting (saudacao)

## Interacao

Quando jogador se aproxima:
1. Icone de interacao aparece
2. Jogador pressiona E
3. Dialogo inicia
4. Camera foca no NPC

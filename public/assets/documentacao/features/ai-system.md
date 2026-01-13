# Sistema de IA para NPCs

O MMORPG Builder possui um sistema de IA para criar NPCs com comportamentos inteligentes.

## Tipos de Comportamento

### Patrol (Patrulha)
O NPC segue um caminho predefinido entre pontos.

```
Comportamento: Patrol
Waypoints: [ponto1, ponto2, ponto3]
Velocidade: 2.0
Loop: true
```

### Follow (Seguir)
O NPC segue o jogador ou outro alvo.

```
Comportamento: Follow
Alvo: Player
Distancia: 3.0
Velocidade: 3.0
```

### Guard (Guardar)
O NPC fica em uma posicao e ataca inimigos que se aproximam.

```
Comportamento: Guard
Raio de Deteccao: 10.0
Agressivo: true
```

### Wander (Vagar)
O NPC anda aleatoriamente em uma area.

```
Comportamento: Wander
Raio: 5.0
Tempo Parado: 2.0
```

## Configurando IA

1. Selecione o NPC na cena
2. No Inspetor, adicione o componente **AI Behavior**
3. Escolha o tipo de comportamento
4. Configure os parametros

## Pathfinding

O sistema usa NavMesh para navegacao automatica. Os NPCs evitam obstaculos e encontram o melhor caminho ate o destino.

## Eventos de IA

Voce pode configurar eventos quando:
- NPC detecta o jogador
- NPC perde de vista o alvo
- NPC chega ao destino
- NPC entra em combate

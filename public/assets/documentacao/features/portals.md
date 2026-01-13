# Portais e Teleportes

Configure portais para conectar diferentes mapas e areas.

## Tipos de Portal

### Portal de Mapa
Transporta para outro mapa completamente.

### Portal Local
Teleporta dentro do mesmo mapa.

### Portal de Instancia
Cria uma dungeon privada para o grupo.

## Configurando um Portal

1. Adicione um objeto na cena
2. Adicione o componente **Portal**
3. Configure:

```
Tipo: Mapa
Destino: dungeon_01
Posicao: (10, 0, 5)
Rotacao: 180
Nivel Minimo: 10
Grupo Requerido: false
```

## Efeitos Visuais

Portais podem ter efeitos:
- Particulas
- Luz
- Som de ambiente
- Animacao de ativacao

## Restricoes

Configure quem pode usar o portal:

| Restricao | Descricao |
|-----------|-----------|
| Nivel | Nivel minimo do jogador |
| Quest | Quest completada |
| Item | Ter item especifico |
| Grupo | Estar em grupo |
| Classe | Classes permitidas |

## Portal Bidirecional

Para criar ida e volta:
1. Crie portal no mapa A -> B
2. Crie portal no mapa B -> A
3. Configure as posicoes de spawn

## Cooldown

Evite spam de teleporte:
```
Cooldown: 5s
Mensagem: "Aguarde para usar novamente"
```

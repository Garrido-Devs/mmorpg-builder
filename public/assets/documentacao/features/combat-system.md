# Sistema de Combate

Configure batalhas epicas no seu MMORPG com nosso sistema de combate.

## Componentes de Combate

### Health (Vida)
```
HP Maximo: 100
Regeneracao: 1.0/s
```

### Combat Stats
```
Ataque: 10
Defesa: 5
Velocidade de Ataque: 1.0
Alcance: 2.0
```

## Tipos de Dano

| Tipo | Descricao |
|------|-----------|
| Fisico | Dano basico de armas |
| Magico | Dano de habilidades magicas |
| Fogo | Dano ao longo do tempo |
| Gelo | Reduz velocidade do alvo |
| Veneno | Dano periodico |

## Configurando Combate

1. Adicione o componente **Health** ao personagem
2. Adicione **Combat Stats** para definir atributos
3. Configure **Hitbox** para deteccao de colisao
4. Adicione **Skills** para habilidades especiais

## Sistema de Skills

Cada personagem pode ter ate 4 skills ativas:

- **Slot 1-4**: Skills principais
- **Cooldown**: Tempo de recarga
- **Mana Cost**: Custo de mana
- **Efeitos**: Dano, cura, buff, debuff

## Combate PvP

Para habilitar PvP:
1. Marque a zona como **PvP Zone**
2. Configure regras de combate
3. Defina penalidades por morte

## Loot e Recompensas

Configure drops de inimigos:
- Itens com % de chance
- Experiencia
- Moedas

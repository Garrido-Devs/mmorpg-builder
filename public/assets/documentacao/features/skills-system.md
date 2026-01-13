# Sistema de Skills

Documentacao completa do sistema de habilidades.

## Tipos de Skills

### Ativas
Skills que o jogador usa manualmente:
- Ataques especiais
- Magias
- Habilidades de suporte

### Passivas
Skills que funcionam automaticamente:
- Aumento de atributos
- Resistencias
- Bonus permanentes

## Configurando uma Skill

```
Nome: Bola de Fogo
Tipo: Ativa
Dano: 50 (Magico)
Mana: 20
Cooldown: 3s
Alcance: 15m
Area: 3m (circular)
Efeito: Queimadura por 5s
```

## Arvore de Talentos

Organize skills em arvores:

```
Guerreiro
├── Forca Bruta (passiva)
│   ├── Golpe Poderoso
│   └── Investida
├── Defesa (passiva)
│   ├── Escudo Magico
│   └── Provocar
└── Combate
    ├── Combo de 3 golpes
    └── Execucao
```

## Sistema de Pontos

- Jogadores ganham 1 ponto por nivel
- Skills tem pre-requisitos
- Maximo de pontos em cada skill

## Cooldowns e Recursos

| Recurso | Regeneracao |
|---------|-------------|
| Mana | 5/s |
| Energia | 10/s |
| Raiva | Em combate |

# Resource Nodes e Crafting

Crie sistemas de coleta de recursos e fabricacao de itens.

## Resource Nodes

Tipos de recursos disponiveis:

| Tipo | Ferramenta | Exemplo |
|------|------------|---------|
| Minerio | Picareta | Ferro, Ouro, Diamante |
| Madeira | Machado | Carvalho, Pinho |
| Ervas | Maos | Erva curativa |
| Pesca | Vara | Peixe comum |

## Configurando Resource Node

1. Adicione um objeto na cena
2. Adicione o componente **Resource Node**
3. Configure:
   - Tipo de recurso
   - Quantidade por coleta
   - Tempo de respawn
   - Ferramenta necessaria

## Sistema de Crafting

### Receitas

```
Nome: Espada de Ferro
Materiais:
  - Barra de Ferro x3
  - Madeira x2
Resultado: Espada de Ferro x1
Tempo: 5s
```

### Estacoes de Crafting

- **Forja**: Armas e armaduras
- **Bancada**: Itens gerais
- **Caldeira**: Pocoes
- **Tear**: Roupas

## Progressao de Crafting

Os jogadores podem subir de nivel em profissoes:

1. **Iniciante** (1-25)
2. **Aprendiz** (26-50)
3. **Artesao** (51-75)
4. **Mestre** (76-100)

Niveis mais altos desbloqueiam receitas melhores.

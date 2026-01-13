# Sistema de Banco

Implemente armazenamento compartilhado entre personagens.

## Funcionalidades

- Armazenar itens
- Armazenar gold
- Compartilhar entre personagens da mesma conta
- Slots extras compraveis

## Configuracao

```
Slots Iniciais: 30
Slots Maximos: 100
Custo por Slot: 1000 gold
Compartilhado: true
```

## Interface do Banco

O banco e acessado atraves de NPCs Banqueiros:

1. Jogador fala com Banqueiro
2. Abre interface de banco
3. Arrasta itens entre inventario e banco
4. Deposita/saca gold

## Abas do Banco

Organize itens em abas:
- Equipamentos
- Consumiveis
- Materiais
- Quest Items
- Outros

## Banco de Guilda

Guildas podem ter banco compartilhado:

| Rank | Permissao |
|------|-----------|
| Lider | Acesso total |
| Oficial | Depositar/Sacar |
| Membro | Apenas depositar |
| Novato | Sem acesso |

## Logs

Registre todas as transacoes:
- Quem depositou/sacou
- Quando
- Quantidade
- Item

## Seguranca

- Limite de saques diarios
- Confirmacao para itens raros
- Bloqueio temporario se suspeito

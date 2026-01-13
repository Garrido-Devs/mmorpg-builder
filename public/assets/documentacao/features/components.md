# Guia de Componentes

Os componentes são blocos de funcionalidade que você anexa aos objetos do jogo para dar-lhes comportamentos específicos.

## Componentes Base

### Transform
Controla posição, rotação e escala do objeto.
- Presente em todos os objetos
- Não pode ser removido

### Collider
Adiciona física e colisão ao objeto.
- Tipos: Box, Sphere, Capsule, Mesh
- Pode ser trigger (sem física)

### Interactable
Permite que o jogador interaja com o objeto.
- Distância de interação
- Mensagem de prompt
- Eventos: onInteract

### Trigger
Área que detecta quando o jogador entra/sai.
- Formato configurável
- Eventos: onEnter, onExit, onStay

## Componentes MMORPG

### Resource Node
Nó de recurso coletável (minério, árvore, pesca).
- Skill necessária
- Nível mínimo
- XP por coleta
- Tempo de respawn

### Crafting Station
Estação de criação (forja, fogão, bancada).
- Tipo de estação
- Receitas disponíveis
- Bônus de XP/sucesso
- Combustível (opcional)

### Bank
Sistema de armazenamento do jogador.
- Slots base e upgrades
- Taxas (opcional)
- Abas de organização

### Skill
Define uma habilidade treinável.
- Categoria (coleta, combate, artesanato)
- Nível máximo
- Progressão de XP
- Desbloqueios por nível

### Equipment
Define um item equipável.
- Slot (capacete, arma, etc.)
- Bônus de ataque/defesa
- Requisitos de nível
- Efeitos especiais

### Prayer Altar
Altar para restaurar prayer e oferecer ossos.
- Tipo de altar
- Bônus de XP
- Cooldown

### Agility Obstacle
Obstáculo de agilidade.
- Tipo (pular, escalar, balançar)
- Nível necessário
- Chance de falha
- Dano ao falhar

### Farming Patch
Canteiro para plantar e colher.
- Tipo (allotment, erva, árvore)
- Sementes aceitas
- Tempo de crescimento
- Doença e proteção

## Componentes de Conteúdo

### NPC
Personagem não jogável.
- Nome e título
- Diálogo
- Loja
- Quests

### Quest Giver
Distribuidor de missões.
- Quests disponíveis
- Indicador visual
- Requisitos

### Shop
Loja de itens.
- Itens à venda
- Preços
- Restock

### Door
Porta/portão.
- Estado (aberta/fechada/trancada)
- Chave necessária
- Animação

### Portal
Teleporte para outro local.
- Destino
- Requisitos
- Efeito visual

## Componentes de Ambiente

### Light
Fonte de luz.
- Tipo (point, spot, directional)
- Cor e intensidade
- Sombras

### Audio Source
Fonte de áudio 3D.
- Arquivo de som
- Volume
- Loop
- Distância

### Particle Emitter
Emissor de partículas.
- Sistema de partículas
- Taxa de emissão
- Tempo de vida

## Componentes Avançados

### Custom Script
Script personalizado em JavaScript.
- ID do script
- Parâmetros
- Eventos customizados

### Animator
Controle de animações.
- Animações disponíveis
- Transições
- Velocidade

## Boas Práticas

1. Use apenas os componentes necessários
2. Configure eventos para feedback ao jogador
3. Teste as interações frequentemente
4. Documente configurações complexas

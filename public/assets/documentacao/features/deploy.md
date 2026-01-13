# Deploy na Vercel

Publique seu jogo online de forma gratuita.

## Pre-requisitos

- Conta na Vercel (gratuita)
- Conta no GitHub
- Projeto finalizado

## Passo a Passo

### 1. Exportar Projeto

No editor:
1. Clique em **Salvar**
2. Va em **Configuracoes > Exportar**
3. Baixe o pacote do jogo

### 2. Criar Repositorio

No GitHub:
1. Crie novo repositorio
2. Faca upload dos arquivos
3. Commit inicial

### 3. Deploy na Vercel

1. Acesse vercel.com
2. Clique em **New Project**
3. Importe do GitHub
4. Configure:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output: `dist`
5. Clique em **Deploy**

## Variaveis de Ambiente

Configure no painel da Vercel:

```
VITE_API_URL=https://seu-backend.com
VITE_PUSHER_KEY=sua_chave
VITE_PUSHER_CLUSTER=us2
```

## Dominio Customizado

1. Va em Settings > Domains
2. Adicione seu dominio
3. Configure DNS:
   - CNAME: cname.vercel-dns.com

## Atualizacoes

Cada push no GitHub faz deploy automatico:
1. Preview em branch de feature
2. Producao na branch main

## Performance

Dicas para melhor performance:
- Comprima texturas
- Use LOD para modelos
- Minimize scripts
- Habilite cache

## Monitoramento

A Vercel oferece:
- Analytics de visitantes
- Logs de erros
- Metricas de performance

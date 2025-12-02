# 🚀 AtlasOS - Guia de Instalação e Execução

## 📋 Visão Geral

Este repositório contém duas partes principais usadas para simular e visualizar o microkernel AtlasOS:

1. Backend (simulador do microkernel) — pasta `server/` (Node.js, WebSocket)
2. Frontend (dashboard) — pasta raiz `src/` (React + Vite + TypeScript)

Este arquivo descreve como preparar o ambiente local e executar ambas as peças para desenvolvimento.

---

## 🧰 Pré-requisitos

- Node.js 18+ (recomendado)
- Yarn (ou npm) — o projeto usa exemplos com `yarn` nos comandos abaixo
- (Opcional) Python 3.10+ para executar o simulador `TrabalhoOS` e testes Python

No macOS com zsh você pode verificar versões:

```zsh
node -v
yarn -v
python3 --version
```

---

## Instalação

1. Instale dependências do frontend (raiz):

```zsh
cd /Users/snows/atlas-kernel-vision
yarn install
```

2. Instale dependências do backend (server):

```zsh
cd /Users/snows/atlas-kernel-vision/server
yarn install
# ou: npm install
```

Observação: o backend inclui fontes TypeScript em `server/src/` mas o repositório já contém artefatos JS (`server/src/index.js`) usados pelo script `dev` do `server/package.json`. Se você preferir rodar/compilar o TypeScript do servidor, adicione um passo de build (`tsc`) ou execute com `ts-node`.

---

## Executando em modo desenvolvimento

1. Iniciar o backend (WebSocket server que simula o microkernel):

```zsh
cd /Users/snows/atlas-kernel-vision/server
yarn dev
# ou: node src/index.js
```

O servidor ouve em `http://localhost:3001` e fornece um WebSocket em `ws://localhost:3001` que envia eventos `STATE_UPDATE` a cada segundo.

2. Iniciar o frontend (dashboard):

```zsh
cd /Users/snows/atlas-kernel-vision
yarn dev
```

Isso iniciará o Vite dev server (por padrão em `http://localhost:5173`). Abra o browser e acesse a URL mostrada pelo Vite.

Dica: o frontend se conecta ao WebSocket do backend em `ws://localhost:3001`. Se você usar outro host/porta, atualize a variável em `src/hooks/useKernelWebSocket.ts` ou converta para usar `import.meta.env.VITE_WS_URL`.

---

## Build para produção

1. Build do frontend:

```zsh
cd /Users/snows/atlas-kernel-vision
yarn build
# isso roda: tsc && vite build (conforme package.json)
```

2. Backend de produção:

O backend atualmente é executado a partir dos arquivos JavaScript em `server/src/*.js`. Se você migrar para um fluxo TypeScript, adicione um passo de build e ajuste os scripts em `server/package.json` para apontar para o diretório compilado (por exemplo `dist/index.js`).

---

## Executando os testes Python (TrabalhoOS)

O repositório `TrabalhoOS/` contém uma implementação em Python e alguns testes `pytest` que demonstram comportamento do microkernel.

```zsh
cd /Users/snows/TrabalhoOS
python3 -m venv .venv
source .venv/bin/activate
python -m pip install --upgrade pip
python -m pip install pytest
pytest -q
```

Os testes existentes (`tests/test_atlasos.py`) verificam cenários de registro, envio de mensagens, reinício automático e falhas simuladas.

---

## Notas úteis & recomendações

- O frontend contém a store (Zustand) em `src/store/dashboardStore.ts` que também oferece funcionalidades de simulação (modo demo, simular falha, exportar relatório). Use-a para testar interações sem o backend.
- Arquivo `src/types.ts` foi corrigido para remover conteúdo Markdown inválido — se você editar tipos, rode `yarn build` ou `yarn dev` para validar erros de TypeScript.
- Para flexibilizar o WebSocket URL, recomendo migrar `ws://localhost:3001` para uma variável de ambiente Vite (`VITE_WS_URL`) e ler via `import.meta.env.VITE_WS_URL` em `src/hooks/useKernelWebSocket.ts`.
- Cheque as versões das dependências em `package.json` se tiver problemas ao rodar `yarn install` (algumas versões podem precisar ajuste conforme seu registro npm).

---

## Troubleshooting rápido

- Erro ao iniciar o backend: verifique se `node` está na versão compatível e se `server/src/index.js` existe. Se o servidor estiver escrito em TypeScript e você alterou fontes `.ts`, compile antes ou execute com `ts-node`.
- Frontend não conecta ao WS: confirme que o backend está rodando (`yarn dev` em `server/`) e que a URL em `src/hooks/useKernelWebSocket.ts` corresponde ao host/porta atual.
- Erros de TypeScript/Build: rode `yarn build` na raiz para obter mensagens do `tsc`.

---

Se quiser, aplico também pequenas melhorias automáticas nos scripts (`server/package.json`) e adiciono variáveis de ambiente para a URL do WebSocket — diga se quer que eu faça essas alterações.

Boa exploração do AtlasOS! 🚀

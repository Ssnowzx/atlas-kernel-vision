Como rodar localmente (Front-end + Back-end)

As instruções abaixo assumem que o repositório do frontend (`atlas-kernel-vision`) está ao lado da pasta `TrabalhoOS` (estrutura do workspace usada aqui).

1. Backend Python (AtlasOS microkernel)

## 🚀 Guia rápido — Executando o AtlasOS (Front + Back)

> Este arquivo mostra o passo-a-passo para levantar o backend Python (microkernel), o servidor WebSocket Node e o frontend React. Use os atalhos abaixo para começar rápido.

---

### 📚 Menu rápido

- 🔧 Backend Python (AtlasOS) — `TrabalhoOS`
- 📡 Servidor WebSocket / API — `atlas-kernel-vision/server` (porta 3001)
- 🌐 Frontend (React + Vite) — `atlas-kernel-vision` (porta dev padrão)
- ✅ Verificações rápidas e troubleshooting

---

## 1) 🔧 Backend Python (AtlasOS microkernel)

Recomendado: ative um virtualenv (opcional, mas limpo).

```bash
# vá para a pasta do backend
cd /Users/snows/TrabalhoOS

# (opcional) criar/ativar virtualenv
python3 -m venv .venv
source .venv/bin/activate

# rodar o kernel (boot)
python3 main.py
```

O boot imprime logs no terminal (serviços, drivers, IRQ, demos). Reserve um terminal para acompanhar `/tmp/atlasos-py.log` se quiser histórico.

---

## 2) 📡 Servidor WebSocket / API (Node)

O dashboard espera um WebSocket backend em `ws://localhost:3001`. Inicie o servidor que fica em `atlas-kernel-vision/server`.

```bash
cd /Users/snows/atlas-kernel-vision/server
yarn install    # (use Yarn como preferido no workspace)
yarn start      # ou: node src/index.js
```

Você deverá ver uma mensagem como:

> 🚀 AtlasOS Kernel Backend rodando em http://localhost:3001

Logs do servidor são escritos em `/tmp/atlasos-node.log` por convenção (útil para `tail -f`).

---

## 3) 🌐 Frontend (React + Vite)

```bash
cd /Users/snows/atlas-kernel-vision
yarn install
yarn dev
```

Abra o dashboard no navegador (por padrão: `http://localhost:5173`). Ele tentará se conectar automaticamente a `ws://localhost:3001`.

---

## 4) ✅ Verificações rápidas

- Checar status do servidor Node:

```bash
curl -s http://localhost:3001/api/status | jq .
```

- Checar estado usado pelo dashboard:

```bash
curl -s http://localhost:3001/api/state | jq .
```

- Ver logs em tempo real (terminais separados):

```bash
tail -f /tmp/atlasos-py.log
tail -f /tmp/atlasos-node.log
```

---

## 5) 🛠️ Troubleshooting rápido

- Conexão WebSocket continua em "Conectando...":

  - Confirme que o servidor Node (`atlas-kernel-vision/server`) está rodando.
  - Verifique se a porta `3001` não está ocupada: `lsof -i :3001`.
  - Abra DevTools → Console / Network para mensagens de WebSocket.

- `/api/state` retorna 404:

  - Reinicie o servidor Node (às vezes um processo antigo está ativo).

- Backend Python não inicia ou trava:
  - Veja o log no terminal ou `/tmp/atlasos-py.log`.
  - Assegure alocação MMU e permissões (se testes recentes adicionaram process entries).

---

## 6) ✨ Utilitários úteis (opcionais)

## RUNNING — Guia rápido para executar o AtlasOS

Este arquivo é a versão curta e visual para iniciar o backend Python (microkernel), o servidor WebSocket/API Node e o frontend React.

Use este guia quando quiser subir o sistema localmente para desenvolvimento ou testes rápidos.

---

## 📚 Menu rápido

- 🔧 Backend Python (AtlasOS) — `TrabalhoOS`
- 📡 Servidor WebSocket / API — `atlas-kernel-vision/server` (porta 3001)
- 🌐 Frontend (React + Vite) — `atlas-kernel-vision` (porta dev padrão)
- 🧰 Utilitários: `tools/process_snapshot.py`, `tools/pretty_logs.py`

---

## 1) 🔧 Backend Python (AtlasOS microkernel)

Recomendado: use um virtualenv para isolar dependências (opcional).

```bash
cd /Users/snows/TrabalhoOS
python3 -m venv .venv        # opcional
source .venv/bin/activate   # opcional
python3 main.py
```

Logs: acompanhe o terminal do processo ou `/tmp/atlasos-py.log`.

---

## 2) 📡 Servidor WebSocket / API (Node)

O dashboard espera um WebSocket em `ws://localhost:3001`. Inicie o servidor:

```bash
cd /Users/snows/atlas-kernel-vision/server
yarn install
yarn start    # ou: node src/index.js
```

Logs do servidor: `/tmp/atlasos-node.log`.

---

## 3) 🌐 Frontend (React + Vite)

```bash
cd /Users/snows/atlas-kernel-vision
yarn install
yarn dev
```

Abra: http://localhost:5173 (o frontend tenta se conectar a ws://localhost:3001 automaticamente).

---

## 4) ✅ Verificações rápidas

- Checar status do servidor Node:

```bash
curl -s http://localhost:3001/api/status | jq .
```

- Checar estado usado pelo dashboard:

```bash
curl -s http://localhost:3001/api/state | jq .
```

- Ver logs em tempo real:

```bash
tail -f /tmp/atlasos-py.log
tail -f /tmp/atlasos-node.log
```

---

## 5) �️ Troubleshooting rápido

- WebSocket permanece em "Conectando...":

  - Verifique se o servidor Node (`atlas-kernel-vision/server`) está em execução.
  - Confirme que a porta 3001 não está em uso: `lsof -i :3001`.

- `/api/state` retorna 404:

  - Reinicie o servidor Node para carregar alterações de código.

- Backend Python não inicia ou trava:
  - Verifique o log no terminal ou `/tmp/atlasos-py.log`.

---

## 6) ✨ Utilitários úteis

- Snapshot (lista de processos a cada 30s):

```bash
python3 /Users/snows/TrabalhoOS/tools/process_snapshot.py
```

- Pretty tail (eventos front↔back):

```bash
python3 /Users/snows/TrabalhoOS/tools/pretty_logs.py
```

---

## 7) 📝 Próximos passos (opcional)

- Posso adicionar badges, scripts `scripts/start-all.sh` e `scripts/stop-all.sh` para iniciar tudo com um comando.
- Posso implementar uma bridge (Python → Node) para enviar eventos do microkernel ao dashboard em tempo real.

---

© AtlasOS — Instruções rápidas

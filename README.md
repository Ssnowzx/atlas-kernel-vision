# Atlas Kernel Vision

Visualização interativa da arquitetura **microkernel AtlasOS** para a missão de exploração do cometa interestelar **3I/ATLAS**.

## 🌌 Sobre a Missão

Exploração científica do **3I/ATLAS**, terceiro objeto interestelar confirmado de fora do Sistema Solar, utilizando um sistema operacional microkernel de alta confiabilidade.

## 🚀 Desenvolvimento Local

### Pré-requisitos

- Node.js 18+ 
- Yarn

### Instalação

```bash
cd /Users/snows/atlas-kernel-vision
yarn install
```

### Executar em Modo Desenvolvimento

```bash
yarn dev
```

Acesse: `http://localhost:5173`

### Build de Produção

```bash
yarn build
yarn preview
```

## 🏗️ Arquitetura

Este projeto visualiza a arquitetura microkernel em **5 camadas**:

- **Camada 4:** Aplicações Científicas (Análise Composição 3I/ATLAS)
- **Camada 3:** Serviços de Missão (Controle de Voo, Navegação IA)
- **Camada 2:** Serviços Essenciais (Drivers isolados, Recovery Agent)
- **Camada 1:** Microkernel (Escalonador, IPC, MMU, IRQ)
- **Camada 0:** Hardware (CPU, NPU, Câmera, Propulsores)

## 📊 Tecnologias

- **React** - Interface de usuário
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Estilização
- **shadcn/ui** - Componentes UI

## 📚 Documentação Completa

Consulte `/Users/snows/TrabalhoOS/FrameWork.md` para a documentação técnica detalhada da arquitetura microkernel.

## 📝 Licença

Projeto Acadêmico - Uso educacional livre.

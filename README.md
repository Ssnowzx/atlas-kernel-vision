# 🛰️ AtlasOS Dashboard

![AtlasOS](https://img.shields.io/badge/AtlasOS-Microkernel-blue?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-3.0-38B2AC?style=for-the-badge&logo=tailwind-css)

**AtlasOS Dashboard** é um simulador interativo de sistema operacional microkernel desenvolvido para demonstrar os conceitos de arquitetura de sistemas operacionais em sondas espaciais. A aplicação oferece visualização em tempo real de processos, comunicação IPC (Inter-Process Communication), captura de imagens, análise de telemetria e muito mais.

---

## 🌟 Características Principais

### 🔧 Arquitetura Microkernel
- **Camada 0**: Hardware (CPU, RAM, Storage, NPU)
- **Camada 1**: Microkernel Core (Escalonador, IPC Hub, MMU, IRQ Handler)
- **Camada 2**: Drivers & Gerenciadores (Câmera, NPU, Memória, Arquivos, Dispositivos)
- **Camada 3**: Serviços do Sistema (Navegação IA, Comunicação DSN, Energia)
- **Camada 4**: Aplicações (Análise de Composição)

### 📊 Dashboard em Tempo Real
- **Estatísticas do Sistema**: Processos ativos, IPC/s, uptime, uso de CPU
- **Tabela de Processos**: Monitoramento de 10 processos com prioridades P1-P4
- **Monitor IPC**: Feed em tempo real de mensagens entre processos
- **Log de Eventos**: Histórico de eventos do sistema com severidades (info, warning, error, success)
- **Seção Microkernel**: Visualização dos 4 componentes fundamentais do kernel

### 🎨 Visualizações Avançadas
- **Diagrama de Arquitetura**: Representação visual das camadas do sistema
- **Sequência de Boot**: Simulação animada da inicialização do sistema (6 etapas)
- **Gráficos em Tempo Real** (usando Recharts):
  - CPU histórico (últimos 30 segundos)
  - IPC por processo (bar chart)
  - Timeline de eventos (scatter chart)

### 📸 Galeria de Imagens da Sonda
- **Captura Automática**: Simula captura de imagens com flash animation
- **Upload Manual**: Suporte para upload de arquivos locais
- **Metadados Editáveis**: Coordenadas (lat/long), altitude, status
- **Filtros**: Visualize apenas imagens processadas ou pendentes
- **Modal Lightbox**: Visualização detalhada com informações completas

### ⚠️ Sistema de Alertas
- **Monitoramento Inteligente**:
  - Processo falhando 3x = CRÍTICO
  - IPC queue >100 = WARNING
  - CPU >90% por 5s = HIGH LOAD
- **Notificações Visuais**: Badges coloridos por severidade
- **Gerenciamento**: Limpar alertas individualmente

### 🎬 Modo Apresentação (Demo Mode)
Executa cenário automático em loop:
1. Captura de imagem
2. Simulação de falha no driver
3. Recovery Agent detecta e reinicia
4. Comunicação IPC entre processos
5. Log de sucesso

### 🔄 Recovery Agent
Sistema automático de recuperação de falhas:
- Detecta processos crashados
- Aguarda 2 segundos
- Reinicia o processo automaticamente
- Log completo de todas as etapas

### 📥 Exportação de Dados
Exporta relatório completo em JSON contendo:
- Processos e seus estados
- Estatísticas do sistema
- Alertas ativos
- Estatísticas do microkernel
- Logs de eventos (últimos 20)
- Mensagens IPC (últimas 20)
- Galeria de imagens
- Timestamp da exportação

---

## 🚀 Tecnologias Utilizadas

### Frontend
- **React 18.3** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool ultrarrápido
- **Tailwind CSS** - Framework CSS utility-first

### UI Components
- **shadcn/ui** - Biblioteca de componentes
- **Radix UI** - Primitivos acessíveis
- **Lucide React** - Ícones modernos

### Estado & Dados
- **Zustand** - Gerenciamento de estado global
- **Recharts** - Biblioteca de gráficos

### Animações & UX
- **Framer Motion** - Animações fluidas
- **React Hot Toast** - Notificações elegantes

---

## 📦 Instalação

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Passos

```bash
# Clone o repositório
git clone <YOUR_GIT_URL>

# Entre no diretório
cd <YOUR_PROJECT_NAME>

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

---

## 🎮 Como Usar

### 1️⃣ Dashboard Principal
Visualize em tempo real:
- Estatísticas de sistema (processos, IPC, uptime, CPU)
- Tabela de processos ativos
- Feed de mensagens IPC
- Log de eventos do sistema

### 2️⃣ Simular Falha
- Clique em **"Simular Falha"** em qualquer processo
- O processo vai para estado "Crashed"
- Recovery Agent detecta e reinicia automaticamente
- Acompanhe todo o processo no log de eventos

### 3️⃣ Capturar Imagens
- **Captura Automática**: Clique em "Capturar Nova Imagem"
- **Upload Manual**: Clique em "Upload" e selecione arquivos
- **Editar Metadados**: Clique em uma imagem > "Editar Metadados"
- **Filtrar**: Use o dropdown para filtrar por status

### 4️⃣ Arquitetura
Aba **"Arquitetura"**:
- Visualize as 5 camadas do sistema
- Veja quais processos pertencem a cada camada
- Entenda o papel do IPC Hub como conector central

### 5️⃣ Sequência de Boot
Aba **"Boot"**:
- Clique em "Simular Boot"
- Acompanhe as 6 etapas da inicialização
- POST → Bootloader → Microkernel → Camada 2 → Camada 3 → Online

### 6️⃣ Gráficos
Aba **"Gráficos"**:
- **CPU Histórico**: Últimos 30 segundos de uso de CPU
- **IPC por Processo**: Volume de mensagens de cada processo
- **Timeline de Eventos**: Distribuição temporal de eventos

### 7️⃣ Modo Apresentação
- Clique em **"Modo Apresentação"** no topo
- Sistema executa cenário automático a cada 5 segundos
- Demonstra todo o ciclo de operação do AtlasOS
- Clique em **"Parar Apresentação"** para encerrar

### 8️⃣ Exportar Relatório
- Clique em **"Exportar Relatório"**
- Baixa arquivo JSON com todos os dados do sistema
- Útil para análise offline ou documentação

---

## 🏗️ Estrutura do Projeto

```
src/
├── components/
│   ├── Dashboard/
│   │   ├── Header.tsx              # Cabeçalho com logo e status
│   │   ├── StatsCard.tsx           # Cards de estatísticas
│   │   ├── ProcessTable.tsx        # Tabela de processos
│   │   ├── IPCMonitor.tsx          # Monitor de mensagens IPC
│   │   ├── EventLog.tsx            # Log de eventos
│   │   ├── ImageGallery.tsx        # Galeria de imagens
│   │   ├── MicrokernelSection.tsx  # Seção do microkernel
│   │   ├── ArchitectureDiagram.tsx # Diagrama de arquitetura
│   │   ├── BootSequence.tsx        # Sequência de boot
│   │   ├── SystemCharts.tsx        # Gráficos do sistema
│   │   ├── AlertsPanel.tsx         # Painel de alertas
│   │   ├── DemoMode.tsx            # Modo apresentação
│   │   └── ExportData.tsx          # Exportação de dados
│   └── ui/                         # Componentes shadcn/ui
├── store/
│   └── dashboardStore.ts           # Estado global (Zustand)
├── types/
│   └── dashboard.ts                # Tipos TypeScript
├── pages/
│   ├── Index.tsx                   # Página principal
│   └── NotFound.tsx                # Página 404
├── index.css                       # Estilos globais
└── main.tsx                        # Entry point
```

---

## 🎨 Design System

### Paleta de Cores

```css
/* Background */
--background: #0a0e27

/* Cards */
--card: rgba(30, 41, 59, 0.8)

/* Cores Principais */
--primary: #3b82f6      /* Azul */
--success: #10b981      /* Verde */
--warning: #f59e0b      /* Amarelo */
--critical: #ef4444     /* Vermelho */

/* Prioridades */
--P1: #dc2626           /* Crítica - Vermelho */
--P2: #f59e0b           /* Alta - Amarelo */
--P3: #3b82f6           /* Média - Azul */
--P4: #8b5cf6           /* Baixa - Roxo */

/* IPC */
--ipc: #f97316          /* Laranja */
```

### Efeitos Visuais
- **Backdrop Blur**: Efeito de vidro fosco nos cards
- **Glow Effects**: Brilho em elementos importantes
- **Animações**: Fade-in, slide, pulse, scale
- **Transitions**: Suaves (0.3s ease-out)

---

## 🧠 Conceitos Demonstrados

### Microkernel vs Monolítico
- **Microkernel**: Apenas funcionalidades essenciais no kernel
- **Isolamento**: Processos rodam em espaços de memória separados
- **IPC**: Comunicação através de mensagens
- **Resiliência**: Falha de um processo não derruba o sistema

### Prioridades de Processos
- **P1 (Crítica)**: Controle de Voo - nunca pode falhar
- **P2 (Alta)**: Navegação IA - prioridade elevada
- **P3 (Média)**: Drivers e serviços - operação normal
- **P4 (Baixa)**: Aplicações - podem esperar

### Recovery Agent
Sistema de recuperação automática:
1. Monitora estado de todos os processos
2. Detecta falhas (estado "Crashed")
3. Aguarda tempo de segurança (2s)
4. Reinicia processo com novo contexto
5. Verifica integridade após reinício

### IPC (Inter-Process Communication)
Mensagens entre processos:
- **Tipos**: READ_DATA, WRITE_FILE, COMPUTE, SYNC, REQUEST
- **Formato**: `[timestamp] From → To (type)`
- **Hub Central**: IPC Hub gerencia todas as mensagens
- **Assíncrono**: Não bloqueia remetente

---

## 📊 Funcionalidades em Tempo Real

### Simulação de Dados
O sistema simula dados realistas a cada 2 segundos:
- **CPU**: Varia entre 5-90% por processo
- **Estados**: Alterna entre Running e Waiting
- **IPC**: Gera 0-3 mensagens aleatórias
- **Eventos**: 5% de chance de evento do sistema
- **Alertas**: Baseados em thresholds (CPU, IPC, falhas)

### Detecção Automática
- **Falhas Repetidas**: 3 falhas = alerta crítico
- **Alta Carga**: CPU >90% por 5s = alerta
- **Fila IPC**: >100 mensagens = warning
- **Uptime**: Contador contínuo sem reset

---

## 🔧 Customização

### Adicionar Novos Processos
Edite `src/store/dashboardStore.ts`:

```typescript
const initialProcesses: Process[] = [
  // ... processos existentes
  {
    id: "11",
    name: "Meu Novo Processo",
    priority: "P3",
    state: "Running",
    cpu: 25,
    layer: 2
  },
];
```

### Criar Novos Tipos de IPC
Edite `src/pages/Index.tsx`:

```typescript
const types = [
  "READ_DATA", 
  "WRITE_FILE", 
  "COMPUTE", 
  "SYNC", 
  "REQUEST",
  "MEU_NOVO_TIPO" // Adicione aqui
];
```

### Ajustar Timers
```typescript
// Intervalo de simulação (padrão: 2000ms)
setInterval(() => { ... }, 2000);

// Delay do Recovery Agent (padrão: 2000ms)
setTimeout(() => { ... }, 2000);

// Delay de reinício (padrão: 1500ms)
setTimeout(() => { ... }, 1500);
```

---

## 🧪 Testes

### Testar Recovery Agent
1. Clique em "Simular Falha" em qualquer processo
2. Observe o processo entrar em estado "Crashed"
3. Aguarde 2 segundos
4. Recovery Agent detecta falha
5. Processo reinicia automaticamente
6. Verifique log de eventos para confirmação

### Testar Alertas
1. Simule 3 falhas no mesmo processo → Alerta CRÍTICO
2. Aguarde CPU atingir >90% → Alerta HIGH LOAD
3. Monitore IPC queue → Alerta WARNING se >100

### Testar Modo Demo
1. Ative "Modo Apresentação"
2. Observe sequência automática:
   - Captura de imagem (0s)
   - Falha de driver (5s)
   - Mensagem IPC (10s)
   - Log de sucesso (15s)
   - Loop reinicia (20s)

---

## 📱 Responsividade

O dashboard é totalmente responsivo:
- **Desktop** (1920px+): Layout completo com 3 colunas
- **Tablet** (768px-1919px): Layout 2 colunas
- **Mobile** (320px-767px): Layout stacked vertical

### Breakpoints Tailwind
```css
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

---

## 🚀 Deploy

### Build de Produção
```bash
npm run build
```

### Preview do Build
```bash
npm run preview
```

### Deploy Automático (Lovable)
1. Clique em **"Publish"** no canto superior direito
2. Clique em **"Update"** para publicar frontend
3. Backend (se houver) é deployado automaticamente

### Custom Domain
1. Vá em **Project > Settings > Domains**
2. Clique em **"Connect Domain"**
3. Siga instruções de configuração DNS
4. Aguarde propagação (até 48h)

---

## 🐛 Troubleshooting

### Processos não atualizam
**Problema**: CPU e estados não mudam
**Solução**: Verifique se o `useEffect` está rodando (console.log no interval)

### IPC não aparece
**Problema**: Feed de mensagens vazio
**Solução**: Verifique se há processos ativos (mínimo 2 para IPC)

### Imagens não carregam
**Problema**: Placeholders não aparecem
**Solução**: Verifique URLs das imagens no Unsplash ou use upload manual

### Alertas duplicados
**Problema**: Múltiplos alertas iguais
**Solução**: Limite de 10 alertas implementado (FIFO)

### Build falha
**Problema**: Erro de TypeScript
**Solução**: Execute `npm run build` e veja erros específicos

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Add: MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### Guidelines
- Use TypeScript para type safety
- Siga as convenções de código existentes
- Adicione comentários para lógica complexa
- Teste todas as mudanças localmente
- Mantenha commits atômicos e descritivos

---

## 📄 Licença

Este projeto é open-source e está disponível sob a licença MIT.

---

## 👨‍💻 Autor

Desenvolvido com ❤️ usando [Lovable](https://lovable.dev)

---

## 🌐 Links Úteis

- **Documentação Lovable**: [docs.lovable.dev](https://docs.lovable.dev)
- **Recharts**: [recharts.org](https://recharts.org)
- **Tailwind CSS**: [tailwindcss.com](https://tailwindcss.com)
- **Framer Motion**: [framer.com/motion](https://www.framer.com/motion)
- **shadcn/ui**: [ui.shadcn.com](https://ui.shadcn.com)

---

## 📝 Notas Finais

Este projeto é uma demonstração educacional de conceitos de sistemas operacionais. Ele simula comportamento de microkernel para fins didáticos e não deve ser usado como sistema operacional real.

**Características simuladas**:
- ✅ Isolamento de processos
- ✅ Comunicação IPC
- ✅ Recovery de falhas
- ✅ Priorização de tarefas
- ✅ Gerenciamento de recursos

**Enjoy exploring AtlasOS!** 🚀🛰️

---

*README gerado para o projeto AtlasOS Dashboard v1.0*

# AtlasOS - Framework de Arquitetura Microkernel

## 📋 Visão Geral

Este documento descreve o framework arquitetural do **AtlasOS**, um sistema operacional microkernel projetado para sondas espaciais com requisitos de alta confiabilidade, isolamento de falhas e recuperação automática.

**Missão:** Exploração do cometa interestelar **3I/ATLAS** - um visitante de fora do Sistema Solar, capturando imagens científicas e analisando sua composição única para compreender a formação de sistemas planetários distantes.

---

## 🌌 Sobre o Cometa 3I/ATLAS

- **Nome:** 3I/ATLAS (terceiro objeto interestelar confirmado)
- **Origem:** Exterior do Sistema Solar (objeto interestelar)
- **Características:**
  - Composição química única (elementos não encontrados em cometas locais)
  - Trajetória hiperbólica (passa uma única vez pelo Sistema Solar)
  - Núcleo ativo com coma (cauda) de gás e poeira
  - Oportunidade científica rara (janela de observação limitada)
  - Velocidade: ~30 km/s em relação ao Sol
  - Descoberto por: Asteroid Terrestrial-impact Last Alert System (ATLAS)

---

## 🏗️ Estrutura em Camadas

### **Camada 0: Hardware**

- **CPU** (Resistente a radiação)
- **NPU** (Processamento de IA)
- **Propulsores** (Controle de trajetória e aproximação do cometa)
- **Câmera** (Captura de imagens do núcleo e coma do cometa)
- **Flash** (Armazenamento persistente)
- **Timer/Watchdog** (Monitoramento e temporização)

### **Camada 1: Microkernel (Modo Kernel)**

Componentes mínimos no espaço privilegiado:

- **Escalonador**: Preemptivo por prioridade (P1 > P2 > P3 > P4)
- **IPC**: Comunicação entre processos via mensagens
- **MMU**: Proteção e isolamento de memória
- **Tratamento IRQ**: Gerenciamento de interrupções de hardware

### **Camada 2: Serviços Essenciais (Modo Usuário)**

Serviços base isolados do kernel:

- **Driver Câmera** (P3) - Isolado, pode falhar sem derrubar sistema
- **Driver NPU** (P3) - Isolado, interface com hardware IA
- **Gerência Memória** - Alocação de memória para processos
- **Gerência Arquivos** (P3) - Sistema de arquivos sobre Flash
- **Gerência Dispositivos** - Gerenciamento de drivers isolados
- **Recovery Agent** - Auto-cura e reinício de processos travados

### **Camada 3: Serviços de Missão (Modo Usuário)**

Serviços específicos da missão espacial:

- **Controle de Voo** (P1 - Crítica, Tempo Real) - Navegação e estabilização durante aproximação do cometa
- **Navegação IA** (P2 - Alta) - Processamento via NPU, rastreamento da trajetória do cometa
- **Comunicação DSN** - Interface com Deep Space Network (Terra)
- **Gerência Energia** - Otimização de consumo energético durante a missão

### **Camada 4: Aplicações Científicas (Modo Usuário)**

Aplicações de pesquisa com menor prioridade:

- **Analisar Composição** (P4 - Baixa) - Análise espectroscópica do núcleo e coma do cometa
- **Outros Apps Científicos** (P4) - Estudos de temperatura, densidade, velocidade de ejeção de gases

---

## 🔗 Modelo de Comunicação

### **Princípio Hub-and-Spoke (IPC Central)**

Todos os processos em modo usuário comunicam-se **exclusivamente** através do IPC:

#### **Camada 4 (Aplicações) ↔ IPC:**

- ✅ Analisar Composição ↔ IPC (seta laranja curvada)
- ✅ Outros Apps Científicos ↔ IPC (seta laranja curvada)

#### **Camada 3 (Serviços Missão) ↔ IPC:**

- ✅ Controle de Voo ↔ IPC
- ✅ Navegação IA ↔ IPC
- ✅ Comunicação DSN ↔ IPC
- ✅ Gerência Energia ↔ IPC

#### **Camada 2 (Serviços Essenciais) ↔ IPC:**

- ✅ Driver Câmera ↔ IPC (tracejado - isolado)
- ✅ Driver NPU ↔ IPC (tracejado - isolado)
- ✅ Gerência Memória ↔ IPC
- ✅ Gerência Arquivos ↔ IPC (tracejado)
- ✅ Gerência Dispositivos ↔ IPC (tracejado)
- ✅ Recovery Agent ↔ IPC

#### **Camada 1 (Microkernel) ↔ Hardware:**

- ✅ Escalonador → CPU (controle direto)
- ✅ MMU → CPU (proteção de memória)
- ✅ Tratamento IRQ → Timer/Watchdog

#### **Drivers ↔ Hardware (via syscalls):**

- ✅ Driver Câmera → Câmera (seta cinza tracejada)
- ✅ Driver NPU → NPU (seta cinza tracejada)

## 🗺️ Mapeamento Código ⇄ Diagrama

Abaixo está um mapeamento prático entre os blocos do diagrama e os arquivos/implementações nos repositórios `TrabalhoOS` (simulador Python) e `atlas-kernel-vision` (visualização + servidor simulado).

- CAMADA 0 — Hardware

  - TrabalhoOS: `drivers/camera.py`, `drivers/npu.py` (simulam dispositivos)
  - atlas-kernel-vision (server): `server/src/microkernel/Hardware.ts` (simula IRQs, imagens e exposição de dados)

- CAMADA 1 — Microkernel (Kernel)

  - TrabalhoOS: `kernel/scheduler.py`, `kernel/ipc.py`, `kernel/mmu.py`, `kernel/irq.py` (implementam escalonador, IPC hub, MMU e tratamento de IRQ)
  - atlas-kernel-vision (server): `server/src/microkernel/Scheduler.ts`, `server/src/microkernel/IPC.ts`, `server/src/microkernel/RecoveryAgent.ts`, `server/src/microkernel/Hardware.ts`

- CAMADA 2 — Serviços Essenciais

  - TrabalhoOS: `drivers/` (driver_camera, driver_npu), `services/` (recovery.py, outros gerenciadores de dispositivo/memória)
  - atlas-kernel-vision (server): processos simulados em `server/src/index.ts` (nomes como `driver_camera`, `driver_npu`, `servidor_gerencia_memoria`, `recovery_agent`)

- CAMADA 3 — Serviços de Missão

  - TrabalhoOS: `services/flight_control.py`, `services/navigation.py` (controle de voo e navegação IA)
  - atlas-kernel-vision (server): processos `servico_controle_voo`, `servico_navegacao_ia` criados em `server/src/index.ts`

- CAMADA 4 — Aplicações Científicas

  - TrabalhoOS: `apps/composition.py` (app de análise de composição)
  - atlas-kernel-vision (server): `app_analisar_composicao` (simulado no servidor)

- Frontend / Observabilidade
  - atlas-kernel-vision (frontend):
    - `src/hooks/useKernelWebSocket.ts` — conecta ao servidor WebSocket e normaliza `STATE_UPDATE` para a UI
    - `src/store/dashboardStore.ts` — armazena o `SystemState` e dados de processos/IPCs/eventos
    - `src/components/*` — visuais: `ProcessTable`, `IPCMonitor`, `EventLog`, `ArchitectureDiagram`, etc.
    - `src/types.ts` e `src/types/dashboard.ts` — tipos compartilhados (`Process`, `IPCMessage`, `SystemState`)

Observação: o servidor simulado (`server/src/index.ts`) envia periodicamente um `STATE_UPDATE` contendo `processes`, `ipcMessages`, `events`, `cometImages` e um pequeno objeto `mmu` (métricas) — este payload mapeia diretamente para as visualizações no frontend.

- ✅ Gerência Arquivos → Flash (seta cinza)

---

## 🎯 Características Principais

### **1. Isolamento de Falhas**

- Drivers isolados em modo usuário (tracejado visual)
- Falha em driver **não** derruba o kernel
- MMU garante proteção de memória entre processos

### **2. Recuperação Automática (Auto-cura)**

- Recovery Agent monitora todos os processos via IPC
- Detecta travamentos e reinicia processos automaticamente
- Conexão especial verde "reinicia" para drivers

### **3. Escalonamento por Prioridade**

- **P1 (Crítica)**: Controle de Voo - tempo real (essencial durante aproximação do cometa)
- **P2 (Alta)**: Navegação IA - processamento intensivo (rastreamento da trajetória)
- **P3 (Média)**: Drivers e gerenciamento
- **P4 (Baixa)**: Aplicações científicas (análise de composição)
- Priority Inheritance para mitigar inversão de prioridade

### **4. Segurança por Design**

- IPC como único mecanismo de comunicação
- Hardware acessível apenas via kernel ou drivers autorizados
- Isolamento total entre processos usuário

### **5. Organização Visual**

- Setas curvas evitam sobreposição visual
- Hierarquia clara: fluxo de comunicação de cima para baixo
- Cores indicam prioridade e tipo de componente

---

## 📊 Validação Arquitetural

### ✅ **Conformidade com Microkernel:**

- Modo Kernel: Apenas Escalonador, IPC, MMU, Tratamento IRQ
- Modo Usuário: Todas as camadas 2, 3 e 4
- IPC obrigatório para comunicação entre processos
- Hardware protegido: acesso apenas via kernel

### ✅ **Pontos Fortes:**

1. Hub-and-spoke correto: IPC conecta **TODOS** os processos usuário
2. Isolamento visual: drivers tracejados mostram isolamento
3. Hierarquia clara: comunicação estruturada em camadas
4. Recovery Agent: monitoramento e auto-cura
5. Design limpo: setas curvas evitam sobreposição

---

## 🚀 Fluxo de Boot

```
1. Hardware POST (Power-On Self-Test)
2. Bootloader carrega Microkernel
3. Microkernel inicializa (Escalonador, IPC, MMU, IRQ)
4. Camada 2: Serviços Essenciais (drivers, gerenciadores)
5. Camada 3: Serviços de Missão
6. Camada 4: Aplicações Científicas (sob demanda)
```

---

## 📝 Exemplo: Fluxo de Interrupção (Câmera capturando o cometa)

```
1. Câmera captura imagem do núcleo do cometa → gera IRQ
2. Tratamento IRQ (kernel) recebe interrupção
3. Kernel → cria mensagem IPC
4. IPC → encaminha para driver_camera (modo usuário)
5. Driver processa imagem (ajuste de brilho da coma) → envia mensagem via IPC
6. IPC → encaminha para servidor_arquivos
7. Servidor salva imagem no Flash (assíncrono): "3I_ATLAS_nucleus_001.jpg"
```

**Nota:** Todo acesso a hardware passa pelo kernel, garantindo isolamento e segurança.

---

## 🌟 Missão Científica: Exploração do 3I/ATLAS

### **Objetivos da Sonda:**

1. **📸 Imageamento de Alta Resolução:**

   - Capturar imagens detalhadas do núcleo do cometa
   - Mapear a coma (nuvem de gás e poeira)
   - Estudar jatos de ejeção de material

2. **🔬 Análise de Composição:**

   - Espectroscopia para identificar elementos químicos
   - Detectar moléculas orgânicas (origem da vida?)
   - Comparar com cometas do Sistema Solar

3. **🧭 Navegação Autônoma:**

   - Rastreamento da trajetória hiperbólica do cometa
   - Ajuste de órbita para aproximação segura
   - Evitar colisões com detritos da coma

4. **📡 Transmissão para Terra:**
   - Enviar imagens científicas (janela de comunicação limitada)
   - Relatórios de composição química
   - Dados de telemetria da sonda

---

## 🎬 Cenário: Um Dia Típico da Missão

```
🕐 00:00 - Sonda aproxima-se do cometa 3I/ATLAS (150.000 km)
          └─ Controle de Voo (P1) mantém trajetória estável

🕑 02:00 - Navegação IA detecta jato de gás ativo na coma
          └─ Planeja sequência de fotos para 06:00

🕕 06:00 - Câmera captura imagem do núcleo (resolução 10m/pixel)
          ├─ Driver Câmera: IRQ → IPC → Gerência Arquivos
          ├─ Salva: "3I_ATLAS_nucleus_042.jpg" no Flash
          └─ Status: "Pendente análise espectroscópica"

🕗 08:00 - App "Analisar Composição" processa imagem
          ├─ NPU identifica: água (H₂O), metano (CH₄), amônia (NH₃)
          ├─ Detecta: moléculas orgânicas complexas! 🎉
          └─ Gera relatório: "Composição difere de cometas do Sistema Solar"

🕙 10:00 - 💥 FALHA! Driver NPU trava (radiação cósmica)
          ├─ Recovery Agent detecta em 3 segundos
          ├─ Reinicia driver automaticamente
          └─ Análise retomada do último checkpoint

🕛 12:00 - Comunicação DSN com Terra (janela de 2 horas)
          ├─ Envia: 3I_ATLAS_nucleus_042.jpg (comprimida)
          ├─ Envia: relatório de moléculas orgânicas
          ├─ Recebe: "Descoberta incrível! Continue monitorando 3I/ATLAS"
          └─ Terra solicita: "Fotografar polo sul do núcleo"

🕐 14:00 - Gerência Energia avalia recursos:
          ├─ Bateria: 55% (painéis solares operando)
          ├─ Prioridade: manter Controle de Voo (P1) e Navegação (P2)
          └─ Apps científicos (P4): executam quando sobra energia

🕓 16:00 - Navegação IA calcula nova manobra
          ├─ Objetivo: sobrevoo do polo sul do cometa
          ├─ Propulsores ativados: ajuste de +15 m/s
          └─ ETA polo sul: 8 horas

🕘 00:00 - Missão entra em modo "Deep Sleep"
          ├─ Apenas Controle de Voo (P1) e Watchdog ativos
          ├─ Apps científicos suspensos (economia de energia)
          └─ Próximo despertar: 04:00 (sobrevoo do polo sul)
```

---

## 📚 Referências

- Tanenbaum, A. S. (2015). _Modern Operating Systems_
- Microkernel Architecture Principles
- QNX Neutrino RTOS (referência comercial de microkernel)
- MINIX 3 (microkernel acadêmico com auto-cura)
- NASA/ESA: Interstellar Object Studies (1I/'Oumuamua, 2I/Borisov, 3I/ATLAS)
- ATLAS Survey: Asteroid Terrestrial-impact Last Alert System

---

## 📖 Resumo Executivo

### **O que é o AtlasOS?**

O AtlasOS é um sistema operacional **microkernel** desenvolvido para sondas espaciais. Diferente de sistemas monolíticos (onde tudo roda no kernel), o microkernel mantém apenas o **mínimo essencial** no modo privilegiado, colocando drivers e serviços em **modo usuário isolado**.

**Missão específica:** Explorar o cometa interestelar **3I/ATLAS**, um visitante raro de fora do Sistema Solar, capturando imagens e analisando sua composição química única.

### **Por que microkernel para o espaço?**

🛡️ **Confiabilidade:** Se um driver falha, ele **não derruba o sistema inteiro**
🔄 **Auto-cura:** O Recovery Agent detecta falhas e reinicia processos automaticamente
🔒 **Segurança:** Isolamento total entre processos via MMU
⚡ **Priorização:** Controle de voo (P1) sempre executa antes de apps científicos (P4)

### **Como funciona na prática?**

Imagine que a câmera da sonda captura o núcleo do cometa:

1. 📸 Câmera dispara uma interrupção (IRQ)
2. 🔔 Kernel recebe e cria uma mensagem IPC
3. 💬 IPC envia mensagem para o driver da câmera (modo usuário)
4. 🔧 Driver processa e pede para salvar via IPC
5. 💾 Gerência de Arquivos salva no Flash: "3I_ATLAS_nucleus_042.jpg"
6. ✅ Tudo aconteceu sem que o kernel precise "saber" sobre câmeras ou arquivos!

### **Vantagens principais:**

✅ **Kernel minúsculo:** Apenas 4 componentes (Escalonador, IPC, MMU, IRQ)
✅ **Falhas isoladas:** Driver com bug não trava o sistema
✅ **Recuperação rápida:** Recovery Agent reinicia processos travados
✅ **Comunicação segura:** Todo processo passa pelo IPC (hub central)
✅ **Prioridade garantida:** Missão crítica sempre executa primeiro

### **Analogia simples:**

Pense no AtlasOS como um **gerente de projetos**:

- **Kernel (gerente):** Apenas delega tarefas e controla prioridades
- **IPC (secretária):** Recebe todas as mensagens e encaminha
- **Serviços (funcionários):** Cada um faz seu trabalho isolado
- **Recovery Agent (RH):** Se alguém trava, contrata um substituto

Se um "funcionário" (driver) falha, o "gerente" (kernel) continua funcionando e o "RH" (Recovery Agent) resolve o problema.

---

## 📊 Diagrama Arquitetural Simplificado

```
┌─────────────────────────────────────────────────────────────────┐
│  CAMADA 4: APLICAÇÕES CIENTÍFICAS (Modo Usuário)                │
│  ┌──────────────────┐         ┌──────────────────┐              │
│  │ Analisar         │         │ Outros Apps      │              │
│  │ Composição (P4)  │         │ Científicos (P4) │              │
│  └────────┬─────────┘         └────────┬─────────┘              │
└───────────┼────────────────────────────┼─────────────────────────┘
            │          ╔═══════╗          │
            └─────────▶║  IPC  ║◀─────────┘
                       ║ (Hub) ║
┌───────────┬──────────╚═══╤═══╝──────────┬──────────────────────┐
│           │              │               │                      │
│  CAMADA 3: SERVIÇOS DE MISSÃO (Modo Usuário)                   │
│  ┌────────▼────────┐  ┌─▼──────────┐  ┌─▼──────────┐  ┌───────▼────┐
│  │ Controle Voo    │  │ Navegação  │  │ Comunicação│  │ Gerência   │
│  │ (P1 - Crítica)  │  │ IA (P2)    │  │ DSN        │  │ Energia    │
│  └─────────────────┘  └────────────┘  └────────────┘  └────────────┘
└─────────────────────────────┼──────────────────────────────────────┘
                              │
                        ┌─────▼─────┐
                        │    IPC    │
                        └─────┬─────┘
┌─────────────────────────────┼──────────────────────────────────────┐
│  CAMADA 2: SERVIÇOS ESSENCIAIS (Modo Usuário)                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────┐│
│  │ Driver   │  │ Driver   │  │ Gerência │  │ Gerência │  │Recovery││
│  │ Câmera   │  │ NPU      │  │ Memória  │  │ Arquivos │  │ Agent  ││
│  │ (P3)     │  │ (P3)     │  │          │  │ (P3)     │  │(Auto-  ││
│  │[isolado] │  │[isolado] │  │          │  │          │  │ cura)  ││
│  └────┬─────┘  └────┬─────┘  └──────────┘  └────┬─────┘  └───┬────┘│
└───────┼─────────────┼────────────────────────────┼────────────┼─────┘
        │             │                            │            │
═══════════════════════════════════════════════════════════════════════
│  CAMADA 1: MICROKERNEL (Modo Kernel) - Apenas 4 componentes!      │
│  ┌──────────────┐  ┌─────────┐  ┌─────────┐  ┌──────────────┐    │
│  │ Escalonador  │  │   IPC   │  │   MMU   │  │ Tratamento   │    │
│  │ (Prioridade) │  │(Mensagens)│ │(Proteção)│ │     IRQ      │    │
│  └──────┬───────┘  └────┬────┘  └────┬────┘  └──────┬───────┘    │
═════════┼═══════════════╪═════════════╪═══════════════┼═════════════
         │               │             │               │
┌────────▼───────────────┼─────────────▼───────────────▼────────────┐
│  CAMADA 0: HARDWARE                                                │
│  ┌─────┐  ┌─────┐  ┌───────┐  ┌──────┐  ┌─────┐  ┌──────────┐   │
│  │ CPU │  │ NPU │  │Propul-│  │Câmera│  │Flash│  │Timer/    │   │
│  │     │  │(IA) │  │sores  │  │      │  │     │  │Watchdog  │   │
│  └─────┘  └─────┘  └───────┘  └──────┘  └─────┘  └──────────┘   │
└───────────────────────────────────────────────────────────────────┘

LEGENDA:
═══════  Fronteira Modo Kernel / Modo Usuário
───────  Comunicação via IPC (mensagens)
  IPC    Hub central de comunicação (única via entre processos)
[isolado] Driver pode falhar sem derrubar o sistema
  (P1)   Prioridade: P1=Crítica, P2=Alta, P3=Média, P4=Baixa
```

### **Fluxo de Mensagem (exemplo):**

```
App Científica (P4)  ──msg──▶  IPC  ──encaminha──▶  Driver Câmera (P3)
                                ▲                            │
                                │                            │
                                └────────msg resposta────────┘
```

**Tudo passa pelo IPC!** Sem comunicação direta entre processos.

---

## 🎓 Conclusão

O AtlasOS demonstra como a arquitetura **microkernel** é ideal para ambientes críticos como missões espaciais. Ao manter o kernel mínimo e isolar serviços, o sistema garante:

- **Confiabilidade** máxima (falhas não propagam)
- **Recuperação** automática (auto-cura via Recovery Agent)
- **Segurança** por design (isolamento via MMU + IPC obrigatório)
- **Priorização** determinística (escalonador preemptivo)

Diferente de sistemas monolíticos onde um bug em qualquer driver pode travar tudo, o AtlasOS **continua operando** mesmo com falhas em componentes não-críticos, reiniciando-os transparentemente.

**Isso é essencial quando não há como "apertar Ctrl+Alt+Del" numa sonda explorando um cometa interestelar a milhões de quilômetros da Terra!** 🚀☄️

A missão ao cometa **3I/ATLAS** representa uma oportunidade única de estudar material de outro sistema estelar. Como o terceiro objeto interestelar confirmado (após 'Oumuamua e Borisov), o 3I/ATLAS oferece dados cruciais sobre a formação planetária em sistemas distantes. O AtlasOS garante que a sonda sobreviva e complete sua missão científica com sucesso, mesmo em condições extremas e imprevisíveis do espaço profundo, supervisionando continuamente o comportamento deste visitante cósmico raro.

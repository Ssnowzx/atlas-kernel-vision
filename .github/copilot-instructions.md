# Copilot / Instruções para agentes de IA do AtlasOS (TrabalhoOS)

Este documento fornece orientações objetivas e acionáveis para que um agente de IA de codificação seja imediatamente produtivo neste repositório. Registra padrões específicos do projeto, a arquitetura em alto nível, fluxos de trabalho de desenvolvedor e exemplos concretos de código.

Fatos rápidos

- Linguagem: Python 3. (Sem empacotamento pesado; rode com `python3` ou em um virtualenv.)
- Entradas principais: `main.py` (boot modular), `atlasos_sim.py` (simulador interativo).
- Testes: `tests/` — implementados com `unittest` (havia um teste antigo em `pytest` que foi migrado).
- Diretórios-chave: `kernel/`, `drivers/`, `services/`, `apps/`, `tools/`, `tests/`.

Arquitetura geral

- Protótipo microkernel dividido em camadas 0..4 (veja o README). Componentes principais do kernel em `kernel/`:
  - `kernel/ipc.py`: IPC hub-and-spoke (callbacks síncronos). Use `ipc.register(name, callback)` e `ipc.send_message(sender, receiver, data)`.
  - `kernel/mmu.py`: MMU simulada simples. Chame `mmu.allocate(process_name, size_bytes)` no boot; use `mmu.check_access(process_name, address)` para checagens de proteção.
  - `kernel/irq.py`: registro de IRQs (mapeia irq_num -> handler). Dispositivos chamam `irq.trigger_irq(num, data)`.
  - `kernel/scheduler.py`: escalonador simulado com loop em background que re-enfileira objetos `Process`. Observação: preempção é simulada (não é preempção forçada por threads).

Serviços e drivers

- Serviços ficam em `services/` e se registram no IPC no construtor (`__init__`), ex.: `ipc.register('FileSystem', self.receive_message)`.
- Drivers ficam em `drivers/` e seguem o mesmo padrão de registro (Camera, NPU, Propulsion).
- Assinatura típica de handlers: `def receive_message(self, msg):` onde `msg` é `kernel.ipc.Message` com `.sender`, `.receiver`, `.data`.

Padrões e convenções (fragmentos copiáveis)

- Registrar um processo no IPC:
  ipc.register('MyService', self.receive_message)

- Enviar mensagem (entrega síncrona se receiver registrado):
  ipc.send_message('SenderName', 'ReceiverName', {'action': 'do', ...})

- Registrar handler de IRQ no boot (em `main.py`):
  irq_handler.register_irq(3, lambda data: ipc.send_message('IRQ','CameraDriver', data or {}), 'Camera')

- Alocação MMU no boot (em `main.py`):
  mmu.allocate('CameraDriver', 0x0800) # tamanho em bytes

- Padrão de restart do RecoveryAgent (recriar serviços):
  recovery.register_restart_hook('CameraDriver', lambda: scheduler.add_process(Process('CameraDriver', 3, CameraDriver(ipc).run)))

Fluxos e comandos importantes

- Rodar o boot (não interativo):
  python3 main.py

- Rodar o simulador interativo:
  python3 atlasos_sim.py

- Rodar os testes unitários/integrados (unittest):
  python3 -m unittest discover -v tests

Notas sobre testes e ambiente

- O código contém testes em `unittest` e havia um teste antigo com `pytest`; `pytest` é opcional. A pipeline de desenvolvimento atual usa `unittest`.
- Ao adicionar testes, coloque-os em `tests/` e siga o padrão existente: criar `IPC()`, instanciar diretamente serviços/drivers e validar o fluxo IPC síncrono.

Pontos de integração que o agente deve respeitar

- Efeitos colaterais do IPC: `ipc.register` sobrescreve a entrada para um nome. Ao recriar um serviço, confirme que sobrescrever é esperado.
- Restart hooks: `RecoveryAgent` espera hooks que recriem e enfileirem um processo via `Scheduler.add_process(Process(name, priority, instance.run))`.
- MMU: serviços e testes chamam `mmu.allocate(name, bytes)` no boot. Se um patch introduzir um novo processo que escreve no `FileSystem`, aloque uma região em `main.py` ou nos testes.

Arquivos para inspecionar primeiro (prioridade)

1. `kernel/ipc.py` — formato da mensagem e modelo de registro
2. `services/recovery.py` — loop de monitoramento e API de restart hooks
3. `kernel/scheduler.py` — como processos são enfileirados e escalonados (loop em background)
4. `main.py` — ordem de boot, fábricas e registro de restart hooks
5. `services/filesystem.py` — como gravações e checagens MMU integram com IPC
6. `drivers/propulsion.py`, `drivers/camera.py` — exemplos de drivers e uso de IRQ
7. `tests/` — exemplos de como escrever testes de integração sem subir o boot completo

O que evitar / armadilhas

- Não presuma que `ipc.send_message` é assíncrono; ele chama o callback registrado de forma síncrona se presente. Os testes dependem desse comportamento.
- `IPC.register` sobrescreve registros; recriar serviços sobrescreverá handlers anteriores (comportamento intencional).
- A preempção do scheduler é simulada; não confie em preempção por threads.

Ao adicionar novos serviços ou drivers

- Crie a classe em `services/` ou `drivers/`, registre-a com `ipc.register('Name', self.receive_message)` no `__init__` e adicione `mmu.allocate` em `main.py` se ela escrever em áreas protegidas.
- Se o processo deve ser auto-reiniciado, adicione `recovery.monitor('Name')` e registre uma restart hook `recovery.register_restart_hook('Name', factory_hook)`.
- Para eventos de hardware que disparem IRQs, aceite `irq` no construtor e chame `irq.trigger_irq(num, data)` nos eventos.

Se você (o agente) alterar comportamentos

- Atualize `FRAMEWORK_CHANGE_LIST.md` e `README.md` para refletir a mudança e adicione/ajuste testes em `tests/`.
- Rode localmente:
  python3 -m unittest discover -v tests
  e verifique os logs para confirmar os fluxos IPC esperados.

Se algo não estiver claro

- Pergunte se devemos assumir preempção estrita (real) ou a preempção simulada atual. Pergunte também se o Energy Manager deve persistir telemetria histórica ou apenas agir como controlador — a implementação atual é minimalista.

---

Se estiver bom, posso adicionar um workflow GitHub Actions (`.github/workflows/ci.yml`) que execute os testes `unittest` em push/PR, e opcionalmente criar um `requirements.txt`. Deseja que eu adicione isso agora ou ajuste o documento (versão mais curta/detalhada)?

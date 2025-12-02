<!--
    FRAMEWORK_CHANGE_LIST.md
    Lista de mudanças sugeridas para tornar o código 1:1 com o diagrama FrameWork
    Gerado automaticamente a pedido do autor. Contém checklist, arquivos a alterar,
    comandos de teste e critérios de verificação.
-->

# Alterações necessárias para alinhar o código ao framework visual

Este documento lista, em ordem recomendada, as mudanças necessárias para que o
repositório `TrabalhoOS` fique alinhado com o diagrama `AtlasOS_Microkernel.drawio`.
Cada item tem um checklist mínimo, os arquivos prováveis a alterar, critérios de
validação e comandos úteis.

> Nota: os nomes de arquivos são sugestões baseadas na estrutura atual do repositório.
> Adapte conforme conveniência antes de aplicar patches.

---

## Visão geral das prioridades

- Alta (A): mudanças de funcionalidade imediata que tornam fluxos end‑to‑end funcionais.
- Média (M): melhorias arquiteturais que aumentam fidelidade ao diagrama.
- Baixa (B): refatorações maiores ou melhorias opcionais (p. ex. scheduler preemptivo).

---

## Checklist (passo-a-passo)

1. [A] Implementar `FileSystem` (Gerência de Arquivos) ✅ CONCLUÍDO

   - Objetivo: processar mensagens `{ action: 'save', filename, type }` enviadas pelo `CameraDriver`.
   - Arquivos a criar/editar:
     - `TrabalhoOS/services/filesystem.py` (nova)
     - `TrabalhoOS/main.py` — instanciar e registrar no `IPC`
   - Tarefas:
     - [ ] Criar classe `FileSystem(ipc)` com método `receive_message(msg)`.
     - [ ] Registrar `ipc.register('FileSystem', filesystem.receive_message)` no `main.py`.
     - [ ] Implementar armazenamento mínimo (em memória ou escrita em `data/metadata.json`).
   - Verificação:
     - Rodar `python3 TrabalhoOS/main.py` e chamar `CameraDriver.capture_image()` (manual ou via teste) e verificar log de `save` e ACK.

2. [A] Ligar `RecoveryAgent` a heartbeats e monitoramento ✅ CONCLUÍDO

   - Objetivo: RecoveryAgent deve monitorar processos e reiniciar instâncias travadas.
   - Arquivos a editar:
     - `TrabalhoOS/services/recovery.py` (ajustar APIs públicas)
     - `TrabalhoOS/main.py` (chamar `recovery_agent.monitor(process_name)` para cada processo)
     - drivers/services: enviar heartbeat via `ipc.send_message(sender, receiver='RecoveryAgent', data={'type':'heartbeat'})` em `run()` ou via tick
   - Tarefas:
     - [ ] Garantir `RecoveryAgent.monitor(name)` expõe `last_heartbeat` e `detect_failure` funciona.
     - [ ] Fazer cada serviço/driver enviar heartbeat periódico.
   - Verificação:
     - Forçar falha em `Driver` (simular `travar()`), aguardar timeout e verificar `RecoveryAgent.restart_process` é chamado.
     - Verificação adicional: `RecoveryAgent` agora registra hooks de reinício e executa um monitor em background que invoca o hook. Forçar `Driver.travar()` e validar que uma nova instância é criada e enfileirada no `Scheduler` (logs: "recreated and enqueued").

3. [M] Adicionar `PropulsionDriver` e ligar Propulsores via IRQ → IPC → Driver ✅ CONCLUÍDO

   - Objetivo: representar controle de propulsores no diagrama e no código.
   - Arquivos a criar/editar:
     - `TrabalhoOS/drivers/propulsion.py` (nova)
     - `TrabalhoOS/main.py` — instanciar `PropulsionDriver`, registrar no IPC e opcionalmente registrar IRQ
     - `TrabalhoOS/services/flight_control.py` — enviar comandos para `PropulsionDriver` via IPC
   - Tarefas:
     - [ ] Implementar `PropulsionDriver` com handlers `receive_message` para ações `{ action: 'burn'|'thrust'|'stop' }`.
     - [ ] Adicionar telemetria/heartbeat do thruster para `Gerência Energia` e `RecoveryAgent`.
   - Verificação:
     - `FlightControl` envia `burn` e `PropulsionDriver` responde com ACK e telemetria.

4. [M] Integrar `IRQHandler` ao fluxo hardware→kernel→IPC ✅ parcialmente (handlers registrados)

   - Objetivo: hardware (camera/propulsores) disparem IRQs que o kernel converte em mensagens IPC para drivers.
   - Arquivos a editar:
     - `TrabalhoOS/kernel/irq.py` (handler já existe; registrar handlers no boot)
     - `TrabalhoOS/main.py` — `irq.register_irq(irq_num, handler, device_name)`; handler chama `ipc.send_message('IRQ', receiver, data)`
     - drivers/hardware simulators (camera/proplusion) — chamar `irq.trigger_irq(...)`
   - Tarefas:
     - [ ] Mapear IRQ numbers para dispositivos (ex.: IRQ 5 = Propulsores, IRQ 3 = Câmera).
     - [ ] Implementar handler que converte IRQ em IPC msg.
   - Verificação:
     - Simular `irq.trigger_irq(irq_num, {...})` e verificar entrega IPC ao driver certo.

5. [M] Usar MMU ativamente (alocação/checagem)

   - Objetivo: alocar regiões de memória para processos e simular proteção (check_access).
   - Arquivos a editar:
     - `TrabalhoOS/main.py` — chamar `mmu.allocate(process_name, size_kb)` para cada processo
     - Operações sensíveis (FileSystem write) — chamar `mmu.check_access(process_name, address)` antes de permitir
   - Tarefas:
     - [ ] Padronizar unidade (usar bytes) e ajustar `kernel/mmu.py` docstrings se necessário.
     - [ ] Armazenar a base/size no objeto processo (quando aplicável).
   - Verificação:
     - Tentar simular acesso fora do range e verificar `MMU` retorna violação.

6. [B] Refatorar `Scheduler` para preemptividade e loop contínuo ✅ CONCLUÍDO (simulado)

   - Objetivo: implementar escalonador por prioridade com preempção, ticks e estados (`READY`, `RUNNING`, `BLOCKED`, `TRAVADO`).
   - Arquivos a editar:
     - `TrabalhoOS/kernel/scheduler.py` — reescrever `Scheduler` para loop/ticks
     - possivelmente ajustar `run()` das services para cooperarem com timeslices
   - Tarefas:
     - [ ] Escolher política de time-slice (p.ex. 100ms simulado) e implementar preempção quando processo de maior prioridade chega.
     - [ ] Adicionar re-enfileiramento e estados.
   - Verificação:
     - Testar que P1 interrompe P3 quando necessário e que prioridade é respeitada.

7. [B] Atualizar testes para integração ✅ ADICIONADOS (unittest)

   - Objetivo: testes unitários/integração cobrindo os novos fluxos.
   - Arquivos a criar/editar:
     - `TrabalhoOS/tests/test_filesystem.py` (novo)
     - `TrabalhoOS/tests/test_recovery.py` (novo)
     - atualizar `TrabalhoOS/tests/test_atlasos.py` para inclusão de novos módulos
   - Tarefas:
     - [ ] Escrever testes minimalistas que mockem `IPC` quando conveniente.
   - Verificação:
     - `pytest -q` passando em todos os testes adicionados.

8. [B] Documentar alterações e atualizar `README.md` / `FrameWork.md` ✅ CONCLUÍDO
   - Objetivo: refletir o estado atual de implementação no README e no diagrama (o que está implementado, o que é roadmap).
   - Tarefas:
     - [ ] Adicionar seção “Estado de implementação” em `README.md` com checklist.
     - [ ] Atualizar `FrameWork.md` para indicar features implementadas e pendentes.

---

## Comandos úteis para desenvolvimento e teste

Rodar demo (simulador interativo):

```bash
python3 /Users/snows/TrabalhoOS/atlasos_sim.py
```

Rodar boot modular (main):

```bash
python3 /Users/snows/TrabalhoOS/main.py
```

Rodar testes com pytest:

```bash
pytest -q /Users/snows/TrabalhoOS/tests
```

---

## Recomendações de execução incremental

- Comece pelas tarefas A (FileSystem, RecoveryAgent wiring) — são de baixo esforço e trazem grande valor.
- Em seguida implemente PropulsionDriver e integração IRQ (M).
- Finalize com MMU e, por último, refatore o Scheduler (B) — este último pode alterar muitas APIs e deve ser tratado com cuidado e testes.

---

## Como reproduzir mudanças localmente (exemplo)

1. Criar branch: `git checkout -b feat/filesystem-recovery`
2. Implementar `services/filesystem.py` e registrar no `main.py`.
3. Rodar `python3 main.py` e verificar logs.
4. Criar PR com descrição das mudanças e testes.

---

Se quiser, aplico os primeiros patches (FileSystem + RecoveryAgent wiring + PropulsionDriver stub) agora e rodo os testes locais; diga "aplique" e eu procedo.

---

## Estado atual após execução de teste

- Executei `python3 main.py` localmente e verifiquei: inicialização correta, `FileSystem` recebeu um `save` do `CameraDriver` e enviou ACK; `PropulsionDriver` registrou-se e enviou heartbeat; `RecoveryAgent` recebeu heartbeats de processos registrados.
- Próximo passo executado: adicionei um demo (no código) para que o `FlightControl` possa enviar um comando `burn` ao `PropulsionDriver` quando solicitado (veja `main.py` para o envio demo imediato após o boot).
- Atualização: `RecoveryAgent` foi estendido para executar um loop de monitoramento em background e suporta registro de "restart hooks". Quando um processo não envia heartbeat dentro do timeout, o hook registra uma nova instância do serviço/driver e a enfileira no `Scheduler` (procure logs com "recreated and enqueued").

---

## Próximos passos sugeridos

- [x] Implementar `Gerência Energia` para processar telemetria dos propulsores e gerenciar budget. ✅ CONCLUÍDO
- [ ] Ativar `MMU.allocate` no boot para cada processo (documentar unidades e usar `check_access`).
- [ ] Refatorar o `Scheduler` para loop/preempção (planejar e escrever testes antes).
- [x] Escrever testes de integração: `tests/test_filesystem.py`, `tests/test_recovery.py`, `tests/test_propulsion.py`. ✅ ADICIONADOS

---

## Plano imediato: alinhar o código ao framework da imagem (sprint 1)

Objetivo: garantir que o código represente fielmente o diagrama (hardware → kernel → IPC → drivers/services → storage) com checkpoints executáveis e testes mínimos.

Ordem e tarefas (prioridade alta → baixa):

1. [A] Finalizar FileSystem e persistência mínima (1-2 dias)

- Implementar escrita de metadados em `data/metadata.json` e API de listagem/remoção.
- Aceitação: `CameraDriver.capture_image()` cria entrada persistente em `data/metadata.json` e `FileSystem.list_files()` retorna o registro.
- Status: ✅ Implementado e testado com runner `tools/run_filesystem_check.py`.

2. [A] MMU: alocação no boot e checagens (0.5-1 dia) ✅ CONCLUÍDO

- No `main.py` chamei `mmu.allocate(process_name, size_bytes)` para cada processo; `kernel/mmu.py` agora usa bytes.
- `FileSystem` agora aceita `mmu` e realiza `check_access` antes de gravar; gravações negadas retornam erro via IPC.
- Aceitação: tentativa de escrita fora da região provoca log de violação e negação de operação.

3. [A] RecoveryAgent: auto‑restart efetivo (1 dia)

- Garantir `RecoveryAgent.restart_process(process_name)` reinicia a instância do processo (recria objeto ou chama `.reiniciar()` apropriado).
- Aceitação: forçar `Driver.travar()` e, após timeout, o processo volta ao estado `OCIOSO` ou é substituído por nova instância; logs mostram reinício.

4. [M] Gerência Energia (telemetria) (1-2 dias)

- Implementar `services/energy.py` que recebe telemetria dos propulsores e mantém budget simples.
- Aceitação: telemetria do `PropulsionDriver` atualiza estado de energia; se consumo exceder budget, `Gerência Energia` emite IPC para reduzir thrust.

5. [M] IRQ e Hardware simulators (0.5-1 dia)

- Fazer simuladores (camera/propulsion) chamar `irq.trigger_irq(...)` em eventos; o handler no boot converte para IPC.
- Aceitação: `irq.trigger_irq(3, {...})` resulta em mensagem entregue ao `CameraDriver` via IPC.

6. [M->B] Scheduler preemptivo (planejar, 2-4 dias)

- Projetar tick loop, re-enfileiramento e preempção; escrever testes antes da implementação.
- Aceitação: cenário de teste onde P1 interrompe P3 para cumprir deadline.

7. [B] Testes de integração e documentação (1-2 dias)

- Criar testes pytest para FileSystem, RecoveryAgent e Propulsion flow; documentar comandos no README.
- Aceitação: `pytest` roda e passa nos novos testes; README contém seção "Estado de implementação".

## Critérios de sucesso (definição de pronto)

- O diagrama e o código têm correspondência 1:1 nos fluxos principais: Camera→IRQ→IPC→CameraDriver→FileSystem e FlightControl→IPC→PropulsionDriver→telemetry→Energy.
- RecoveryAgent detecta e reinicia processos travados automaticamente.
- MMU bloqueia acessos fora do espaço alocado (simulado).
- Testes automatizados cobrem os fluxos acima e passam em CI local (ou com runner simples).

---

Se concordar com este plano, eu começo aplicando o próximo item (Finalizar FileSystem com persistência e teste rápido). Responda `comece filesystem` e eu aplico o patch, testo localmente e atualizo o checklist.

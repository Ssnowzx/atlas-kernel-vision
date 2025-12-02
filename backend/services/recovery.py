"""
Recovery Agent - Auto-cura e Reinício de Processos
Monitora falhas e reinicia processos automaticamente
"""

import time
import threading

class RecoveryAgent:
    def __init__(self, ipc):
        self.ipc = ipc
        self.monitored_processes = {}
        self.restart_count = {}
        # hooks: process_name -> callable that will recreate/enqueue the process
        self.restart_hooks = {}
        ipc.register("RecoveryAgent", self.receive_message)
        print("[SERVICE] Recovery Agent active (Auto-healing enabled)")
        # start background monitor thread
        self._monitor_thread = threading.Thread(target=self._monitor_loop, daemon=True)
        self._monitor_thread.start()
    
    def monitor(self, process_name: str):
        """Adiciona processo ao monitoramento"""
        self.monitored_processes[process_name] = {
            'status': 'running',
            'last_heartbeat': time.time()
        }
        print(f"  → Monitoring '{process_name}'")
    
    def detect_failure(self, process_name: str) -> bool:
        """Detecta se processo travou"""
        if process_name in self.monitored_processes:
            last_hb = self.monitored_processes[process_name]['last_heartbeat']
            if time.time() - last_hb > 3.0:  # 3 segundos timeout
                return True
        return False
    
    def restart_process(self, process_name: str):
        """Reinicia processo travado"""
        print(f"🔄 Recovery Agent: Restarting '{process_name}'...")
        self.restart_count[process_name] = self.restart_count.get(process_name, 0) + 1
        print(f"   Restart count: {self.restart_count[process_name]}")
        # If a restart hook is registered, call it to recreate/enqueue the process
        hook = self.restart_hooks.get(process_name)
        if hook:
            try:
                hook()
                print(f"   Recovery Agent: Called restart hook for '{process_name}'")
            except Exception as e:
                print(f"   Recovery Agent: restart hook for '{process_name}' failed: {e}")
        else:
            # Notifica via IPC as fallback
            self.ipc.broadcast("RecoveryAgent", {
                'action': 'process_restarted',
                'process': process_name
            })

    def register_restart_hook(self, process_name: str, hook_callable):
        """Registra um hook (callable) que será executado para reiniciar um processo.

        O hook deve recriar a instância do serviço/driver e enfileirá-lo no `Scheduler`.
        """
        self.restart_hooks[process_name] = hook_callable
        print(f"  → Recovery Agent: restart hook registered for '{process_name}'")

    def _monitor_loop(self):
        """Thread que varre processos monitorados e reinicia os que expirarem heartbeats."""
        while True:
            try:
                for name in list(self.monitored_processes.keys()):
                    if self.detect_failure(name):
                        print(f"[Recovery] Detected failure for '{name}' (timeout)")
                        self.restart_process(name)
                        # reset last_heartbeat to avoid consecutive restarts
                        self.monitored_processes[name]['last_heartbeat'] = time.time()
                time.sleep(1.0)
            except Exception as e:
                print(f"[Recovery] Monitor loop error: {e}")
    
    def receive_message(self, msg):
        """Handler de mensagens IPC"""
        if msg.data.get('type') == 'heartbeat':
            process = msg.sender
            if process in self.monitored_processes:
                self.monitored_processes[process]['last_heartbeat'] = time.time()

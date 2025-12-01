"""
Escalonador Preemptivo por Prioridade
P1 (Crítica) > P2 (Alta) > P3 (Média) > P4 (Baixa)
"""

import heapq
import threading
import time
from typing import List

class Process:
    def __init__(self, name: str, priority: int, func):
        self.name = name
        self.priority = priority
        self.func = func
        self.state = "READY"

    def __lt__(self, other):
        # Menor número = maior prioridade
        return self.priority < other.priority


class Scheduler:
    def __init__(self):
        self.ready_queue = []
        self.current_process = None
        self._lock = threading.Lock()
        self._running = False
        print("[KERNEL] Scheduler initialized (Preemptive Priority - simulated loop)")

    def add_process(self, process: Process):
        with self._lock:
            heapq.heappush(self.ready_queue, process)
        print(f"  → Process '{process.name}' added (P{process.priority})")

    def _schedule_loop(self, tick_ms: int):
        print("\n[SCHEDULER] Starting scheduling loop...")
        while self._running:
            proc = None
            with self._lock:
                if self.ready_queue:
                    proc = heapq.heappop(self.ready_queue)
            if proc is None:
                time.sleep(tick_ms / 1000.0)
                continue

            self.current_process = proc
            try:
                print(f"\n⚙️  Executing: {proc.name} (Priority {proc.priority})")
                # call the process run method once (cooperative model)
                proc.func()
            except Exception as e:
                print(f"[SCHEDULER] Process {proc.name} crashed: {e}")

            # after execution, re-enqueue to simulate periodic processes
            # if process still considered runnable
            time.sleep(tick_ms / 1000.0)
            with self._lock:
                heapq.heappush(self.ready_queue, proc)

    def run(self, processes: List, tick_ms: int = 100):
        """Start the scheduler loop in background and register initial processes.

        This implementation simulates a cooperative/preemptive scheduler by
        repeatedly invoking each process's `run()` and re-enqueuing it. It
        runs in a background daemon thread so boot can continue.
        """
        for proc in processes:
            self.add_process(Process(
                name=proc.__class__.__name__,
                priority=proc.priority,
                func=proc.run
            ))

        self._running = True
        t = threading.Thread(target=self._schedule_loop, args=(tick_ms,), daemon=True)
        t.start()

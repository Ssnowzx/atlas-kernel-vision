"""Simple demo to verify RecoveryAgent restart hooks are called and enqueue a process.

This script creates IPC, Scheduler and RecoveryAgent, registers a restart hook
that creates a dummy process and enqueues it in the scheduler. Then it forces
`last_heartbeat` to an old timestamp so RecoveryAgent monitor thread triggers the restart.
"""
import time
import sys, os
# ensure repo root is on sys.path so imports like `kernel.*` resolve when running from tools/
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from kernel.ipc import IPC
from kernel.scheduler import Scheduler, Process
from services.recovery import RecoveryAgent

class DummyService:
    def __init__(self, ipc):
        self.ipc = ipc
        self.priority = 5
        ipc.register('DummyService', self.receive_message)
    def receive_message(self, msg):
        pass
    def run(self):
        print("[DummyService] Running restarted instance from RecoveryAgent hook")


def demo():
    ipc = IPC()
    scheduler = Scheduler()
    recovery = RecoveryAgent(ipc)

    # monitor a process name
    recovery.monitor('DummyService')

    # register restart hook: creates new DummyService and enqueues it
    def factory():
        return DummyService(ipc)

    def restart_hook():
        inst = factory()
        scheduler.add_process(Process('DummyService', inst.priority, inst.run))
        print("[Demo] Restart hook executed: DummyService recreated and enqueued")

    recovery.register_restart_hook('DummyService', restart_hook)

    # Simulate heartbeat timeout
    recovery.monitored_processes['DummyService']['last_heartbeat'] = time.time() - 10

    print("[Demo] Waiting for RecoveryAgent monitor to detect failure and call hook...")
    time.sleep(2.5)

    # Run scheduler to execute any enqueued processes
    scheduler.run([])

if __name__ == '__main__':
    demo()

import time
import unittest

from kernel.ipc import IPC
from kernel.scheduler import Scheduler, Process
from services.recovery import RecoveryAgent

class RecoveryIntegrationTest(unittest.TestCase):
    def test_restart_hook_called(self):
        ipc = IPC()
        scheduler = Scheduler()
        recovery = RecoveryAgent(ipc)

        # register dummy service monitoring
        recovery.monitor('DummyService')

        def factory():
            class Dummy:
                def __init__(self, ipc):
                    self.ipc = ipc
                    self.priority = 5
                    ipc.register('DummyService', self.receive_message)
                def receive_message(self, msg):
                    pass
                def run(self):
                    # simple action
                    return
            return Dummy(ipc)

        called = {'ran': False}
        def restart_hook():
            inst = factory()
            scheduler.add_process(Process('DummyService', inst.priority, inst.run))
            called['ran'] = True

        recovery.register_restart_hook('DummyService', restart_hook)
        # force heartbeat timeout
        recovery.monitored_processes['DummyService']['last_heartbeat'] = time.time() - 10
        # wait for monitor to pick up
        time.sleep(2)
        self.assertTrue(called['ran'])

if __name__ == '__main__':
    unittest.main()

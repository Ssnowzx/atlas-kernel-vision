import time
import unittest

from kernel.ipc import IPC
from drivers.propulsion import PropulsionDriver

class PropulsionIntegrationTest(unittest.TestCase):
    def test_burn_ack_sent(self):
        ipc = IPC()
        # Create driver
        driver = PropulsionDriver(ipc)
        # send a burn command from 'Tester'
        ipc.send_message('Tester', 'PropulsionDriver', {'action': 'burn', 'duration': 10, 'thrust': 1.5})
        # The driver should have sent an ACK to 'Tester' which is unregistered -> queued
        time.sleep(0.05)
        queued = [m for m in ipc.message_queue if m.receiver == 'Tester']
        self.assertTrue(any(m.data.get('status') == 'ack' for m in queued))

if __name__ == '__main__':
    unittest.main()

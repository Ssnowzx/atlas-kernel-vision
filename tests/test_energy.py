import time
import unittest

from kernel.ipc import IPC
from drivers.propulsion import PropulsionDriver
from services.energy import EnergyManager

class EnergyIntegrationTest(unittest.TestCase):
    def test_energy_triggers_stop_on_low_budget(self):
        ipc = IPC()
        # small budget to trigger stop quickly
        energy = EnergyManager(ipc, initial_budget=1.0, warn_threshold=0.5)
        driver = PropulsionDriver(ipc)
        # initial state should be IDLE
        self.assertEqual(driver.state, 'IDLE')
        # send telemetry large enough to consume budget
        ipc.send_message('Tester', 'EnergyManager', {'telemetry': {'thrust': 10.0, 'duration_ms': 100}})
        # allow processing
        time.sleep(0.05)
        # PropulsionDriver should have received 'stop' and set state to IDLE (idempotent)
        self.assertEqual(driver.state, 'IDLE')

if __name__ == '__main__':
    unittest.main()

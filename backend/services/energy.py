"""
Energy Manager - Monitora telemetria dos propulsores e gerencia budget simples

Comportamento mínimo:
- mantém um `budget` (unidades arbitrárias)
- recebe mensagens com `{'telemetry': {'thrust': float, 'duration_ms': int}}`
- consome energia = thrust * duration_ms * factor
- se o budget ficar abaixo de um limiar envia comando para o `PropulsionDriver`
  para reduzir/stop (via IPC)
"""

class EnergyManager:
    def __init__(self, ipc, initial_budget: float = 10000.0, warn_threshold: float = 0.2):
        self.ipc = ipc
        self.budget = float(initial_budget)
        self.warn_threshold = float(warn_threshold)
        ipc.register('EnergyManager', self.receive_message)
        print(f"[SERVICE] Energy Manager loaded (budget={self.budget})")

    def estimate_consumption(self, thrust: float, duration_ms: int) -> float:
        # factor chosen for simulation: thrust * duration_ms * 0.1
        return thrust * float(duration_ms) * 0.1

    def receive_message(self, msg):
        data = msg.data or {}
        telemetry = data.get('telemetry')
        if telemetry:
            thrust = float(telemetry.get('thrust', 0.0))
            duration_ms = int(telemetry.get('duration_ms', 0))
            consumed = self.estimate_consumption(thrust, duration_ms)
            self.budget -= consumed
            print(f"[Energy] Received telemetry: thrust={thrust}, duration_ms={duration_ms} -> consumed={consumed:.1f}; budget={self.budget:.1f}")

            # if budget below threshold, command propulsion to reduce/stop
            if self.budget <= 0 or (self.budget / (self.budget + consumed + 1e-9)) < self.warn_threshold:
                print("[Energy] Budget low: issuing stop to PropulsionDriver")
                # send stop command to PropulsionDriver
                self.ipc.send_message('EnergyManager', 'PropulsionDriver', {'action': 'stop', 'reason': 'energy_budget'})
                # optionally broadcast warning
                self.ipc.broadcast('EnergyManager', {'type': 'energy_warning', 'budget': self.budget})

    def get_budget(self):
        return self.budget

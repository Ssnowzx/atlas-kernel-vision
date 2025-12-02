"""
PropulsionDriver - controla os propulsores (thrusters)
Recebe comandos via IPC: { action: 'burn'|'thrust'|'stop', duration, thrust }
Envia telemetria e heartbeats para RecoveryAgent.
"""
import time

class PropulsionDriver:
    def __init__(self, ipc, irq=None, priority=3):
        self.ipc = ipc
        self.irq = irq
        self.priority = priority
        self.state = 'IDLE'
        ipc.register('PropulsionDriver', self.receive_message)
        print('[DRIVER] Propulsion Driver loaded (isolated, P3)')

    def receive_message(self, msg):
        data = msg.data or {}
        action = data.get('action')
        if action == 'burn' or action == 'thrust':
            duration = data.get('duration', 100)
            thrust = data.get('thrust', 1.0)
            self.perform_burn(duration, thrust)
            # ACK to sender
            self.ipc.send_message('PropulsionDriver', msg.sender, {'status': 'ack', 'action': action})
        elif action == 'stop':
            self.state = 'IDLE'
            self.ipc.send_message('PropulsionDriver', msg.sender, {'status': 'stopped'})

    def perform_burn(self, duration_ms, thrust):
        self.state = 'BURNING'
        print(f"🔥 Propulsion: performing burn for {duration_ms} ms at thrust {thrust}")
        # simulate short activity
        time.sleep(0.01)
        # send telemetry and heartbeat to RecoveryAgent
        self.ipc.send_message('PropulsionDriver', 'RecoveryAgent', {'type': 'heartbeat'})
        self.ipc.send_message('PropulsionDriver', 'RecoveryAgent', {'telemetry': {'thrust': thrust, 'duration_ms': duration_ms}})
        # send telemetry also to Energy Manager
        try:
            self.ipc.send_message('PropulsionDriver', 'EnergyManager', {'telemetry': {'thrust': thrust, 'duration_ms': duration_ms}})
        except Exception:
            pass
        # simulate hardware IRQ on burn complete
        if self.irq is not None:
            try:
                self.irq.trigger_irq(5, {'event': 'burn_complete', 'thrust': thrust, 'duration_ms': duration_ms})
            except Exception:
                pass

    def run(self):
        # periodic heartbeat for monitoring
        self.ipc.send_message('PropulsionDriver', 'RecoveryAgent', {'type': 'heartbeat'})
        print('  Propulsion Driver ready for commands...')

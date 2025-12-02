"""
Flight Control - Controle de Voo (P1 - Crítica, Tempo Real)
Navegação e estabilização durante aproximação do cometa 3I/ATLAS
"""

class FlightControl:
    def __init__(self, ipc, priority=1):
        self.ipc = ipc
        self.priority = priority
        self.distance_to_comet = 150000  # km
        ipc.register("FlightControl", self.receive_message)
        print("[SERVICE] Flight Control active (P1 - Critical Real-Time)")
    
    def maintain_trajectory(self):
        """Mantém trajetória estável durante aproximação"""
        print(f"🎯 Flight Control: Maintaining stable trajectory")
        print(f"   Distance to 3I/ATLAS: {self.distance_to_comet:,} km")
        print(f"   Status: Trajectory locked, thrusters nominal")
        
        # Broadcast status via IPC
        self.ipc.broadcast("FlightControl", {
            'distance': self.distance_to_comet,
            'status': 'stable'
        })
        # send heartbeat for monitoring
        self.ipc.send_message('FlightControl', 'RecoveryAgent', {'type': 'heartbeat'})
    
    def receive_message(self, msg):
        """Handler de mensagens IPC"""
        if msg.data.get('action') == 'adjust_course':
            delta_v = msg.data.get('delta_v', 0)
            print(f"🚀 Flight Control: Adjusting course by +{delta_v} m/s")
    
    def run(self):
        """Execução crítica do controle de voo"""
        self.maintain_trajectory()
        # also publish heartbeat
        self.ipc.send_message('FlightControl', 'RecoveryAgent', {'type': 'heartbeat'})

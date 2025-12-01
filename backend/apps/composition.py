"""
Composition Analyzer - Análise de Composição (P4 - Baixa)
Análise espectroscópica do núcleo e coma do cometa 3I/ATLAS
"""

class CompositionAnalyzer:
    def __init__(self, ipc, npu_driver, priority=4):
        self.ipc = ipc
        self.npu = npu_driver
        self.priority = priority
        ipc.register("CompositionAnalyzer", self.receive_message)
        print("[APP] Composition Analyzer loaded (P4 - Scientific)")
    
    def analyze(self, image_file: str):
        """Analisa composição química do cometa"""
        print(f"🔬 Analyzing composition of 3I/ATLAS from '{image_file}'...")
        
        # Solicita processamento via NPU
        self.ipc.send_message(
            sender="CompositionAnalyzer",
            receiver="NPUDriver",
            data={'action': 'process', 'task': 'composition_analysis'}
        )
        # heartbeat to RecoveryAgent to show activity
        self.ipc.send_message('CompositionAnalyzer', 'RecoveryAgent', {'type': 'heartbeat'})
    
    def receive_message(self, msg):
        """Handler de mensagens IPC"""
        if msg.sender == "NPUDriver" and 'result' in msg.data:
            result = msg.data['result']
            print(f"\n📊 Composition Analysis Results:")
            print(f"   Molecules detected: {result.get('molecules', [])}")
            print(f"   Organic compounds: {result.get('organics', 'none')}")
            print(f"   Comparison: {result.get('comparison', 'N/A')}")
    
    def run(self):
        """Execução da análise científica"""
        self.analyze("3I_ATLAS_nucleus_001.jpg")
        # periodic heartbeat
        self.ipc.send_message('CompositionAnalyzer', 'RecoveryAgent', {'type': 'heartbeat'})

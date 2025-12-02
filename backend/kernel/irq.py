"""
IRQ Handler - Tratamento de Interrupções de Hardware
"""

class IRQHandler:
    def __init__(self):
        self.irq_table = {}
        print("[KERNEL] IRQ Handler initialized")
    
    def register_irq(self, irq_num: int, handler, device_name: str):
        """Registra handler para IRQ específico"""
        self.irq_table[irq_num] = {
            'handler': handler,
            'device': device_name
        }
        print(f"  → IRQ {irq_num} registered for {device_name}")
    
    def trigger_irq(self, irq_num: int, data: dict = None):
        """Dispara interrupção de hardware"""
        if irq_num in self.irq_table:
            entry = self.irq_table[irq_num]
            print(f"⚡ IRQ {irq_num} triggered by {entry['device']}")
            entry['handler'](data or {})
        else:
            print(f"❌ Unhandled IRQ: {irq_num}")

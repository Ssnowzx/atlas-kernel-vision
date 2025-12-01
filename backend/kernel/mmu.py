"""
MMU - Memory Management Unit
Proteção e isolamento de memória entre processos
"""

class MMU:
    def __init__(self):
        self.memory_map = {}
        self.protected_regions = set()
        print("[KERNEL] MMU initialized (Memory Protection Active)")
    
    def allocate(self, process_name: str, size_bytes: int) -> int:
        """Aloca memória isolada para processo.

        size_bytes: tamanho em bytes.
        Retorna o endereço base simulado (int).
        """
        base_addr = len(self.memory_map) * 0x1000
        self.memory_map[process_name] = {
            'base': base_addr,
            'size': size_bytes,
            'protected': True
        }
        print(f"  → Allocated {size_bytes} bytes for '{process_name}' at 0x{base_addr:08X}")
        return base_addr
    
    def check_access(self, process_name: str, address: int) -> bool:
        """Verifica se processo pode acessar endereço"""
        if process_name not in self.memory_map:
            print(f"❌ MMU: Access violation by '{process_name}'")
            return False
        
        region = self.memory_map[process_name]
        if region['base'] <= address < region['base'] + region['size']:
            return True
        
        print(f"❌ MMU: Segmentation fault by '{process_name}' at 0x{address:08X}")
        return False

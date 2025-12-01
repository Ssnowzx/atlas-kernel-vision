"""
Camera Driver - Captura imagens do cometa 3I/ATLAS
Isolado em modo usuário (P3)
"""

class CameraDriver:
    def __init__(self, ipc, irq=None, priority=3):
        self.ipc = ipc
        self.irq = irq
        self.priority = priority
        self.image_count = 0
        ipc.register("CameraDriver", self.receive_message)
        print("[DRIVER] Camera Driver loaded (isolated, P3)")
    
    def capture_image(self):
        """Captura imagem do núcleo do cometa 3I/ATLAS"""
        self.image_count += 1
        filename = f"3I_ATLAS_nucleus_{self.image_count:03d}.jpg"
        print(f"📸 Camera: Captured image '{filename}' (nucleus of 3I/ATLAS)")
        
        # Envia via IPC para salvar
        self.ipc.send_message(
            sender="CameraDriver",
            receiver="FileSystem",
            data={
                'action': 'save',
                'filename': filename,
                'type': 'comet_nucleus_image'
            }
        )
        # Trigger a hardware IRQ to indicate capture (simulate hardware)
        if self.irq is not None:
            try:
                self.irq.trigger_irq(3, {'event': 'image_captured', 'filename': filename})
            except Exception:
                pass
        # send heartbeat to RecoveryAgent to indicate activity
        self.ipc.send_message('CameraDriver', 'RecoveryAgent', {'type': 'heartbeat'})
        return filename
    
    def receive_message(self, msg):
        """Handler de mensagens IPC"""
        if msg.data.get('action') == 'capture':
            self.capture_image()
    
    def run(self):
        """Execução do driver"""
        print("  Camera Driver monitoring 3I/ATLAS...")
        # perform capture and send heartbeat
        self.capture_image()
        self.ipc.send_message('CameraDriver', 'RecoveryAgent', {'type': 'heartbeat'})

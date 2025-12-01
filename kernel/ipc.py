"""
IPC - Inter-Process Communication (Hub-and-Spoke)
Todos os processos comunicam-se exclusivamente via IPC
"""

class Message:
    def __init__(self, sender: str, receiver: str, data: dict):
        self.sender = sender
        self.receiver = receiver
        self.data = data

class IPC:
    def __init__(self):
        self.message_queue = []
        self.registered_processes = {}
        print("[KERNEL] IPC Hub initialized (Hub-and-Spoke)")
    
    def register(self, process_name: str, callback):
        """Registra processo no hub IPC"""
        self.registered_processes[process_name] = callback
        print(f"  → Process '{process_name}' registered in IPC Hub")
    
    def send_message(self, sender: str, receiver: str, data: dict):
        """Envia mensagem via hub central"""
        msg = Message(sender, receiver, data)
        print(f"📨 IPC: {sender} → {receiver} | {data}")
        
        if receiver in self.registered_processes:
            self.registered_processes[receiver](msg)
        else:
            self.message_queue.append(msg)
    
    def broadcast(self, sender: str, data: dict):
        """Broadcast para todos os processos"""
        print(f"📢 IPC Broadcast from {sender}: {data}")
        for process_name, callback in self.registered_processes.items():
            if process_name != sender:
                callback(Message(sender, process_name, data))

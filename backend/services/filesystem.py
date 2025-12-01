"""
FileSystem - Gerência de Arquivos (Camada 2)
Recebe mensagens de `save` e armazena metadados em memória (stub).
"""
import os
import json

DATA_DIR = os.path.join(os.path.dirname(__file__), '..', 'data')
METADATA_PATH = os.path.join(DATA_DIR, 'metadata.json')


class FileSystem:
    def __init__(self, ipc, mmu=None):
        self.ipc = ipc
        self.mmu = mmu
        self.storage = []
        ipc.register('FileSystem', self.receive_message)
        self._load()
        print('[SERVICE] FileSystem loaded (handles save requests to Flash)')

    def _ensure_data_dir(self):
        # create data dir relative to repo if missing
        try:
            os.makedirs(DATA_DIR, exist_ok=True)
        except Exception:
            pass

    def _load(self):
        try:
            if os.path.exists(METADATA_PATH):
                with open(METADATA_PATH, 'r', encoding='utf-8') as f:
                    self.storage = json.load(f)
            else:
                self.storage = []
        except Exception:
            self.storage = []

    def _save(self):
        try:
            self._ensure_data_dir()
            with open(METADATA_PATH, 'w', encoding='utf-8') as f:
                json.dump(self.storage, f, indent=2)
        except Exception as e:
            print(f"[FileSystem] Error saving metadata: {e}")

    def receive_message(self, msg):
        data = msg.data or {}
        action = data.get('action')
        if action == 'save':
            filename = data.get('filename')
            ftype = data.get('type')

            # MMU check: if mmu provided, ensure sender can write
            if self.mmu is not None:
                if msg.sender not in self.mmu.memory_map:
                    print(f"[FileSystem] MMU: unknown process '{msg.sender}', denying save")
                    self.ipc.send_message('FileSystem', msg.sender, {'status': 'error', 'reason': 'no-mmu-region'})
                    return
                base = self.mmu.memory_map[msg.sender]['base']
                if not self.mmu.check_access(msg.sender, base):
                    print(f"[FileSystem] MMU: access denied for '{msg.sender}'")
                    self.ipc.send_message('FileSystem', msg.sender, {'status': 'error', 'reason': 'access-violation'})
                    return

            entry = {'filename': filename, 'type': ftype}
            self.storage.append(entry)
            self._save()
            print(f"[FileSystem] Saved metadata: {entry}")
            # respond back to sender with ACK
            self.ipc.send_message('FileSystem', msg.sender, {'status': 'ok', 'filename': filename})

    def list_files(self):
        return list(self.storage)

    def clear(self):
        self.storage = []
        self._save()

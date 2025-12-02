import os
import time
import unittest

from kernel.ipc import IPC
from kernel.mmu import MMU
from drivers.camera import CameraDriver
from services.filesystem import FileSystem

class FileSystemIntegrationTest(unittest.TestCase):
    def setUp(self):
        # ensure clean metadata
        data_dir = os.path.join(os.path.dirname(__file__), '..', 'data')
        metadata_path = os.path.join(data_dir, 'metadata.json')
        try:
            if os.path.exists(metadata_path):
                os.remove(metadata_path)
        except Exception:
            pass
        self.ipc = IPC()
        self.mmu = MMU()
        # allocate mmu region for CameraDriver so FileSystem accepts the save
        self.mmu.allocate('CameraDriver', 0x0800)
        self.fs = FileSystem(self.ipc, self.mmu)
        self.cam = CameraDriver(self.ipc)

    def test_camera_save_creates_metadata(self):
        filename = self.cam.capture_image()
        # allow filesystem to process
        time.sleep(0.1)
        files = self.fs.list_files()
        self.assertTrue(any(f['filename'] == filename for f in files))

if __name__ == '__main__':
    unittest.main()

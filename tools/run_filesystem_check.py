"""
Quick runner to validate FileSystem persistence via IPC.

Creates an IPC instance, registers FileSystem, sends a save message and checks
that `data/metadata.json` contains the entry.
"""
import os
import sys
import time
import json

# ensure repository root is on sys.path so 'kernel' and other packages are importable
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)

from kernel.ipc import IPC
from services.filesystem import FileSystem


def run_check():
    ipc = IPC()
    fs = FileSystem(ipc)

    # ensure clean state
    fs.clear()

    # send a save message through IPC
    test_filename = 'TEST_IMAGE_001.jpg'
    ipc.send_message('Tester', 'FileSystem', {'action': 'save', 'filename': test_filename, 'type': 'test_image'})

    # small sleep to let handler run (synchronous in this IPC impl)
    time.sleep(0.1)

    # verify file persisted
    data_dir = os.path.join(os.path.dirname(__file__), '..', 'data')
    metadata_path = os.path.join(data_dir, 'metadata.json')

    if not os.path.exists(metadata_path):
        print('FAIL: metadata.json not created')
        return 1

    with open(metadata_path, 'r', encoding='utf-8') as f:
        entries = json.load(f)

    if any(e.get('filename') == test_filename for e in entries):
        print('OK: FileSystem persisted metadata to', metadata_path)
        print(entries)
        return 0

    print('FAIL: entry not found in metadata.json')
    print(entries)
    return 2


if __name__ == '__main__':
    raise SystemExit(run_check())

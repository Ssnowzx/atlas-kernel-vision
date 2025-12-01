#!/usr/bin/env python3
"""
Pretty-tail for AtlasOS logs

Watches /tmp/atlasos-node.log and /tmp/atlasos-py.log and prints a colorized,
pretty JSON view for any JSON or Python-dict-like payloads found in the logs.

Usage:
  python3 tools/pretty_logs.py

This is lightweight (no extra pip deps) and falls back to printing raw lines
when payloads can't be parsed.
"""
import os
import time
import json
import ast
import sys
import errno
import selectors

NODE_LOG = '/tmp/atlasos-node.log'
PY_LOG = '/tmp/atlasos-py.log'

# ANSI colors
CLR_RESET = '\x1b[0m'
CLR_NODE = '\x1b[38;5;75m'      # blueish
CLR_PY = '\x1b[38;5;142m'       # greenish
CLR_TYPE = '\x1b[38;5;214m'     # orange for event types
CLR_KEYS = '\x1b[38;5;153m'     # teal for keys

sel = selectors.DefaultSelector()

def open_and_register(path, key):
    try:
        f = open(path, 'r', encoding='utf-8', errors='replace')
    except FileNotFoundError:
        # create empty file so tailing works
        open(path, 'a').close()
        f = open(path, 'r', encoding='utf-8', errors='replace')
    # seek to end
    f.seek(0, os.SEEK_END)
    sel.register(f, selectors.EVENT_READ, data=key)
    return f

def try_parse_payload(s):
    """Try to parse a JSON or Python-dict payload from string s.
    Returns (obj, parser) or (None, None)
    parser is 'json' or 'py'.
    """
    # find first { and last }
    idx = s.find('{')
    if idx == -1:
        return None, None
    sub = s[idx:]
    # try json
    try:
        obj = json.loads(sub)
        return obj, 'json'
    except Exception:
        pass
    # try python literal (single quotes) - use ast.literal_eval
    try:
        obj = ast.literal_eval(sub)
        return obj, 'py'
    except Exception:
        return None, None

def colorize_key(k):
    return f"{CLR_KEYS}{k}{CLR_RESET}"

def print_parsed(source, obj, parser):
    # header
    t = obj.get('type') if isinstance(obj, dict) else None
    header = f"[{source}]"
    if t:
        header += f" {CLR_TYPE}{t}{CLR_RESET}"
    print(f"{CLR_NODE if source=='NODE' else CLR_PY}{header}{CLR_RESET}")
    # pretty print with colors for keys
    pretty = json.dumps(obj, indent=2, ensure_ascii=False)
    # color keys simply
    for line in pretty.splitlines():
        # naive: color the quoted keys
        line = line.replace('"', '"')
        sys.stdout.write(line + '\n')
    print()

def print_raw(source, line):
    prefix = f"[{source}] "
    color = CLR_NODE if source == 'NODE' else CLR_PY
    print(f"{color}{prefix}{CLR_RESET}{line.rstrip()}")

def run():
    f_node = open_and_register(NODE_LOG, 'NODE')
    f_py = open_and_register(PY_LOG, 'PY')

    print('Watching logs:')
    print(f" - {NODE_LOG} (NODE)")
    print(f" - {PY_LOG} (PY)")
    print('Press Ctrl-C to exit')

    try:
        while True:
            events = sel.select(timeout=1.0)
            if not events:
                continue
            for key, mask in events:
                f = key.fileobj
                src = key.data
                while True:
                    line = f.readline()
                    if not line:
                        break
                    # attempt parse
                    parsed, parser = try_parse_payload(line)
                    if parsed is not None:
                        # normalize dicts: convert to built-in types
                        if isinstance(parsed, dict):
                            print_parsed(src, parsed, parser)
                        else:
                            print_raw(src, line)
                    else:
                        print_raw(src, line)
    except KeyboardInterrupt:
        print('\nExiting')

if __name__ == '__main__':
    run()

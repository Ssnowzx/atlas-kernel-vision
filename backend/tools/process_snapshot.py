#!/usr/bin/env python3
"""
Polls the Node server /api/state every 30 seconds and prints a concise,
human-readable snapshot of active processes in Portuguese.

Example line:
servico_controle_voo P1 status: rodando CPU%: 5.0%

Run:
  python3 tools/process_snapshot.py

"""
import time
import urllib.request
import json
import sys
import shutil

URL = 'http://localhost:3001/api/state'
INTERVAL = 30

import argparse

def human_status(s):
    if not s:
        return 'desconhecido'
    s_lower = s.lower()
    if s_lower in ('running', 'rodando'):
        return 'rodando'
    if s_lower in ('waiting', 'sleeping', 'paused', 'wait'):
        return 'waiting'
    if s_lower in ('stopped', 'stopped'):
        return 'stopped'
    return s

def status_icon_and_color(status):
    # returns (icon, color_code)
    if not status:
        return ('⚪', '')
    s = status.lower()
    if s == 'rodando':
        return ('🟢', '\033[92m')
    if s == 'waiting':
        return ('🟡', '\033[93m')
    if s in ('stopped', 'stopped'):
        return ('🔴', '\033[91m')
    return ('⚪', '\033[90m')

RESET = '\033[0m'

def fetch_state():
    try:
        with urllib.request.urlopen(URL, timeout=5) as r:
            data = r.read()
            return json.loads(data.decode('utf-8'))
    except Exception as e:
        return {'error': str(e)}

def print_snapshot(state):
    if 'error' in state:
        print(f"Erro ao obter estado: {state['error']}")
        return
    processes = state.get('processes', [])
    ts = time.strftime('%Y-%m-%d %H:%M:%S')
    cols = shutil.get_terminal_size((80, 20)).columns
    title = f" AtlasOS — Snapshot: {ts} — {len(processes)} processos "
    border = '=' * cols
    # center the title
    centered_title = title.center(cols, ' ')
    print(border)
    print(centered_title)
    print(border)

    # columns: name (left), prio (center), status (with icon), CPU (right)
    name_w = min(30, max(12, int(cols * 0.45)))
    prio_w = 4
    status_w = 12
    cpu_w = 7

    # header
    hdr_name = 'PROCESSO'.ljust(name_w)
    hdr_prio = 'P'.center(prio_w)
    hdr_status = 'STATUS'.center(status_w)
    hdr_cpu = 'CPU'.rjust(cpu_w)
    print(f"{hdr_name} {hdr_prio} {hdr_status} {hdr_cpu}")
    print('-' * min(cols, name_w + prio_w + status_w + cpu_w + 6))

    for p in processes:
        name = p.get('name') or '<sem-nome>'
        prio = str(p.get('priority') or '')
        status = human_status(p.get('status'))
        cpu = p.get('cpu')
        # format cpu nicely
        try:
            cpu_val = float(cpu)
            cpu_fmt = f"{cpu_val:5.1f}%"
        except Exception:
            cpu_fmt = str(cpu or '')

        icon, color = status_icon_and_color(status)
        name_col = (name[:name_w-1] + '…') if len(name) > name_w else name.ljust(name_w)
        prio_col = prio.center(prio_w)
        status_text = f"{icon} {status}"
        if len(status_text) > status_w:
            status_text = status_text[:status_w]
        status_col = status_text.center(status_w)

        print(f"{name_col} {prio_col} {color}{status_col}{RESET} {cpu_fmt.rjust(cpu_w)}")

    print(border)
    print('\n')
def main():
    parser = argparse.ArgumentParser(description='Process snapshot poller')
    parser.add_argument('--once', action='store_true', help='buscar e imprimir uma vez e sair')
    args = parser.parse_args()

    if args.once:
        state = fetch_state()
        print_snapshot(state)
        return

    print('Iniciando snapshot de processos (atualiza a cada 30s). Ctrl-C para sair.')
    while True:
        state = fetch_state()
        print_snapshot(state)
        try:
            time.sleep(INTERVAL)
        except KeyboardInterrupt:
            print('\nInterrompido pelo usuário')
            sys.exit(0)

if __name__ == '__main__':
    main()

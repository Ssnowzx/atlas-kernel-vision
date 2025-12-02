import random
import os
import time
import argparse
import logging

# ============================================
# PASSO 1: CRIAR OS PROCESSOS
# ============================================

class ProcessoSimulado:
    """Classe base para todos os processos/serviços"""
    
    def __init__(self, nome, prioridade):
        self.nome = nome
        self.prioridade = prioridade
        self.estado = "OCIOSO"
        self.fila_mensagens = []

    def receber_mensagem(self, msg):
        """Kernel envia uma mensagem para este processo"""
        if self.estado == "TRAVADO":
            return False
        
        self.fila_mensagens.append(msg)
        self.estado = "TRABALHANDO"
        print(f"[Kernel] -> Mensagem enviada para [{self.nome}]: '{msg}'")
        return True

    def executar(self):
        """Kernel chama quando é a vez deste processo rodar"""
        if self.estado == "TRAVADO":
            return False

        if self.fila_mensagens:
            msg = self.fila_mensagens.pop(0)
            self.processar(msg)
            
            if not self.fila_mensagens:
                self.estado = "OCIOSO"
            return True
        
        return False

    def processar(self, msg):
        """Cada processo implementa sua própria lógica"""
        print(f"[{self.nome} | P{self.prioridade}] Processou: {msg}")

    def travar(self):
        """Simular uma falha"""
        self.estado = "TRAVADO"
        self.fila_mensagens = []
        print(f"\n💥 [{self.nome}] FALHA! PROCESSO TRAVADO! 💥\n")

    def reiniciar(self):
        """Auto-cura: reinicia o processo"""
        self.estado = "OCIOSO"
        self.fila_mensagens = []
        print(f"\n♻️ [{self.nome}] REINICIADO COM SUCESSO! ♻️\n")


# --- Processos Especializados ---

class ControlodeVoo(ProcessoSimulado):
    def __init__(self):
        super().__init__("ControlodeVoo", 1)
    
    def processar(self, msg):
        print(f"🚨 [{self.nome} | P{self.prioridade}] ⚡ AÇÃO CRÍTICA: {msg}")


class NavigacaoIA(ProcessoSimulado):
    def __init__(self):
        super().__init__("NavigacaoIA", 2)
    
    def processar(self, msg):
        print(f"🧠 [{self.nome} | P{self.prioridade}] Calculando: {msg}")


class DriverCamera(ProcessoSimulado):
    def __init__(self):
        super().__init__("DriverCamera", 3)
    
    def processar(self, msg):
        print(f"📸 [{self.nome} | P{self.prioridade}] {msg}")


class AppCientifico(ProcessoSimulado):
    def __init__(self):
        super().__init__("AppCientifico", 4)
    
    def processar(self, msg):
        print(f"🔬 [{self.nome} | P{self.prioridade}] Analisando: {msg}")


# ============================================
# PASSO 2: CRIAR O MICROKERNEL
# ============================================

class Microkernel:
    """O núcleo do sistema operacional"""
    
    def __init__(self):
        self.processos = []
        self.por_prioridade = {1: [], 2: [], 3: [], 4: []}

    def registrar_processo(self, processo):
        """Adiciona um novo processo ao sistema"""
        self.processos.append(processo)
        # protege caso a prioridade não exista
        if processo.prioridade not in self.por_prioridade:
            self.por_prioridade[processo.prioridade] = []
        self.por_prioridade[processo.prioridade].append(processo)
        print(f"[Kernel] Processo '{processo.nome}' registrado (P{processo.prioridade})")

    def enviar_mensagem(self, nome_destino, msg):
        """IPC: Envia mensagem entre processos"""
        for p in self.processos:
            if p.nome == nome_destino:
                return p.receber_mensagem(msg)
        print(f"[Kernel] Erro: Processo '{nome_destino}' não encontrado")
        return False

    def escalonar(self):
        """Lógica de escalonamento por prioridade"""
        print("\n--- [Ciclo do Escalonador] ---")
        
        for prioridade in sorted(self.por_prioridade.keys()):
            for processo in self.por_prioridade[prioridade]:
                
                if processo.estado == "TRABALHANDO":
                    trabalhou = processo.executar()
                    
                    if trabalhou:
                        return True
        
        print("(Sistema OCIOSO)")
        return False

    def verificar_e_tratar_falhas(self):
        """Verifica processos travados e tenta reiniciá-los (auto-cura)."""
        for p in list(self.processos):
            if p.estado == "TRAVADO":
                logging.info(f"[Kernel] Falha detectada em '{p.nome}'. Reiniciando processo...")
                p.reiniciar()

    def encontrar_processo(self, nome):
        """Ajuda a encontrar um processo pelo nome"""
        for p in self.processos:
            if p.nome == nome:
                return p
        return None


# ============================================
# PASSO 3: LOOP INTERATIVO
# ============================================

def simular(demo_cycles=None, demo_delay=0.2):
    """Loop interativo de simulação"""
    
    os.system('clear' if os.name != 'nt' else 'cls')
    kernel = Microkernel()
    
    kernel.registrar_processo(ControlodeVoo())
    kernel.registrar_processo(NavigacaoIA())
    kernel.registrar_processo(DriverCamera())
    kernel.registrar_processo(AppCientifico())
    
    driver_cam = kernel.encontrar_processo("DriverCamera")

    print("\n" + "="*60)
    print("🚀 SIMULADOR ATLASOS - MICROKERNEL RESILIENTE 🚀")
    print("="*60)
    print("\n📖 INSTRUÇÕES:")
    print("  [Enter]  → Avança 1 ciclo (gera eventos aleatórios)")
    print("  [f]      → Força FALHA no Driver Câmera")
    print("  [r]      → REINICIA o Driver Câmera (Auto-cura)")
    print("  [q]      → Sair")
    print("\n" + "="*60 + "\n")

    # modo demo: executa N ciclos automaticamente
    if demo_cycles is not None:
        print(f"\n>>> Modo demo: executando {demo_cycles} ciclos (delay {demo_delay}s) ...\n")
        for ciclo in range(demo_cycles):
            print(f"[Demo] Ciclo {ciclo+1}/{demo_cycles}")
            print("\n>>> Gerando eventos aleatórios...\n")

            if random.random() < 0.6:
                kernel.enviar_mensagem("ControlodeVoo", "Ajustar propulsores")
            if random.random() < 0.4:
                kernel.enviar_mensagem("NavigacaoIA", "Recalcular rota")
            if random.random() < 0.7:
                kernel.enviar_mensagem("DriverCamera", "Capturar imagem do cometa")
            if random.random() < 0.5:
                kernel.enviar_mensagem("AppCientifico", "Analisar dados espectrais")

            # suporte a falha forçada em ciclo específico: se setado via variável global _demo_fail_at
            if globals().get("_demo_fail_at") is not None and (ciclo + 1) == globals().get("_demo_fail_at"):
                if driver_cam:
                    logging.warning(f"[Demo] Forçando falha em '{driver_cam.nome}' no ciclo {ciclo+1}")
                    driver_cam.travar()

            kernel.escalonar()
            # Verifica e trata falhas ao final de cada tick
            kernel.verificar_e_tratar_falhas()
            time.sleep(demo_delay)

        print("\nDemo finalizado.\n")
        return

    # modo interativo (original)
    while True:
        try:
            cmd = input("Comando: ").lower().strip()
            
            if cmd == 'q':
                print("\nSimulação encerrada. Até logo! 👋\n")
                break
            
            elif cmd == 'f':
                print("\n>>> COMANDO: Forçando FALHA no Driver Câmera...")
                if driver_cam:
                    driver_cam.travar()
                else:
                    print("[Kernel] DriverCamera não encontrado")
            
            elif cmd == 'r':
                print("\n>>> COMANDO: Reiniciando Driver Câmera...")
                if driver_cam:
                    driver_cam.reiniciar()
                else:
                    print("[Kernel] DriverCamera não encontrado")
            
            elif cmd == '':
                print("\n>>> Gerando eventos aleatórios...\n")
                
                if random.random() < 0.6:
                    kernel.enviar_mensagem("ControlodeVoo", "Ajustar propulsores")
                if random.random() < 0.4:
                    kernel.enviar_mensagem("NavigacaoIA", "Recalcular rota")
                if random.random() < 0.7:
                    kernel.enviar_mensagem("DriverCamera", "Capturar imagem do cometa")
                if random.random() < 0.5:
                    kernel.enviar_mensagem("AppCientifico", "Analisar dados espectrais")
                
                kernel.escalonar()
                # verificar e tratar falhas em modo interativo também
                kernel.verificar_e_tratar_falhas()
            
            else:
                print("❌ Comando inválido. Digite [Enter], 'f', 'r' ou 'q'.")

        except KeyboardInterrupt:
            print("\n\nSimulação interrompida. 👋\n")
            break


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Simulador AtlasOS - Microkernel Resiliente")
    parser.add_argument("--demo", type=int, default=None, help="Executa N ciclos automaticamente e sai")
    parser.add_argument("--delay", type=float, default=0.2, help="Delay (s) entre ciclos no modo demo")
    parser.add_argument("--fail-at", type=int, default=None, help="(demo) força falha no DriverCamera no ciclo especificado (1-based)")
    parser.add_argument("--verbose", action="store_true", help="Habilita logs mais verbosos")
    args = parser.parse_args()

    # configurar logging
    log_level = logging.DEBUG if args.verbose else logging.INFO
    logging.basicConfig(level=log_level, format='%(asctime)s %(levelname)s: %(message)s')

    # expor uma flag global para o demo forçar falha em um ciclo (simples e suficiente para a simulação)
    if args.fail_at is not None:
        globals()['_demo_fail_at'] = args.fail_at
    else:
        globals()['_demo_fail_at'] = None

    simular(demo_cycles=args.demo, demo_delay=args.delay)

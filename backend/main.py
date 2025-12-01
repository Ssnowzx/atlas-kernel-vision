"""
AtlasOS - Sistema Operacional Microkernel
Missão: Exploração do cometa interestelar 3I/ATLAS
"""

from kernel.scheduler import Scheduler, Process
from kernel.ipc import IPC
from kernel.mmu import MMU
from kernel.irq import IRQHandler
from services.recovery import RecoveryAgent
from services.flight_control import FlightControl
from services.navigation import NavigationAI
from drivers.camera import CameraDriver
from drivers.npu import NPUDriver
from apps.composition import CompositionAnalyzer
from services.filesystem import FileSystem
from drivers.propulsion import PropulsionDriver

def boot_atlasOS():
    """Sequência de boot do AtlasOS"""
    print("=" * 60)
    print("🚀 AtlasOS v1.0 - Microkernel Boot Sequence")
    print("📡 Mission: 3I/ATLAS Interstellar Comet Exploration")
    print("=" * 60)
    
    # Camada 1: Microkernel (Modo Kernel)
    print("\n[LAYER 1] Initializing Microkernel...")
    scheduler = Scheduler()
    ipc = IPC()
    mmu = MMU()
    irq_handler = IRQHandler()
    print("✅ Scheduler, IPC, MMU, IRQ loaded")
    
    # Camada 2: Serviços Essenciais (Modo Usuário)
    print("\n[LAYER 2] Starting Essential Services...")
    camera_driver = CameraDriver(ipc, irq_handler, priority=3)
    npu_driver = NPUDriver(ipc, priority=3)
    # allocate MMU regions for services (example sizes)
    mmu.allocate('FlightControl', 0x1000)
    mmu.allocate('NavigationAI', 0x1000)
    mmu.allocate('CameraDriver', 0x0800)
    mmu.allocate('NPUDriver', 0x0800)
    mmu.allocate('PropulsionDriver', 0x0800)
    mmu.allocate('CompositionAnalyzer', 0x0400)

    # FileSystem service (handles saves from CameraDriver) — pass mmu for access checks
    filesystem = FileSystem(ipc, mmu)
    # Propulsion driver (thrusters)
    propulsion_driver = PropulsionDriver(ipc, irq_handler, priority=3)
    # Energy manager (optional, monitors thruster telemetry)
    from services.energy import EnergyManager
    energy_manager = EnergyManager(ipc, initial_budget=500.0, warn_threshold=0.15)
    recovery_agent = RecoveryAgent(ipc)
    print("✅ Drivers and Recovery Agent started")
    
    # Camada 3: Serviços de Missão (Modo Usuário)
    print("\n[LAYER 3] Starting Mission Services...")
    flight_control = FlightControl(ipc, priority=1)  # P1 - Crítica
    navigation_ai = NavigationAI(ipc, npu_driver, priority=2)  # P2 - Alta
    print("✅ Flight Control (P1) and Navigation AI (P2) active")
    
    # Camada 4: Aplicações Científicas (Modo Usuário)
    print("\n[LAYER 4] Loading Scientific Applications...")
    composition_analyzer = CompositionAnalyzer(ipc, npu_driver, priority=4)
    print("✅ Composition Analyzer (P4) loaded")
    
    print("\n" + "=" * 60)
    print("🌌 AtlasOS fully operational!")
    print("🎯 Target: Comet 3I/ATLAS (Interstellar Visitor)")
    print("📍 Distance: 150,000 km and approaching...")
    print("=" * 60)
    
    # Register processes with RecoveryAgent monitoring
    recovery_agent.monitor('FlightControl')
    recovery_agent.monitor('NavigationAI')
    recovery_agent.monitor('CameraDriver')
    recovery_agent.monitor('NPUDriver')
    recovery_agent.monitor('CompositionAnalyzer')
    recovery_agent.monitor('PropulsionDriver')

    # --- Register restart hooks (RecoveryAgent will call these to recreate/enqueue)
    # Factories that create fresh instances (they also register with IPC inside their ctor)
    flight_factory = lambda: FlightControl(ipc, priority=1)
    navigation_factory = lambda: NavigationAI(ipc, npu_driver, priority=2)
    camera_factory = lambda: CameraDriver(ipc, priority=3)
    npu_factory = lambda: NPUDriver(ipc, priority=3)
    propulsion_factory = lambda: PropulsionDriver(ipc, priority=3)
    composition_factory = lambda: CompositionAnalyzer(ipc, npu_driver, priority=4)
    filesystem_factory = lambda: FileSystem(ipc, mmu)

    def make_restart_hook(name, factory, priority):
        def hook():
            new_inst = factory()
            # Enfileira nova instância no escalonador
            scheduler.add_process(Process(name, priority, new_inst.run))
            print(f"[MAIN] Recovery hook: recreated and enqueued '{name}'")
        return hook

    recovery_agent.register_restart_hook('FlightControl', make_restart_hook('FlightControl', flight_factory, 1))
    recovery_agent.register_restart_hook('NavigationAI', make_restart_hook('NavigationAI', navigation_factory, 2))
    recovery_agent.register_restart_hook('CameraDriver', make_restart_hook('CameraDriver', camera_factory, 3))
    recovery_agent.register_restart_hook('NPUDriver', make_restart_hook('NPUDriver', npu_factory, 3))
    recovery_agent.register_restart_hook('PropulsionDriver', make_restart_hook('PropulsionDriver', propulsion_factory, 3))
    recovery_agent.register_restart_hook('CompositionAnalyzer', make_restart_hook('CompositionAnalyzer', composition_factory, 4))
    recovery_agent.register_restart_hook('FileSystem', make_restart_hook('FileSystem', filesystem_factory, 3))

    # Register IRQ handlers to convert hardware IRQ -> IPC messages
    def irq_to_ipc_camera(data):
        ipc.send_message('IRQ', 'CameraDriver', data or {})

    def irq_to_ipc_propulsion(data):
        ipc.send_message('IRQ', 'PropulsionDriver', data or {})

    irq_handler.register_irq(3, irq_to_ipc_camera, 'Camera')
    irq_handler.register_irq(5, irq_to_ipc_propulsion, 'Propulsores')

    # Inicia escalonador
    scheduler.run([
        flight_control,      # P1
        navigation_ai,       # P2
        camera_driver,       # P3
        npu_driver,          # P3
        propulsion_driver,   # P3
        composition_analyzer # P4
    ])

    # Demo: FlightControl sends a burn command to PropulsionDriver via IPC
    print('\n>>> DEMO: FlightControl -> PropulsionDriver (burn)')
    ipc.send_message('FlightControl', 'PropulsionDriver', {'action': 'burn', 'duration': 500, 'thrust': 3.2})

if __name__ == "__main__":
    boot_atlasOS()

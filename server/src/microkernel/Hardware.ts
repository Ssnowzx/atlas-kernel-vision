import { IPCHub } from "./IPC.js";
import { RecoveryAgent } from "./RecoveryAgent.js";
import { CometImage } from "../types.js";

export class HardwareSimulator {
  private ipc: IPCHub;
  private recoveryAgent: RecoveryAgent;
  private cameraInterval: NodeJS.Timeout | null = null;
  private images: CometImage[] = [];

  constructor(ipc: IPCHub, recoveryAgent: RecoveryAgent) {
    this.ipc = ipc;
    this.recoveryAgent = recoveryAgent;
  }

  start() {
    // Simular câmera capturando imagens do cometa a cada 10 segundos
    this.cameraInterval = setInterval(() => {
      this.captureImage();
    }, 10000);

    this.recoveryAgent.logEvent("Hardware iniciado - Câmera ativa", "success");
  }

  private captureImage() {
    const imageId = `3I_ATLAS_${String(this.images.length + 1).padStart(
      3,
      "0"
    )}`;
    const descriptions = [
      "Núcleo ativo - H₂O, CH₄ detectado",
      "Coma expansiva - jatos ativos",
      "Polo sul - moléculas orgânicas",
      "Superfície irregular - criovolcão ativo",
      "Espectro infravermelho - amônia (NH₃)",
    ];

    const image: CometImage = {
      id: imageId,
      filename: `${imageId}.jpg`,
      timestamp: new Date().toISOString().slice(11, 19),
      description:
        descriptions[Math.floor(Math.random() * descriptions.length)],
    };

    this.images.push(image);
    if (this.images.length > 10) {
      this.images.shift();
    }

    // IRQ: Câmera → Kernel → IPC → Driver
    this.ipc.send("hardware_camera", "driver_camera", "IRQ_IMAGE_CAPTURED", {
      image,
    });
    this.recoveryAgent.logEvent(`Imagem capturada: ${image.filename}`, "info");
  }

  getRecentImages(limit = 6): CometImage[] {
    return this.images.slice(-limit);
  }

  stop() {
    if (this.cameraInterval) {
      clearInterval(this.cameraInterval);
    }
  }
}

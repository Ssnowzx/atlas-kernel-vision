import { IPCMessage } from "../types.js";
import { v4 as uuidv4 } from "uuid";

type MessageHandler = (message: IPCMessage) => void;

export class IPCHub {
  private handlers: Map<string, MessageHandler[]> = new Map();
  private messageLog: IPCMessage[] = [];

  subscribe(processName: string, handler: MessageHandler) {
    if (!this.handlers.has(processName)) {
      this.handlers.set(processName, []);
    }
    this.handlers.get(processName)!.push(handler);
  }

  send(
    source: string,
    destination: string,
    type: string,
    payload?: any
  ): IPCMessage {
    const message: IPCMessage = {
      id: uuidv4(),
      timestamp: new Date().toISOString().slice(11, 19),
      source,
      destination,
      type,
      payload,
    };

    this.messageLog.push(message);
    if (this.messageLog.length > 50) {
      this.messageLog.shift();
    }

    const handlers = this.handlers.get(destination);
    if (handlers) {
      handlers.forEach((handler) => handler(message));
    }

    return message;
  }

  getRecentMessages(limit = 10): IPCMessage[] {
    return this.messageLog.slice(-limit);
  }
}

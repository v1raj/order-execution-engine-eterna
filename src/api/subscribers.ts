// subscribers.ts
import WebSocket from 'ws'
import '@fastify/websocket'



type WSClient = WebSocket;
export class SubscriberManager {
  private subscribers: Set<WebSocket>

  constructor() {
    this.subscribers = new Set()
  }

  subscribe(ws: WebSocket) {
    this.subscribers.add(ws)
  }

  unsubscribe(ws: WebSocket) {
    this.subscribers.delete(ws)
  }

  broadcast(message: any) {
    const payload = JSON.stringify(message)

    for (const ws of this.subscribers) {
      if (ws.readyState === ws.OPEN) {
        ws.send(payload)
      }
    }
  }

  getSubscriberCount() {
    return this.subscribers.size
  }
}

export const subscriberManager = new SubscriberManager()

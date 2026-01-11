// orderSocket.ts
import Redis from 'ioredis'
import { subscriberManager } from './subscribers'
import { FastifyInstance } from 'fastify'

const redis = new Redis()

export function orderSocket(app: FastifyInstance) {
  app.get('/api/orders/execute', { websocket: true }, (connection,request) => {
  

    subscriberManager.subscribe(connection)

    connection.on('close', () => {
      subscriberManager.unsubscribe(connection)
    })
  })
}

// listen for worker events
redis.subscribe('order-events')

redis.on('message', (_channel, message) => {
  const event = JSON.parse(message)

  console.log(
    '[API] broadcasting order event to',
    subscriberManager.getSubscriberCount(),
    'clients'
  )

  subscriberManager.broadcast(event)
})

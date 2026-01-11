import '@fastify/websocket'
import Fastify from 'fastify'
import websocket from '@fastify/websocket'

import { ordersRoute } from './api/orders'
import { orderSocket } from './api/orderSocket'

import 'dotenv/config'


async function startServer() {
  const app = Fastify({ logger: true })

 

  await app.register(websocket)
  await app.register(ordersRoute)
  await app.register(orderSocket)

  await app.listen({ port: Number(process.env.PORT) || 3000 })
  console.log('Fastify on http://localhost:3000')
}

startServer().catch(err => {
  console.error(err)
  process.exit(1)
})

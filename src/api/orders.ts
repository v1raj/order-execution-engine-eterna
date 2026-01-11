import { FastifyInstance } from 'fastify'

import '@fastify/websocket' 

import { CreateOrderRequest } from '../domain/Order'
import { MarketOrderStrategy } from './orderStrategy'


//for post request on fastify app
export async function ordersRoute(app: FastifyInstance) {
  app.post('/api/orders/execute', async (req, reply) => {
    const body = req.body as CreateOrderRequest

    if (!body.inputToken || !body.outputToken || !body.amount) {
      return reply.status(400).send({
        error: 'inputToken, outputToken and amount are required'
      })
    }

    if (body.amount <= 0) {
      return reply.status(400).send({
        error: 'amount must be greater than zero'
      })
    }

   const orderStrategy = new MarketOrderStrategy()
   const result = await orderStrategy.createOrder(body)

    return reply.status(200).send(result)
  })
}

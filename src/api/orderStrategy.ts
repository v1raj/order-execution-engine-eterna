import { v4 as uuid } from 'uuid'

import { CreateOrderRequest, Order } from '../domain/Order'
import { orderQueue } from '../queue/queue'

//to extend to different order types
interface OrderCreationStrategy {
  createOrder(payload: CreateOrderRequest): any,
}

//implementing market order
export class MarketOrderStrategy implements OrderCreationStrategy
{
   async createOrder(
  payload: CreateOrderRequest
): Promise<{ orderId: string }> {
  const { v4: uuidv4 } = await import('uuid')

  const orderId = uuidv4()

  //create order object
  const order: Order = {
    id: orderId,
    inputToken: payload.inputToken,
    outputToken: payload.outputToken,
    amount: payload.amount,
    status: 'pending',
    createdAt: new Date()
  }

  //send it to the queue for workers to pick up
  await orderQueue.add('execute-order', {
    orderId,
    ...payload
  })

  return { orderId }
}
}

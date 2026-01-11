// OrderExecutor.ts
import Redis from 'ioredis'
import { ExecuteOrderJob } from '../queue/types'
import { DexRouter } from './DexRouter'

const redis = new Redis()

function emit(event: any) {
  return redis.publish('order-events', JSON.stringify(event))
}

export class OrderExecutor {
  static async execute(job: ExecuteOrderJob): Promise<void> {
    const { orderId } = job

    try {
      //pending
      console.log("Getting order status");
      await emit({
        type: 'ORDER_STATUS',
        orderId,
        status: 'pending',
        timestamp: Date.now()
      })

      // routing
      console.log("Routing order");
      await emit({
        type: 'ORDER_STATUS',
        orderId,
        status: 'routing',
        timestamp: Date.now()
      })


      //route the order
      const quote = await DexRouter.route(job);

    

      //building
      console.log("Creating transaction")
      await emit({
        type: 'ORDER_STATUS',
        orderId,
        status: 'building',
        timestamp: Date.now()
      })

      // simulate tx build
      await sleep(300)

      //submitted
      console.log("Transaction finished")
      await emit({
        type: 'ORDER_STATUS',
        orderId,
        status: 'submitted',
        timestamp: Date.now()
      })

      // simulate confirmation
      await sleep(500)

      //confirmed
      console.log("Transaction confirmed")
      await emit({
        type: 'ORDER_STATUS',
        orderId,
        status: 'confirmed',
        timestamp: Date.now()
      })
    } catch (err: any) {
      // failed
      console.log("Transaction failed")
      await emit({
        type: 'ORDER_STATUS',
        orderId,
        status: 'failed',
        error: err?.message ?? 'Unknown error',
        timestamp: Date.now()
      })
    }
  }
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
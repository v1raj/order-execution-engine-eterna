import { Queue } from 'bullmq'
import { ExecuteOrderJob } from './types.js'

export const ORDER_QUEUE_NAME = 'order-execution'

export const orderQueue = new Queue<ExecuteOrderJob>(ORDER_QUEUE_NAME, {
  connection: {
    host: process.env.REDIS_IP,
    port: Number(process.env.REDIS_PORT) || 6379 ,
  },
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000
    },
    removeOnComplete: false,
    removeOnFail: false
  }
})

import { Queue } from 'bullmq'
import { ExecuteOrderJob } from './types.js'

export const ORDER_QUEUE_NAME = 'order-execution'

export const orderQueue = new Queue<ExecuteOrderJob>(ORDER_QUEUE_NAME, {
  connection: {
    url:process.env.REDIS_URL
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

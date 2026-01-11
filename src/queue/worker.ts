import { Worker, Job } from 'bullmq'
import { ORDER_QUEUE_NAME } from './queue'
import { ExecuteOrderJob } from './types'
import { OrderExecutor } from '../execution/OrderExecutor'


export const orderWorker = new Worker(
  ORDER_QUEUE_NAME,
  async (job) => {
     console.log(
      `[WORKER] Processing order ${job.data.orderId}, attempt ${
        job.attemptsMade + 1
      }`
    )
    await OrderExecutor.execute(job.data)
  },
  {
    connection: {
      host: '127.0.0.1',
      port: 6379
    },
    concurrency: 10
  }
)

orderWorker.on('failed', (job, err) => {
  console.error(
    `[WORKER] Job ${job?.id} failed after ${job?.attemptsMade} attempts`,
    err.message
  )
})

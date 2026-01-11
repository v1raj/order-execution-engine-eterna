import { setTimeout as sleep } from 'timers/promises'
import { ExecuteOrderJob } from '../queue/types'
import { DexQuote } from '../domain/Order'


export async function getRaydiumQuote(
  _order: ExecuteOrderJob
): Promise<DexQuote> {
  // 2–2.5 seconds realistic latency
  await sleep(2000 + Math.random() * 500)

  return {
    dex: 'raydium',
    price: 1 + Math.random() * 0.05, // 2–5% variance
    fees:0.002,
  }
}

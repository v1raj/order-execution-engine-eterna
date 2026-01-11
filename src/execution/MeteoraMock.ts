import { setTimeout as sleep } from 'timers/promises'
import { ExecuteOrderJob } from '../queue/types'
import { DexQuote } from '../domain/Order'


export async function getMeteoraQuote(
  _order: ExecuteOrderJob
): Promise<DexQuote> {
  // Slightly slower to differentiate routing behavior
  await sleep(2300 + Math.random() * 500)

  return {
    dex: 'meteora',
    price: 1 + Math.random() * 0.05,
    fees: 0.003,
  }
}

import { getRaydiumQuote } from './RaydiumMock'
import { getMeteoraQuote } from './MeteoraMock'
import { ExecuteOrderJob } from '../queue/types'
import { DexQuote } from '../domain/Order'

export class DexRouter {
  /**
   * Fetch quotes from all DEXs and select best execution.
   */
  static async route(order: ExecuteOrderJob): Promise<DexQuote> {
  const [raydium, meteora] = await Promise.all([
    getRaydiumQuote(order),
    getMeteoraQuote(order)
  ])

  this.logQuote(raydium, order.amount)
  this.logQuote(meteora, order.amount)

  const best = this.selectBest(
    [raydium, meteora],
    order.amount
  )

  console.log(
    `[ROUTER] Selected ${best.dex} | net=${(
      best.price * order.amount - best.fees
    ).toFixed(4)}`
  )

  return best
}

  /**
   * Routing rule (simple & correct):
   * - prefer better price
   * - account for fees
   */
 
private static selectBest(
  quotes: DexQuote[],
  amount: number
): DexQuote {
  return quotes.reduce((best, current) => {
    const bestNet = this.netExecutionValue(best, amount)
    const currentNet = this.netExecutionValue(current, amount)

    // tie-breaker: lower fees (more stable)
    if (Math.abs(bestNet - currentNet) < 1e-6) {
      return current.fees < best.fees ? current : best
    }

    return currentNet > bestNet ? current : best
  })
}


  private static netExecutionValue(
  q: DexQuote,
  amount: number
): number {
  return q.price * amount - q.fees
}


 private static logQuote(q: DexQuote, amount: number) {
  const net = q.price * amount - q.fees

  console.log(
    `[QUOTE] ${q.dex} | price=${q.price.toFixed(4)} | fees=${q.fees.toFixed(
      4
    )} | net=${net.toFixed(4)}`
  )
}
}

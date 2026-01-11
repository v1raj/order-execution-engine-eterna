export type OrderStatus =
  | 'pending'
  | 'routing'
  | 'building'
  | 'submitted'
  | 'confirmed'
  | 'failed'

export interface CreateOrderRequest {
  inputToken: string
  outputToken: string
  amount: number
}

export interface Order {
  id: string
  inputToken: string
  outputToken: string
  amount: number
  status: OrderStatus
  createdAt: Date
}


export interface DexQuote {
  dex: 'raydium' | 'meteora'

  /** Effective execution price (amountOut / amountIn) */
  price: number

  /** Fees charged by the DEX for this trade */
  fees: number

  /** Liquidity context used to assess slippage & reliability */

}



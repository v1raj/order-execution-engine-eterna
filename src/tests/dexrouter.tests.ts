import { DexRouter } from "../execution/DexRouter"


describe('DexRouter', () => {
  it('selects dex with higher net value', () => {
    const quotes = [
      { dex: 'raydium', price: 10, fees: 1 },
      { dex: 'meteora', price: 9.5, fees: 0.1 }
    ]

    const best = (DexRouter as any).selectBest(quotes, 100)
    expect(best.dex).toBe('raydium')
  })

  it('prefers lower fees for small order', () => {
    const quotes = [
      { dex: 'raydium', price: 10, fees: 2 },
      { dex: 'meteora', price: 9.9, fees: 0.01 }
    ]

    const best = (DexRouter as any).selectBest(quotes, 1)
    expect(best.dex).toBe('meteora')
  })

  it('is deterministic for same inputs', () => {
    const quotes = [
      { dex: 'raydium', price: 10, fees: 1 },
      { dex: 'meteora', price: 9.8, fees: 0.5 }
    ]

    const a = (DexRouter as any).selectBest(quotes, 50)
    const b = (DexRouter as any).selectBest(quotes, 50)

    expect(a.dex).toBe(b.dex)
  })
})

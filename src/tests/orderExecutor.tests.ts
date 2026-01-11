import { OrderExecutor } from "../execution/OrderExecutor"

let publishSpy: jest.Mock

jest.mock('ioredis', () => {
  return jest.fn().mockImplementation(() => {
    publishSpy = jest.fn()
    return {
      publish: publishSpy
    }
  })
})


describe('OrderExecutor', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('emits pending status', async () => {
    await OrderExecutor.execute({ orderId: 'o1' } as any)

    expect(publishSpy).toHaveBeenCalledWith(
      'order-events',
      expect.stringContaining('"status":"pending"')
    )
  })

  it('emits confirmed status', async () => {
    await OrderExecutor.execute({ orderId: 'o2' } as any)

    expect(publishSpy).toHaveBeenCalledWith(
      'order-events',
      expect.stringContaining('"status":"confirmed"')
    )
  })
})

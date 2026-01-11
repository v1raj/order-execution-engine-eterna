import { subscriberManager } from '../../src/api/subscribers'

describe('SubscriberManager', () => {
  it('adds and counts subscribers', () => {
    const ws = { readyState: 1, OPEN: 1, send: jest.fn() } as any

    subscriberManager.subscribe(ws)
    expect(subscriberManager.getSubscriberCount()).toBe(1)
  })

  it('broadcasts message to subscribers', () => {
    const ws = { readyState: 1, OPEN: 1, send: jest.fn() } as any

    subscriberManager.subscribe(ws)
    subscriberManager.broadcast({ type: 'TEST' })

    expect(ws.send).toHaveBeenCalledWith(
      JSON.stringify({ type: 'TEST' })
    )
  })
})

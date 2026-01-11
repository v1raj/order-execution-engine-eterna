import WebSocket from 'ws'

describe('Order WebSocket', () => {
  it('connects successfully', done => {
    const ws = new WebSocket('ws://localhost:3000/api/orders/execute')

    ws.on('open', () => {
      ws.close()
      done()
    })
  })
})

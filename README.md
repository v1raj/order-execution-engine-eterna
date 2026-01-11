Order Execution Engine

A light-weight order execution engine for routing orders across DEXes, executing transactions via a worker queue, and streaming real-time order status to clients over WebSocket.

Design decisions

1.Keep domain model small. Order contains id, inputToken, outputToken, amount, status, createdAt. DexQuote contains only price and fees. Simplicity reduces surface area for bugs and matches assignment constraints.

2.Routing metric: totalOutput = price * amount - fees. This makes routing aware of order size without introducing additional fields.

3.Process separation: API server and worker run as separate processes. They communicate via Redis pub/sub to avoid sharing in-memory state.

4.WebSocket broadcasting: API owns WebSocket connections and broadcasts events to all connected clients (global subscription). Worker emits order lifecycle events to Redis; API subscribes and forwards them.

5.Stateless workers: Workers publish events and do not maintain socket state. This allows horizontal scaling of workers.

I intentionally chose to support market orders first and left limit or sniper orders out of the design.
The main reason is that market orders let me validate the entire execution pipeline without introducing timing and state complexity too early. A market order has one clear goal: execute immediately at the best available price. That maps cleanly to how the system is structured — enqueue, route, execute and notify — with no long-lived order state
or managing complex timing.

Main Components

1.Order: Represents the core domain entity. It holds the input/output tokens, quantity, and execution state.

2.OrderStrategy: Interface for order execution. The current logic supports marker order, but the abstraction allows other strategies (such as limit or sniper-style orders) to be added later without changing the core execution flow.

3.SubscriberManager: Tracks clients subscribed to an order and pushes status updates as execution progresses.

4.OrderExecutor: Coordinates the full lifecycle of an order. After validation, it updates order state, notifies subscribers, and delegates exchange selection to the router.

5.DexRouter: Selects the most suitable exchange for execution based on predefined criteria. It is responsible only for routing decisions, not execution itself.

6.orderQueue: Holds order execution tasks so that order processing can happen asynchronously.

7.orderWorker: Consumes tasks from the queue and executes them via the OrderExecutor. Each worker processes upto 10 orders concurrently.

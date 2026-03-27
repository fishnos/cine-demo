import asyncio
import json
import threading

try:
    import rclpy
except ImportError as exc:
    raise ImportError(
        "rclpy not found — run: source /opt/ros/jazzy/setup.bash"
    ) from exc

import websockets

from ros_bridge.constants.topics import WS_PORT
from ros_bridge.subscriber import ROSSubscriber

_clients: set = set()

_loop: asyncio.AbstractEventLoop | None = None


async def _broadcast(payload: str) -> None:
    disconnected = set()
    for client in _clients:
        try:
            await client.send(payload)
        except websockets.exceptions.ConnectionClosed:
            disconnected.add(client)
    _clients.difference_update(disconnected)


def _on_ros_data(topic: str, stamp: float, data: dict) -> None:
    if _loop is None:
        return
    payload = json.dumps({"topic": topic, "stamp": stamp, "data": data})
    asyncio.run_coroutine_threadsafe(_broadcast(payload), _loop)


async def _handler(websocket) -> None:
    _clients.add(websocket)
    try:
        await websocket.wait_closed()
    finally:
        _clients.discard(websocket)


async def _serve() -> None:
    async with websockets.serve(_handler, "localhost", WS_PORT):
        print(f"[ros_bridge] WebSocket server listening on ws://localhost:{WS_PORT}")
        await asyncio.get_running_loop().create_future()


def _spin_ros(node: ROSSubscriber) -> None:
    rclpy.spin(node)


def main() -> None:
    global _loop
    rclpy.init()
    node = ROSSubscriber(on_data=_on_ros_data)

    _loop = asyncio.new_event_loop()
    asyncio.set_event_loop(_loop)

    spin_thread = threading.Thread(target=_spin_ros, args=(node,), daemon=True)
    spin_thread.start()

    print("[ros_bridge] ROS2 subscriber started")
    try:
        _loop.run_until_complete(_serve())
    except KeyboardInterrupt:
        print("\n[ros_bridge] Shutting down")
    finally:
        node.destroy_node()
        rclpy.shutdown()


if __name__ == "__main__":
    main()

from types import SimpleNamespace
from unittest.mock import MagicMock
from ros_bridge.constants.topics import TOPIC_IMU


def _make_imu_msg(qx=0.0, qy=0.0, qz=0.0, qw=1.0,
                  avx=0.1, avy=0.2, avz=0.3,
                  lax=0.0, lay=0.0, laz=9.81,
                  sec=1711234567, nanosec=123000000):
    stamp = SimpleNamespace(sec=sec, nanosec=nanosec)
    header = SimpleNamespace(stamp=stamp)
    orientation = SimpleNamespace(x=qx, y=qy, z=qz, w=qw)
    angular_velocity = SimpleNamespace(x=avx, y=avy, z=avz)
    linear_acceleration = SimpleNamespace(x=lax, y=lay, z=laz)
    return SimpleNamespace(
        header=header,
        orientation=orientation,
        angular_velocity=angular_velocity,
        linear_acceleration=linear_acceleration,
    )


def test_imu_callback_calls_on_data():
    from ros_bridge.subscriber import ROSSubscriber
    on_data = MagicMock()
    node = ROSSubscriber(on_data=on_data, _skip_rclpy=True)
    node.imu_callback(_make_imu_msg())
    on_data.assert_called_once()
    topic, stamp, data = on_data.call_args[0]
    assert topic == TOPIC_IMU


def test_imu_callback_parses_orientation():
    from ros_bridge.subscriber import ROSSubscriber
    on_data = MagicMock()
    node = ROSSubscriber(on_data=on_data, _skip_rclpy=True)
    node.imu_callback(_make_imu_msg(qx=0.1, qy=0.2, qz=0.3, qw=0.9))
    _, _, data = on_data.call_args[0]
    assert data["orientation"] == {"x": 0.1, "y": 0.2, "z": 0.3, "w": 0.9}


def test_imu_callback_parses_angular_velocity():
    from ros_bridge.subscriber import ROSSubscriber
    on_data = MagicMock()
    node = ROSSubscriber(on_data=on_data, _skip_rclpy=True)
    node.imu_callback(_make_imu_msg(avx=1.1, avy=2.2, avz=3.3))
    _, _, data = on_data.call_args[0]
    assert data["angular_velocity"] == {"x": 1.1, "y": 2.2, "z": 3.3}


def test_imu_callback_parses_linear_acceleration():
    from ros_bridge.subscriber import ROSSubscriber
    on_data = MagicMock()
    node = ROSSubscriber(on_data=on_data, _skip_rclpy=True)
    node.imu_callback(_make_imu_msg(lax=0.5, lay=-0.3, laz=9.81))
    _, _, data = on_data.call_args[0]
    assert data["linear_acceleration"] == {"x": 0.5, "y": -0.3, "z": 9.81}


def test_imu_callback_computes_stamp():
    from ros_bridge.subscriber import ROSSubscriber
    on_data = MagicMock()
    node = ROSSubscriber(on_data=on_data, _skip_rclpy=True)
    node.imu_callback(_make_imu_msg(sec=1000, nanosec=500_000_000))
    _, stamp, _ = on_data.call_args[0]
    assert abs(stamp - 1000.5) < 1e-9


def test_imu_callback_excludes_covariances():
    from ros_bridge.subscriber import ROSSubscriber
    on_data = MagicMock()
    node = ROSSubscriber(on_data=on_data, _skip_rclpy=True)
    node.imu_callback(_make_imu_msg())
    _, _, data = on_data.call_args[0]
    assert "orientation_covariance" not in data
    assert "angular_velocity_covariance" not in data
    assert "linear_acceleration_covariance" not in data

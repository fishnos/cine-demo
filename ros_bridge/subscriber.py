from ros_bridge.constants.topics import TOPIC_IMU, TOPIC_POSE, TOPIC_VELOCITY

try:
    import rclpy
    from rclpy.node import Node
    from sensor_msgs.msg import Imu
    from geometry_msgs.msg import PoseStamped, TwistStamped
    _ROS_AVAILABLE = True
except ImportError:
    _ROS_AVAILABLE = False
    class Node:
        def __init__(self, *args, **kwargs):
            pass
        def create_subscription(self, *args, **kwargs):
            pass
        def destroy_node(self):
            pass


class ROSSubscriber(Node):
    def __init__(self, on_data, _skip_rclpy=False):
        self._on_data = on_data
        if not _skip_rclpy:
            super().__init__("cine_dashboard_subscriber")
            self._setup_subscriptions()

    def _setup_subscriptions(self):
        if not _ROS_AVAILABLE:
            return
        self.create_subscription(Imu, TOPIC_IMU, self.imu_callback, 10)
        self.create_subscription(PoseStamped, TOPIC_POSE, self.pose_callback, 10)
        self.create_subscription(TwistStamped, TOPIC_VELOCITY, self.velocity_callback, 10)

    def imu_callback(self, msg):
        stamp = msg.header.stamp.sec + msg.header.stamp.nanosec * 1e-9
        data = {
            "orientation": {
                "x": msg.orientation.x,
                "y": msg.orientation.y,
                "z": msg.orientation.z,
                "w": msg.orientation.w,
            },
            "angular_velocity": {
                "x": msg.angular_velocity.x,
                "y": msg.angular_velocity.y,
                "z": msg.angular_velocity.z,
            },
            "linear_acceleration": {
                "x": msg.linear_acceleration.x,
                "y": msg.linear_acceleration.y,
                "z": msg.linear_acceleration.z,
            },
        }
        self._on_data(TOPIC_IMU, stamp, data)

    def pose_callback(self, msg):
        stamp = msg.header.stamp.sec + msg.header.stamp.nanosec * 1e-9
        data = {
            "position": {
                "x": msg.pose.position.x,
                "y": msg.pose.position.y,
                "z": msg.pose.position.z,
            },
        }
        self._on_data(TOPIC_POSE, stamp, data)

    def velocity_callback(self, msg):
        stamp = msg.header.stamp.sec + msg.header.stamp.nanosec * 1e-9
        data = {
            "linear": {
                "x": msg.twist.linear.x,
                "y": msg.twist.linear.y,
                "z": msg.twist.linear.z,
            },
        }
        self._on_data(TOPIC_VELOCITY, stamp, data)

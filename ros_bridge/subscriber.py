import json

from ros_bridge.constants.topics import (
    TOPIC_IMU, TOPIC_POSE, TOPIC_VELOCITY,
    TOPIC_WAYPOINTS, TOPIC_PARAMS,
    TOPIC_TRAJECTORY, TOPIC_FOCUS_OBJECT,
)

try:
    import rclpy
    from rclpy.node import Node
    from rclpy.qos import QoSProfile, ReliabilityPolicy, DurabilityPolicy
    from sensor_msgs.msg import Imu
    from geometry_msgs.msg import PoseStamped, TwistStamped, PointStamped
    from nav_msgs.msg import Path
    from std_msgs.msg import String
    _ROS_AVAILABLE = True
except ImportError:
    _ROS_AVAILABLE = False
    class Node:
        def __init__(self, *args, **kwargs):
            pass
        def create_subscription(self, *args, **kwargs):
            pass
        def create_publisher(self, *args, **kwargs):
            return None
        def destroy_node(self):
            pass


class ROSSubscriber(Node):
    def __init__(self, on_data, _skip_rclpy=False):
        self._on_data = on_data
        self._ignore_next_waypoints = False
        self._waypoints_pub = None
        self._params_pub = None
        if not _skip_rclpy:
            super().__init__("cine_dashboard_subscriber")
            self._setup_subscriptions()

    def _setup_subscriptions(self):
        if not _ROS_AVAILABLE:
            return
        self.create_subscription(Imu, TOPIC_IMU, self.imu_callback, 10)
        self.create_subscription(PoseStamped, TOPIC_POSE, self.pose_callback, 10)
        self.create_subscription(TwistStamped, TOPIC_VELOCITY, self.velocity_callback, 10)
        transient_qos = QoSProfile(
            reliability=ReliabilityPolicy.RELIABLE,
            durability=DurabilityPolicy.TRANSIENT_LOCAL,
            depth=1,
        )
        self.create_subscription(Path, TOPIC_WAYPOINTS, self.waypoints_callback, transient_qos)
        self._waypoints_pub = self.create_publisher(Path, TOPIC_WAYPOINTS, transient_qos)
        self._params_pub = self.create_publisher(String, TOPIC_PARAMS, 10)
        self.create_subscription(Path, TOPIC_TRAJECTORY, self.trajectory_callback, 10)
        self.create_subscription(PointStamped, TOPIC_FOCUS_OBJECT, self.focus_callback, 10)

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

    def trajectory_callback(self, msg):
        stamp = msg.header.stamp.sec + msg.header.stamp.nanosec * 1e-9
        poses = [
            {"x": p.pose.position.x, "y": p.pose.position.y, "z": p.pose.position.z}
            for p in msg.poses
        ]
        self._on_data(TOPIC_TRAJECTORY, stamp, {"poses": poses})

    def focus_callback(self, msg):
        stamp = msg.header.stamp.sec + msg.header.stamp.nanosec * 1e-9
        data = {"x": msg.point.x, "y": msg.point.y, "z": msg.point.z}
        self._on_data(TOPIC_FOCUS_OBJECT, stamp, data)

    def waypoints_callback(self, msg):
        if self._ignore_next_waypoints:
            self._ignore_next_waypoints = False
            return
        poses = [
            {
                "x": p.pose.position.x,
                "y": p.pose.position.y,
                "z": p.pose.position.z,
            }
            for p in msg.poses
        ]
        self._on_data(TOPIC_WAYPOINTS, 0.0, {"poses": poses})


    def publish_params(self, data):
        if not _ROS_AVAILABLE or self._params_pub is None:
            return
        msg = String()
        msg.data = json.dumps(data)
        self._params_pub.publish(msg)

    def publish_waypoints(self, positions):
        if not _ROS_AVAILABLE or self._waypoints_pub is None:
            return
        msg = Path()
        for pos in positions:
            ps = PoseStamped()
            ps.pose.position.x = float(pos.get("x", 0.0))
            ps.pose.position.y = float(pos.get("y", 0.0))
            ps.pose.position.z = float(pos.get("z", 0.0))
            ps.pose.orientation.w = 1.0
            msg.poses.append(ps)
        self._ignore_next_waypoints = True
        self._waypoints_pub.publish(msg)

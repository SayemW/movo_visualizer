// Import ROS Library from ROS Web Tools
var ros = new ROSLIB.Ros({
    url: "ws://localhost:9090"
});

const status = document.getElementById("status");

// Test ROS Connection
ros.on("connection", function() {
    status.innerText = "Connected";
});

ros.on("error", function(error) {
    status.innerText = "Disconnected";
});

ros.on("close", function() {
    status.innerText = "Disconnected";
});

// Joint angles
var tilt_joint = 0;
var pan_joint = 0;

var linear_joint = 0;

var right_arm_joints;
var left_arm_joints;

//Set of subscribers for the Kinova - MOVO
// Head Control Message
movo_head_cmd_subscriber = new ROSLIB.Topic({
    ros: ros,
    name: "movo/head/cmd",
    messageType: "movo_msgs/PanTiltCmd"
});

movo_head_cmd_subscriber.subscribe(function(message) {
    pan_joint = message.pan_cmd.pos_rad;
    tilt_joint = message.tilt_cmd.pos_rad;
});

// Torso Control Message
movo_linear_actuator_cmd_subscriber = new ROSLIB.Topic({
    ros: ros,
    name: "movo/linear_actuator_cmd",
    messageType: "movo_msgs/LinearActuatorCmd"
});

movo_linear_actuator_cmd_subscriber.subscribe(function(message) {
    linear_joint = message.desired_position_m;
});

// Right arm controls
movo_right_arm_joint_states_subsciber = new ROSLIB.Topic({
    ros: ros,
    name: "movo/right_arm/joint_states",
    messageType: "sensor_msgs/JointState"
})

movo_right_arm_joint_states_subsciber.subscribe(function(message) {
    right_arm_joints = message;
});

// Left arm controls
movo_left_arm_joint_states_subsciber = new ROSLIB.Topic({
    ros: ros,
    name: "movo/left_arm/joint_states",
    messageType: "sensor_msgs/JointState"
})

movo_left_arm_joint_states_subsciber.subscribe(function(message) {
    left_arm_joints = message;
});

// Gripper Control Message
movo_gripper_subscriber = new ROSLIB.Topic({
    ros: ros,
    name: "movo/gripper",
    messageType: "movo_msgs/Gripper"
});

movo_gripper_subscriber.subscribe(function(message) {
    console.log(message);
});

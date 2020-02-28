// Import ROS Library from ROS Web Tools
var ros = new ROSLIB.Ros({
    url: "ws://localhost:9090"
});

window.onload(() => {
    // Test ROS Connection
    ros.on("connection", function() {
        document
            .getElementById("robot_staus")
            .innerHTML("Kinova MOVO - Connected");
    });

    ros.on("error", function(error) {
        document
            .getElementById("robot_staus")
            .innerHTML("Kinova MOVO - Disconnected");
    });

    ros.on("close", function() {
        document
            .getElementById("robot_staus")
            .innerHTML("Kinova MOVO - Disconnected");
    });
});

//Set of subscribers for the MOVO
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
    console.log(message);
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

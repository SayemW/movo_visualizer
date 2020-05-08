/**
 * Instead of hard coding the ROS topics this aims to read
 * the ROS topics from a json file and then subscribe to those
 * topics.
 */
// Import ROS Library from ROS Web Tools
var ros = new ROSLIB.Ros({
    url: "ws://localhost:9090",
});

const status = document.getElementById("status");

// Test ROS Connection
ros.on("connection", function () {
    status.innerText = "Connected";
});

ros.on("error", function (error) {
    status.innerText = "Disconnected";
});

ros.on("close", function () {
    status.innerText = "Disconnected";
});

// Subscribes to ros topic based on the json files
var robot_obj = JSON.parse(robot_json);

var topics = robot_obj.topics;
var subscribers = [];

// Get the topics from the json file and generate subscribers
topics.forEach((topic) => {
    subscribers.push(
        new ROSLIB.Topic({
            ros: ros,
            name: topic.subscriber_info.name,
            messageType: topic.subscriber_info.name,
        })
    );
});

// Subscribe to the ROS topics
subscribers.forEach((subscriber) => {
        subscriber.subscribe(function(message) {
            // Message contains the topic information 
            // doSometing(message)
        });

});

// TODO : Read the topic information and associate that with the respective joint
// in the 3D model. Look at animate.js for specifics.
# Web MOVO

Sayem Wani | CS 699 | 10th May 2020

## Purpose:

This documentation describes in chronological order the development of Web MOVO. It details the features that made it to the application and those that didn&#39;t. Additionally, it describes the libraries and packages that were used and why others were not chosen. It also talks about the limitations of the project and suggests areas where it can be improved.

## Project Description:

The application is a web visualizer for the Kinova MOVO. The software runs in the browser and loads the model of the Kinova MOVO by default. Any other robot model can be loaded by dragging and dropping in the robot description. The user can move the robot joints in the application and it is also capable of mimicking the actual robot&#39;s motion in real time. Finally, the user can click anywhere on the robot model to simulate a collision occurring at that point and the camera will pan to bring that point in view.

## Github Repo:

[https://github.com/uwgraphics/WebMovo](https://github.com/uwgraphics/WebMovo)

## Project Timeline:

Loading the Kinova MOVO model into the browser

The first step of the project was to get the robot model into the browser. I initially considered using babylon.js ([babylonjs.com/](https://www.babylonjs.com/)) instead of three.js ([threejs.org/](https://threejs.org/)) as the 3D library. Babylon is a newer library and has much better community support than three. Babylon&#39;s documentation is also arguably better than three&#39;s. The most compelling reason behind why I wanted to use Babylon was it&#39;s physics support which is much more developed than three.js ([medium.com/@hiteshkrsahu/player-2-has-joined-the-game-three-js-vs-babylon-dea49bf00466](https://medium.com/@hiteshkrsahu/player-2-has-joined-the-game-three-js-vs-babylon-dea49bf00466)). Despite all this I ended up using three.js as the 3D library since I could not find any simple way to import a robot model into babylon.js. It might be a good project to develop a urdf loader for babylon.js.

When looking up ways to load a robot model into a web browser two libraries popped up: Ros3djs ([wiki.ros.org/ros3djs/](http://wiki.ros.org/ros3djs/)) &amp; urdf-loder ([npmjs.com/package/urdf-loader](https://www.npmjs.com/package/urdf-loader)). Out of these two urdf-loader was newer and more actively maintained. It was also easier to use the urdf-loader to load the robot model which is why I chose it over ros3djs. I took cues from the demo provided in urdf-loader and designed a similar interface for the WebMovo.

![Alt Text](asstes/movo)

The application requires that the robot description provided contains the robot meshes and the urdf files. Generally, the urdf files are converted to xacro format as it allows more code reuse when describing the robot model. The xacro files need to be converted to urdf. I struggled to convert xacro to urdf on a Windows machine. It is very easy to do this conversion on a linux machine (it&#39;s just executing one command) ([answers.ros.org/question/202162/urdf-or-xacro/](https://answers.ros.org/question/202162/urdf-or-xacro/)).

## Getting real time visualization to work

Having the MOVO loaded into three.js and being able to control the joints the next step was to get the web MOVO to mimic the actual MOVO. Libraries provided by ROS Web Tools can be used to get the browser to talk to the physical robot. I used roslibjs ([https://github.com/RobotWebTools/roslibjs](https://github.com/RobotWebTools/roslibjs)) for this purpose.

The application needs to subscribe to various topics related to the movement of the Kinova MOVO. These topics can be looked up using the ros topic list command on the robot. These topics were hard coded into the application and using roslibjs the web MOVO subscribes to each topic. Whenever something is published to these ROS topics an event is triggered and the Web MOVO receives a message containing the new joint angles. These joint angles are then associated with the corresponding joint angles on the web MOVO model and the new joint angle on the web MOVO is set. Again, the correlation between the ROS topic and the joint on the model is hard coded.

TODO: I am still not sure what message is posted to a ROS topic when the robot attempts to move into a position that is not possible. For example, if the robot arm is in contact with the wall and the user tells the robot to move the arm further towards the wall. Since the arm cannot move towards the wall anymore will the joint angle that is being published be equal to the current joint angle or what the joint angle is supposed to be? Researching online the answer seems to be the former but I was unable to test this. In case it is the latter the Web MOVO will not be displaying the current state of the MOVO but the &quot;supposed to be&quot; state.

## Developing an animation system

With the real time visualization part done I want to focus on features that would make the Web MOVO useful as a simulator. I began building a simple animation system where key-frames were specified and the robot would interpolate through those frames. I began with trying to get this to work for only a single frame and then add on additional functionality like chaining animations together. ![](RackMultipart20200603-4-plzlh2_html_21932dbd43d31a62.gif)

Creating an animation system using just three.js was much harder than I thought. I ran into a lot of trouble trying to get the robot model to do what I wanted. Even trying to get simple animations working involved a lot of code and the entire process became very messy. I looked for solutions online and this led me to finding tween.js ([github.com/tweenjs/tween.js/](https://github.com/tweenjs/tween.js/)).

But before I tried to continue building an animation system I felt that I needed some form of collision system to determine when the robot was colliding with itself. To me it seemed that having collision detection working will be helpful when working on animation. So, I put this on hold.

I was unable to continue working on this feature since the priorities on what features would be useful changed. I am not sure how useful it would be to continue working on this feature but a very simple base has been established for reference. Nonetheless, I would suggest trying to build an animation system using tween.js rather than continuing to build on what I implemented using just three.js.

## Detecting collisions

This is where the limitations of three.js became very apparent. After researching online I began to write a simple collision system on my own using the raycaster class. It was simple enough to get collision detection working for simple shapes like cubes and spheres but it became clear very early on that trying to get collisions for complicated shapes like those in the MOVO by writing my own system was going to be very hard. Subsequently, I began searching for existing physics systems for three.js. Physijs ([chandlerprall.github.io/Physijs/](https://chandlerprall.github.io/Physijs/)) was the most suggested library.

I began writing small example programs to test out collision detection using physijs and the results seemed very promising. However, trying to get physijs to work with Web MOVO turned out to be much harder. To get physijs working I needed to make some changes to the existing setup of Web MOVO. To get physics working, instead of using three.js objects we needed to use physijs objects which are built on top of three.js objects. For example, instead of using THREE.scene we use Physi.js. While most of these changes were easy to make I was reluctant to make some changes which involved modifying the urdf-loader library. I wanted the web MOVO to be compatible with newer versions of urdf-loader.

Therefore, instead of making changes to the loaded model I planned on making another physijs mesh exactly like the MOVO model and overlay it on the robot model. All the movements that would happen to the MOVO model would happen to the physijs model and I would be able to detect collisions using this. I did this by making the physijs meshes children of the corresponding three.js mesh / adding corresponding meshes to the same group. To my surprise collision detection didn&#39;t work. It turns out the physijs fails to work when it is a child of a non physijs object or belongs to the same group as a non physijs object. With the last update made to physijs occurring 5 years ago it was unlikely that this issue would be resolved. I began trying to figure out some other way to get collisions to work but upon talking to the professor it was suggested that I don&#39;t bother with detecting collisions myself and instead assume that collision information will be provided externally.

Suggestion: In case someone is required to use three.js and wants to do collisions I would suggest using Ammo.js directly with three.js ([github.com/kripken/ammo.js/](https://github.com/kripken/ammo.js/)). From what I have read about this it is not straightforward to get ammo.js working with three.js. On the other hand, this effort may be worth it since ammo.js has better support and is still actively maintained.

## Moving the camera around

Having an external program provide collision information meant that the Web MOVO had to focus on showing the collision information to the user in a useful way. This means that when a collision is detected at some point the camera should move such that the user has the best view of the collision point.

The first part of implementing this feature was moving the camera around. Again to get this to happen using just three.js turned out to be messy and upon reading online forums I decided to use tween.js for camera movement ([github.com/tweenjs/tween.js/](https://github.com/tweenjs/tween.js/)). Tweenjs is a really useful library and provides a nice way to describe the animation you want. I decided that as a starting point the camera movement should be restricted along a sphere around the robot model. Using tweenjs I got the camera to smoothly move along the bounding sphere.

![](RackMultipart20200603-4-plzlh2_html_2e4bb4944ac5d7d.gif)

## Finding the best place for the camera

Having camera controls I needed to figure out what is the best place to move the camera to. The most important requirement for the camera is that there must be an unobscured view from the camera to the point of collision. Based on this idea I used the raycaster class to find candidate positions on the bounding sphere. The best candidate positions (based on my preference) were either normal or tangent to the direction of collision. Therefore, the further the candidate points were from the normal or tangent the more they were penalized. Several other parameters can be added that define what a good camera position is. The way I tested this was by simulating a collision by clicking on the robot and checking to see if the camera moves to show this position. There is a pretty glaring problem with this approach. For me to click on a point on the robot I must already have line of sight to this point. Therefore, I couldn&#39;t test many situations that would probably occur in the real world. Nonetheless, I believe that the foundations I built are pretty solid on can be added upon in the future.

## ![](RackMultipart20200603-4-plzlh2_html_382805f6853f3fbd.gif)

TODO: LookAt. The lookAt function by default looks at the center of the robot. For some reason when using tweenjs to animate the camera keeps switching between looking at the center of the robot and at the point of collision. I believe that this problem is caused by the urdf-viewer which forces the camera to always look at the center of the robot. The simple fix is to change the setting in the urdf-viewer, I think it would be better if this could be fixed without making any changes to the external library to ensure compatibility with future versions.

TODO: Having the camera moving along just a bounding sphere may be too restrictive. Having the camera move to any point in the space may be better. In that case more definitions of what makes a camera angle good need to be defined.

TODO: Set up a way to get collison information from an external source. Instead of simulating collisions with a mouse click it would be better if there is an actual way to get collision information. This would also be helpful in testing if the feature works well and improving upon it. Additionally, I have assumed that it is possible for an external application to provide Web MOVO with the point of collision. This may not be the case in reality. It will be helpful to know what actual information about collisions is available.

## Making Web MOVO more than just Web MOVO

The next step was to ensure that it was easy to load another robot into the application. The urdf-loader had a file called dragAndDrop.js that allowed the user to simply drag and drop a robot description into the browser and have it load. With some changes I was able to make almost all functionality mentioned above work with any robot.

The feature that didn&#39;t work was the real time visualization part since the ROS topics and associations between messages and joints in the robot model were hard coded. I could not find any way to get this to work without explicitly specifying the ROS topics and the writing down associations since I believe that there does not exist a standard way of specifying ros topics and messages. Professor suggested that I allow a user to input these values through a json file which is what I did. I wrote a script that allows a user to load this json data by dragging and dropping the json file in the browser. The program then subscribes to the required topics based on the user input and also forms associations between ros topics and joints in the robot model.

TODO: This feature has not been tested at all. I do not think it will work the way it is right now and some additional information will be required to be put in the json file. Once the complete requirements are determined I think it should be easy enough to get this feature to work.

# threecannon
Functions for melding three.js and cannon.js

## Getting Started
Import the functions like this:
```html
<script src="https://cdn.jsdelivr.net/gh/agent-biscutt/threecannon@0.0.13/index.js" type="text/javascript"></script>
 ```
 After this, it's as simple as calling the name of the function like so:
 ```js
 var WandS = createWorld()
 ```
 `WandS` is both your CANNON world and THREE scene together!
 
 All CANNON objects in these functions are always `[0]` of any object, and all THREE objects are always `[1]`. This is useful information for interfacing this project with your own.
 
 Add objects with `add()`!
 
 This function makes it easier to add objects to your world/scene.
 ```js
 add(object,WandS)
 ```
 
 Built in `sync()` function makes it easy to sync the movements of the CANNON world to the visuals of the THREE scene.
 
 ```js
 objects=[[cannonBox,threeBox]]
function render(){
  /*--snip--*/
  sync(objects) 
  /*--snip--*/
}
```

## Functions

### Window events
For window resizing, I use this:
```js
window.addEventListener('resize', function (){onWindowResize(camera,renderer)}, false);
```
Normally I add this after the `render()` statement as to avoid `ReferenceError` mistakes.

### First person
For mouse movement, related to first person viewing for camera, I have provided this:
```js
firstPlayer(camera)
```
This makes the camera rotate with the mouse as if in first person.

### Making Objects
So far, only a few objects are supported.

Sphere:
```js
var sphere=makeSphere(size=1,mass=1,colour=0xffffff);
```
Box:
```js
var box=makeBox(sizex,sizey=sizex,sizez=sizex,mass=1,colour=0xffffff);
```
Cylinder:
```js
var cylinder=makeCylinder(radiusTop=1,radiusBottom=1,height=1,mass=1,heightSegments=32,colour=0xffffff);
```
### Moving Objects
I use this to apply even impulses to objects:
```js
move(ob,x=0,y=0,z=0);
```
Just pass the three/cannon list pair to the function.
e.g:
```js
move([cannonObject,threeObject],10,2,2);
```

### Making worlds and scenes
This project uses `createWorld()` to create the CANNON world and THREE scene.

So call this as:
```js
WandS=createWorld()
```
Else, just pass your own CANNON world and THREE scene to a list, respectively.

For example, `WandS[0]` should and will always be a CANNON world, and `WandS[1]` should and will always be a THREE scene.

### Moving and syncing cannon.js objects to three.js objects
It is suggested that you keep all objects together in an array, like so:
```js
var objects=[box,sphere,cylinder];
```
Then, you pass that list to this function every render loop:
```js
sync(objects)
```
For renderloop example:
```js
function render(){
  /*--snip--*/
  sync(objects);
  /*--snip--*/
};
render();
```


Some cookie functions are also added to this package:
```js
setCookie(name,value,days);
var cookie=getCookie(name);
eraseCookie(name);
```

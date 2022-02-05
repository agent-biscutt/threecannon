# threecannon
### Some functions for melding three.js and cannon.js
## Functions

## Window events
For window resizing, I use this:
```js
window.addEventListener('resize', function (){onWindowResize(camera,renderer)}, false)
```
Normally I add this after the `render()` statement as to avoid `ReferenceError` mistakes.

### First person
For mouse movement, related to first person viewing for camera, I have provided this:
```js
firstPlayer(camera)
```
This makes the camera rotate with the mouse as if in first person.

## Making Objects
So far, only a few objects are supported.
Sphere:
```js
```
Box:
```js
makeBox(size,mass,colour)
```
Cylinder:
```js
```
## Moving Ojects
I use this to apply even impulses to objects:
```js
move(ob,x=0,y=0,z=0)
```
Just pass the three/cannon list pair to the function.
e.g:
```js
move([cannonObject,threeObject],10,2,2)
```

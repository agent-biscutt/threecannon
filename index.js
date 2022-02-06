// Some basic cookie functions:
function setCookie(name,value,days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days*24*60*60*1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "")  + expires + "; path=/";
};
function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for(var i=0;i < ca.length;i++) {
    var c = ca[i];
    while (c.charAt(0)==' ') 
      c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) 
      return c.substring(nameEQ.length,c.length);
  }
  return null;
};
function eraseCookie(name) {
  document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};

// Window resizing function
function onWindowResize(camera,renderer) {
  // update camera aspect
  camera.aspect = window.innerWidth / window.innerHeight;
  //update camera veiw
  camera.updateProjectionMatrix();
  // resize renderer
  renderer.setSize(window.innerWidth, window.innerHeight);
  // render the frame again
  render();
};

// Movement based functions
// function movement(moveditem,object) { // not in development yet
//   if (object.right==true){move(moveditem,speed);
//                          }else if (object.left==true){
//                            move(moveditem,-speed);
//                          }if (object.up==true){
//                            move(moveditem,0,0,-speed);
//                          }if (object.down==true){
//                            move(moveditem,0,0,speed);
//                          }if (object.space==true){move(moveditem,0,speed);
//                                                  }
// };
function move(ob,x=0,y=0,z=0){
  // applys an impulse to the object, in order to move with force rather than just translating the object.
  ob[0].applyLocalImpulse(new CANNON.Vec3(x,0 ,0),ob.quaternion); //x
  ob[0].applyLocalImpulse(new CANNON.Vec3(0,y,0),ob.quaternion); //y
  ob[0].applyLocalImpulse(new CANNON.Vec3(0,0,z),ob.quaternion); //z
};

// Creating objects
function makeSphere(size=1,mass=1,colour=0xffffff){
  //create CANNON body to house shape
  var boxbody = new CANNON.Body({ mass: mass });
//   create sphere shape
  var boxShape = new CANNON.Sphere(size);
  // add shape to body
  boxbody.addShape(boxShape);
  // create geometry for sphere
  var geo= new THREE.SphereGeometry(size);
  // create material for sphere with specified colour
  var mat = new THREE.MeshLambertMaterial( { color: colour } );
  // make material and geometry into THREE shape
  var boxMesh = new THREE.Mesh(geo, mat);
  // set position of cannon body as 0,0,0
  boxbody.position.set(0,0,0);
  // return CANNON/THREE set asw list
  return([boxbody,boxMesh]);
};
function makeBox(sizex,sizey=sizex,sizez=sizex,mass=1,colour=0xffffff){
  // create CANNON body to house shape
  var boxbody = new CANNON.Body({ mass: mass });
  // create box shape. Size is divided by two because CANNON measures in full extents, while THREE measures in half that
  var boxShape = new CANNON.Box(new CANNON.Vec3(sizex/2,sizey/2,sizez/2));
  // add shape to body
  boxbody.addShape(boxShape);
  // create geometry for THREE shape
  var geo= new THREE.BoxGeometry(sizex,sizey,sizez);
  // create material with specified colour
  var mat = new THREE.MeshLambertMaterial( { color: colour } );
  // create THREE shape using the geometry and the material
  var boxMesh = new THREE.Mesh(geo, mat);
//   set CANNON body at world 'center'
  boxbody.position.set(0,0,0);
  // return CANNON/THREE set as list.
  return([boxbody,boxMesh]);
}

function makeCylinder(radiusTop=1,radiusBottom=1,height=1,mass=1,heightSegments=32,colour=0xffffff){
  // create THREE cylinder geometry
  const geometry = new THREE.CylinderGeometry( radiusTop,radiusBottom, height, heightSegments );
  // THREE basic material with specified colour
  const material = new THREE.MeshBasicMaterial( {color: colour} );
  // CANNON body
  var boxbody = new CANNON.Body({ mass: mass });
  // CANNON shape
  var boxShape = new CANNON.Cylinder(radiusTop/1,radiusBottom/1,height/1.3,heightSegments);
  // add shape to body
  boxbody.addShape(boxShape);
  // create new quaternion
  var quat = new CANNON.Quaternion();
  // set quaternion from 90/270 degree angle
  quat.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
  // set base translation point
  var translation = new CANNON.Vec3(0,0,0);
  // transform CANNON cylinder points 90/270 degrees, making the cylinder visually match with the THREE cylinder\
  boxShape.transformAllPoints(translation,quat);
  // had the above change not happened, the cylinder would have its physics at right angles to it,
  // that is, the cylinder's visual vertices would not match up with its physical ones.
  
  // return CANNON/THREE list set. THREE mesh is created here too
  return([boxbody,new THREE.Mesh( geometry, material )]);
};

// Creating THREE.js scene and CANNON.js world
function createWorld(){
  // return a new CANNON world, and new THREE scene as list.
  return([new CANNON.World,new THREE.Scene])
};

// Add function to add objects created by above functions into world+scene also created by above function
function add(o,ws){
  // add CANNON object to CANNON world
  ws[1].add(o[1]);
  // add THREE shape to THREE scene
  ws[0].add(o[0])
};

// "First Person" view functions
// mouseCatch attempts to lock the cursor
function mouseCatch(doc){
  // a counter for amount of tries
  var c=0;
  
  // while the cursor isn't locked
  while(document.pointerLockElement==null){
    // plus one to 'tries'
    c+=1;
    //request lock
    doc.body.requestPointerLock();
    //active == true. Variable is important for determining other function things
    active=true;
    
    // if the 'try' count is above 50, chuck an error
    if (c>5000){throw('Cursor failed to lock');}
  }
  }
// function for controlling first person camera
  function look(event,camera,sensitivity=100) {
    // if the lock is active
    if (active){
      //change rotation to act like 'person view'
      camera.rotation.order="YXZ";
      //change y
      camera.rotation.y -= event.movementX/(5*sensitivity);
      // limits x (up and down) rotation between 'top' and 'bottom'
      // if this wasn't here, user could flip the camera upside down
      if ((camera.rotation.x-event.movementY/(5*sensitivity))<-1){
      camera.rotation.x=-1;
      }else if ((camera.rotation.x-event.movementY/(5*sensitivity))>1){
      camera.rotation.x=1;
      }else{
        // else just move as usual
      camera.rotation.x -= event.movementY/(5*sensitivity);
      }
    }
  }
    // checks lock state
  function changepointer() {
    // if cursor isn't locked to element, lock is active
    if(document.pointerLockElement!=null){
      // lock is active
      active=true;
    }else{
      // else, lock is inactive, or false
      active=false;
    }
  }
    //first player view function. Simulates first player
function firstPlayer(camera,doc=document){
  // add lock checker
  doc.addEventListener('pointerlockchange', function(){changepointer();}, false);
  // add onclick lkock initiator
  doc.body.addEventListener('click', function(){mouseCatch(doc);}, false)
  // add movement/camera rotator
  doc.body.addEventListener('mousemove', function(){look(event,camera);}, false);
}
// Sync three.js and cannon.js objects
function sync(objects,camrotate=false){
  // iterate through objects
  for (x in objects){
    //iterate through each list in objects
    for (y in objects[x]){
      // if camera, don't update rotation unless specified
      if (objects[x][y] instanceof THREE.Camera && camrotate==false) {
        objects[x][y].position.copy(objects[x][0].position);
      }else{
        //else, rotate and position THREE objects in sync with CANNON object
        //copy position
        objects[x][y].position.copy(objects[x][0].position);
        //copy rotation
        objects[x][y].quaternion.copy(objects[x][0].quaternion);
        // NOTE: objects[x][0] will always be considered the CANNON physics object
      }
    }
  }
}

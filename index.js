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
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
};

// Movement based functions
function movement(moveditem,object) {
  if (object.right==true){move(moveditem,speed);
                         }else if (object.left==true){
                           move(moveditem,-speed);
                         }if (object.up==true){
                           move(moveditem,0,0,-speed);
                         }if (object.down==true){
                           move(moveditem,0,0,speed);
                         }if (object.space==true){move(moveditem,0,speed);
                                                 }
};
function move(ob,x=0,y=0,z=0){
  ob[0].applyLocalImpulse(new CANNON.Vec3(x,0 ,0),ob.quaternion);
  ob[0].applyLocalImpulse(new CANNON.Vec3(0,y,0),ob.quaternion);
  ob[0].applyLocalImpulse(new CANNON.Vec3(0,0,z),ob.quaternion);
};

// Creating objects
function makeSphere(size=1,mass=1,colour=0xffffff){
  var boxbody = new CANNON.Body({ mass: mass });
  var boxShape = new CANNON.Sphere(size);
  boxbody.addShape(boxShape);
  var geo= new THREE.SphereGeometry(size);
  var mat = new THREE.MeshLambertMaterial( { color: colour } );
  var boxMesh = new THREE.Mesh(geo, mat);
  boxbody.position.set(0,0,0);
  return([boxbody,boxMesh]);
};
function makeBox(sizex,sizey=sizex,sizez=sizex,mass=1,colour=0xffffff){
  var boxbody = new CANNON.Body({ mass: mass });
  var boxShape = new CANNON.Box(new CANNON.Vec3(sizex/2,sizey/2,sizez/2));
  boxbody.addShape(boxShape);
  var geo= new THREE.BoxGeometry(sizex,sizey,sizez);
  var mat = new THREE.MeshLambertMaterial( { color: colour } );
  var boxMesh = new THREE.Mesh(geo, mat);
  boxbody.position.set(0,0,0);
  return([boxbody,boxMesh]);
}

function makeCylinder(radiusTop=1,radiusBottom=1,height=1,mass=1,heightSegments=32,colour=0xffffff){
  const geometry = new THREE.CylinderGeometry( radiusTop,radiusBottom, height, heightSegments );
  const material = new THREE.MeshBasicMaterial( {color: colour} );
  var boxbody = new CANNON.Body({ mass: mass });
  var boxShape = new CANNON.Cylinder(radiusTop/1,radiusBottom/1,height/1.3,heightSegments);
  boxbody.addShape(boxShape);
  var quat = new CANNON.Quaternion();
  quat.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
  var translation = new CANNON.Vec3(0,0,0);
  boxShape.transformAllPoints(translation,quat);
  return([boxbody,new THREE.Mesh( geometry, material )]);
};

// Creating THREE.js scene and CANNON.js world
function createWorld(){
  return([new CANNON.World,new THREE.Scene])
};

// Add function to add objects created by above functions into world+scene also created by above function
function add(o,ws){
  ws[1].add(o[1]);
  ws[0].add(o[0])
};

// "First Person" view functions
// catch mouse
function mouseCatch(doc){
    doc.body.requestPointerLock();
    active=true;
  }
  function look(event,camera) {
    if (active){
      camera.rotation.order="YXZ";
      camera.rotation.y -= event.movementX/500;
      camera.rotation.x -= event.movementY/500;
    }
  }
  function changepointer(doc) {
    if(doc.pointerLockElement != null){
      active=true;
    }else{
      active=false;
    }
  }
function firstPlayer(camera,doc){
  
  doc.body.addEventListener('pointerlockchange', function(){changepointer(doc);}, false);
  doc.body.addEventListener('onclick', function(){mouseCatch(doc);}, false)
  doc.body.addEventListener('pointerlockchange', function(){look(event,camera);}, false);
}
// Sync three.js and cannon.js objects
function sync(objects){
  for (x in objects){
    for (y in objects[x]){
      if (objects[x][y] instanceof THREE.Camera) {
        objects[x][y].position.copy(objects[x][0].position);
      }
        objects[x][y].position.copy(objects[x][0].position);
        objects[x][y].quaternion.copy(objects[x][0].quaternion);
    }
  }
}

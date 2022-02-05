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
  ob.applyLocalImpulse(new CANNON.Vec3(x,0 ,0),ob.quaternion);
  ob.applyLocalImpulse(new CANNON.Vec3(0,y,0),ob.quaternion);
  ob.applyLocalImpulse(new CANNON.Vec3(0,0,z),ob.quaternion);
};

// Creating objects
function makeSphere(size,mass,colour){
  var boxbody = new CANNON.Body({ mass: mass });
  var boxShape = new CANNON.Sphere(size);
  boxbody.addShape(boxShape);
  var geo= new THREE.SphereGeometry(size);
  var mat = new THREE.MeshLambertMaterial( { color: colour } );
  var boxMesh = new THREE.Mesh(geo, mat);
  boxbody.position.set(0,0,0);
  return([boxbody,boxMesh]);
};
function makeBox(size,mass,colour){
  var boxbody = new CANNON.Body({ mass: mass });
  var boxShape = new CANNON.Box(new CANNON.Vec3(size/2,size/2,size/2));
  boxbody.addShape(boxShape);
  var geo= new THREE.BoxGeometry(size,size,size);
  var mat = new THREE.MeshLambertMaterial( { color: colour } );
  var boxMesh = new THREE.Mesh(geo, mat);
  boxbody.position.set(0,0,0);
  return([boxbody,boxMesh]);
};
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


import * as THREE from 'three';
import {FontLoader} from 'three/addons/loaders/FontLoader.js';
import {TextGeometry} from 'three/addons/geometries/TextGeometry.js';
import {OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color( 0x181818 );
const camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 1000 );
let textMesh;

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', onWindowResize, false);

const container = document.querySelector('.threejswork');
container.appendChild(renderer.domElement);


//Add light source
const dirLight = new THREE.DirectionalLight( 'white', 1 );//strength
dirLight.position.set( 0, 30, 0 ).normalize();
scene.add( dirLight );

const ambLight = new THREE.AmbientLight( 'white', 1.3 );
ambLight.position.set( 1, 1, 0 );
scene.add( ambLight );

//<!------------ PLANE----------------->
// Create a large plane
const planeGeometry = new THREE.PlaneGeometry(100, 100);

// Render loop required
const loader = new FontLoader();
loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
  const geometry = new TextGeometry('what you\ngonna get?', {
    font: font,
    size: 7,
    height: 2,
    curveSegments: 10,
    bevelEnabled: true,
    bevelThickness: 0.1,
    bevelSize: .1,
    bevelSegments: 3,
  });

  const material = new THREE.MeshNormalMaterial({ 
    wireframe: false, // Set to true if you want to display the wireframe
    flatShading: false, // Set to true for flat shading, false for smooth shading
    color: 0xc94477
});

const burgerloader = new GLTFLoader();
burgerloader.load('Files/burger.glb', (gltf) => {
    const model = gltf.scene;
    model.scale.set(7, 7, 7);
    model.position.set(10, 10, -3);
    scene.add(model);
});


textMesh = new THREE.Mesh(geometry, material);
scene.add(textMesh);
  
textMesh = new THREE.Mesh(geometry, material);
  scene.add(textMesh);


  //add edge line
  const edges = new THREE.EdgesGeometry(geometry);
  const edgeMaterial = new THREE.LineBasicMaterial({  color: 0xFD935A, linewidth: 2 }); // Change the color as needed
  const edgeLines = new THREE.LineSegments(edges, edgeMaterial);
  scene.add(edgeLines);

  camera.position.x = 15;
  camera.position.z = 25;
  camera.position.y = 40;
  
  const controls = new OrbitControls( camera, renderer.domElement );

  controls.update();

  const animate = function () {
    requestAnimationFrame(animate);
    controls.update();
    
    renderer.render(scene, camera);
  };

  animate();
});
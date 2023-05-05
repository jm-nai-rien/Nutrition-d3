import * as THREE from 'three';
import {FontLoader} from 'three/addons/loaders/FontLoader.js';
import {TextGeometry} from 'three/addons/geometries/TextGeometry.js';
import {OrbitControls } from 'three/addons/controls/OrbitControls.js';

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
const dirLight = new THREE.DirectionalLight( 'white', 3 );//strength
dirLight.position.set( 0, 30, 0 ).normalize();
scene.add( dirLight );

const ambLight = new THREE.AmbientLight( 'white', 3 );
ambLight.color.setHSL( 23, 1, 0.5 );
ambLight.position.set( 1, 30, 0 );
scene.add( ambLight );

//<!------------ PLANE----------------->
// Create a large plane
const planeGeometry = new THREE.PlaneGeometry(100, 100);

// Create gradient canvas texture
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 10;
canvas.height = 100;

const centerX = canvas.width / 2;
const centerY = canvas.height / 2;
const maxRadius = Math.sqrt(centerX * centerX + centerY * centerY);

const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius);
gradient.addColorStop(0, "#FD935A");
gradient.addColorStop(0.5, "#181818");

ctx.fillStyle = gradient;
ctx.fillRect(0, 0, canvas.width, canvas.height);

const texture = new THREE.CanvasTexture(canvas);
// Create the gradient material
const gradientMaterial = new THREE.MeshBasicMaterial({ map: texture, });

// Create the mesh and add it to the scene
const mesh = new THREE.Mesh(planeGeometry, gradientMaterial);
mesh.position.set(0, 0, -10); // Position the plane behind your scene objects
scene.add(mesh);
//<!------------ PLANEEnd----------------->

// Render loop required
const loader = new FontLoader();
loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', function (font) {
  const geometry = new TextGeometry('FOOD', {
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
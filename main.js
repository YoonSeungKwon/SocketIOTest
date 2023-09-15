import * as THREE from 'three';
import WebSocket from 'ws';
import {io} from 'socket.io-client';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, window.innerWidth/ window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGL1Renderer();
const keys = {
    KeyA:false,
    KeyD:false,
    KeyW:false,
    KeyS:false,
}
const socket = io('http://localhost:3000', {
    cors:{
        origin:'*',
    }
});
var cube;

init();
animate();

function init(){
    geo();
    createCube();
    cube.add(camera);
    camera.translateZ(5);
    camera.translateY(2); 
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    document.addEventListener('keydown', function(e){
        if(keys[e.code] !== undefined){
            keys[e.code] = true;
        }
    });
    document.addEventListener('keyup', function(e){
        if(keys[e.code] !== undefined){
            keys[e.code] = false;
        }
    });
}

function geo(){
    const grid = new THREE.GridHelper(20, 20);
    const axis = new THREE.AxesHelper();
    scene.add(grid);
    scene.add(axis);
}

function createCube(){
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({color:0x00ff00, transparent:true, opacity:0.5,});
    cube = new THREE.Mesh(geometry, material);
    cube.translateY(0.5);
    scene.add(cube);
}

function animate(){
    requestAnimationFrame(animate);
    
    var speed = 0;
    if(keys.KeyW)
        speed = -0.05;
    if(keys.KeyS)
        speed = 0.05;
    if(keys.KeyA){
        cube.rotateY(0.05);
    }
    if(keys.KeyD){
        cube.rotateY(-0.05);
    }
    cube.translateZ(speed);
    renderer.render( scene, camera);
}

socket.on('connect', ()=>{
    setInterval(()=>{
        socket.emit('update', {
            t: Date.now(),
            p: cube.position,
            r: cube.rotation,
        })
    }, 50)
})
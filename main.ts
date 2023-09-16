import * as THREE from 'three'
import {io} from 'socket.io-client'
import TWEEN from '@tweenjs/tween.js'

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(70, window.innerWidth/ window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGL1Renderer()
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({color:0x00ff00, transparent:true, opacity:0.5,})



type KEY= {
    [index:string]:boolean
}

const keys:KEY= {
    KeyA:false,
    KeyD:false,
    KeyW:false,
    KeyS:false,
}

const socket = io('http://localhost:3000')
const myObject = new THREE.Object3D()
const cubes:{[id:string]:THREE.Mesh}= {}

var myId = ''
var timeStamp = 0

init();
animate();

function init(){
    geo()
    camera.translateZ(5)
    camera.translateY(2);
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)
    document.addEventListener('keydown', function(e:KeyboardEvent){
        if(keys[e.code] !== undefined){
            keys[e.code] = true
        }
    });
    document.addEventListener('keyup', function(e:KeyboardEvent){
        if(keys[e.code] !== undefined){
            keys[e.code] = false
        }
    });
}

function geo(){
    const grid = new THREE.GridHelper(20, 20)
    const axis = new THREE.AxesHelper()
    scene.add(grid)
    scene.add(axis)
}

function animate(){
    requestAnimationFrame(animate)
    
    TWEEN.update()

    var speed:number = 0
    if(keys.KeyW)
        speed = -0.05
    if(keys.KeyS)
        speed = 0.05
    if(keys.KeyA){
        cubes[myId].rotation.y += 0.05
    }
    if(keys.KeyD){
        cubes[myId].rotation.y -= 0.05
    }
    if(speed != 0){
        cubes[myId].translateZ(speed)
        cubes[myId].add(camera)
        camera.lookAt(cubes[myId].position)
    }
    renderer.render( scene, camera)
}


//Socket IO Client

socket.on('connect', ()=>{
    console.log('connect')
})

socket.on('disconnect', ()=>{
    console.log('disconnect')
})

socket.on('id', (id)=>{
    myId = id;
    setInterval(()=>{
        socket.emit('update', {
            t: Date.now(),
            p: cubes[myId].position,
            r: cubes[myId].rotation,
        })
    }, 10)
})

socket.on('clients', (clients:any)=>{
    Object.keys(clients).forEach((p)=>{
        timeStamp = Date.now()
        if(!cubes[p]){
            cubes[p] = new THREE.Mesh(geometry, material)
            cubes[p].name = p
            scene.add(cubes[p])
        }
        else{
            if(clients[p].p){
                new TWEEN.Tween(cubes[p].position)
                    .to(
                        {
                            x: clients[p].p.x,
                            y: clients[p].p.y,
                            z: clients[p].p.z,
                        },
                        10
                    )
                    .start()
            }
            if (clients[p].r) {
                new TWEEN.Tween(cubes[p].rotation)
                    .to(
                        {
                            x: clients[p].r._x,
                            y: clients[p].r._y,
                            z: clients[p].r._z,
                        },
                        10
                    )
                    .start()
            }
        }
    })
})

socket.on('removeClient', (id: string) => {
    scene.remove(scene.getObjectByName(id) as THREE.Object3D)
})
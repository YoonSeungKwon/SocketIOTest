import express from 'express'
import http from 'http'
import { Socket, Server } from 'socket.io'

const port:number = 3000


class App{

    private member:number = 0
    private port: number       
    private server: http.Server
    private io: Server
    private clients:any = {}        //Saving clients {Runtime, Position, Rotation}

    //Constructor
    constructor(port:number){

        //Port
        this.port = port
        const app = express() 
        this.server = new http.Server(app)

        //CORS Policy
        this.io = new Server(this.server, {
            cors: {
              origin: "*",
              methods: ["GET", "POST"]
            }
          })
        

        //Socket.IO on Connection
        this.io.on('connection', (socket:Socket) => {
            this.clients[socket.id] = {}
            console.log(this.clients)
            this.member += 1
            console.log('User Connected: ' + socket.id)
            console.log('Current Members: ' + this.member)

            //Send Socket ID
            socket.emit('id', socket.id)

            //Socket Disconnected
            socket.on('disconnect', () => {
                this.member -= 1
                console.log('User Disconnected: ' + socket.id)
                console.log('Current Members: ' + this.member) 
                if(this.clients && this.clients[socket.id]){
                    console.log('deleting'+socket.id)
                    delete this.clients[socket.id]
                    this.io.emit('removeClient', socket.id)
                }
            })
            
            //Saving Data Interval
            socket.on('update', (message)=>{
                if(this.clients[socket.id]){
                    this.clients[socket.id].t = message.t
                    this.clients[socket.id].p = message.p
                    this.clients[socket.id].r = message.r
                }
            })

        })

        //Send Data to Client
        setInterval(()=>{
            this.io.emit('clients', this.clients)
        }, 10)

    }
    
    //Server Start Method
    public Start(){
        this.server.listen(this.port, ()=>{
            console.log("Server is Listening Port:" + this.port )
        })
    }
}

//Server Start
new App(port).Start()



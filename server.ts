import express from 'express'
import http from 'http'
import { Socket, Server } from 'socket.io'

const port:number = 3000


class App{

    private port: number
    private server: http.Server
    private io: Server
    private clients:any = {}

    constructor(port:number){
        this.port = port
        const app = express() 
        this.server = new http.Server(app)
        this.io = new Server(this.server, {
            cors: {
              origin: "*",
              methods: ["GET", "POST"]
            }
          })

        this.io.on('connection', (socket:Socket) => {
            console.log(socket.constructor.name)
            this.clients[socket.id] = {}
            console.log(this.clients)
            console.log('a user connected ' + socket.id)
            socket.on('disconnect', () => {
                console.log('a user disconnected ' + socket.id)
                if(this.clients && this.clients[socket.id]){
                    console.log('deleting'+socket.id)
                    delete this.clients[socket.id]
                }
            });
        
            socket.on('update', (message)=>{
                if(this.clients[socket.id]){
                    this.clients[socket.id].p = message.t
                    this.clients[socket.id].p = message.p
                    this.clients[socket.id].p = message.r
                }
            })
        })

    }

    public Start(){
        this.server.listen(this.port, ()=>{
            console.log("Server is Listening Port:" + this.port )
        })
    }
}

new App(port).Start()



const express = require('express')
const http = require('http')
const path = require('path')
const socketIO = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketIO(server) //socket.io expects to be called with raw http server

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')


app.use(express.static(publicDirectoryPath))



io.on('connection', (socket) => {
    console.log('new websocket connection')

    socket.emit('message', 'Welcome!')
    socket.broadcast.emit('message', 'New user has joined the chat')

    socket.on('send-msg', (message) => {
        io.emit('message', message)
    })

    socket.on('disconnect', () => {
        io.emit('message', 'A user has left')
    })
})


server.listen(port, ()=> {
    console.log('server running on port ' + port)
})


const express = require('express')
const http = require('http')
const path = require('path')
const socketIO = require('socket.io')
const Filter = require('bad-words')

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

    socket.on('send-msg', (message, callback) => {
        const filter = new Filter()

        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed!!')
        }

        io.emit('message', message)
        callback()
    })


    socket.on('send-location', (coords, callback) => {
        io.emit('message', `https://google.com/maps?q=${coords.latitude},${coords.longitude}`)

        callback('The location of the user has been shared')
    })
    


    socket.on('disconnect', () => {
        io.emit('message', 'A user has left')
    })
})


server.listen(port, ()=> {
    console.log('server running on port ' + port)
})


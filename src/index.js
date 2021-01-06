const express = require('express')
const http = require('http')
const path = require('path')
const socketIO = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')
const { groupEnd } = require('console')


const app = express()
const server = http.createServer(app)
const io = socketIO(server) //socket.io expects to be called with raw http 


const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')



app.use(express.static(publicDirectoryPath))



io.on('connection', (socket) => {
    console.log('new websocket connection')


    socket.on('join', ({ username, room }, callback) => {

        const { error, user } = addUser({ id: socket.id, username, room })

        if(error) {
            return callback(error)
        }


        socket.join(user.room)

        socket.emit('message', generateMessage('Admin', 'Welcome!'))
        socket.broadcast.to(user.room).emit('message', generateMessage(`${user.username} has joined!`)) // will emit the message for everyone in that specific room

        io.to(user.room).emit('roomData' , {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        callback()

    })


    socket.on('send-msg', (message, callback) => {

        const user = getUser(socket.id)

        const filter = new Filter()

        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed!!')
        }

        io.to(user.room).emit('message', generateMessage(user.username, message))
        callback()
    })


    socket.on('send-location', (coords, callback) => {

        const user = getUser(socket.id)

        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`))

        callback()
    })
    


    socket.on('disconnect', () => {

        const user = removeUser(socket.id)

        if(user) {
            
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left ${user.room}!`))

            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }
    })
})


server.listen(port, ()=> {
    console.log('server running on port ' + port)
})




// socket.emit, io.emit, socket.broadcast.emit
//io.to.emit, socket.broadcast.to.emit  <- same as above but only in the specific room  to()
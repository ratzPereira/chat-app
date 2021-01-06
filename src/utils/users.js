const users = []


//add new user
const addUser = ({ id, username, room }) => {
    //clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //validate the data
    if(!username || !room) {
        return {
            error: "User and room are required!"
        }
    }

    // Check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    //validate username
    if(existingUser) {
        return {
            error: "Username in use!"
        }
    }

    //store user
    const user = {id, username, room}
    users.push(user)
    return { user }

}


//remove user
const removeUser = (id) => {
    const index = users.findIndex((user) => {
        return user.id === id
    })

    if(index !== -1) {
        return users.splice(index, 1)[0]         //remove by index      0 because is the first found and return only that object
    }
}


//get User
const getUser = (id) => {

    return users.find((user) => user.id === id)
}

//get all users in X room
const getUsersInRoom = (room) => {

    return users.filter((users) => room === users.room)
}



module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}

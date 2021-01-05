const socket = io()

socket.on('message', (message) => {
    console.log(message)
})

document.querySelector('#message-form').addEventListener('submit', (e) =>{
    e.preventDefault()

    const message = e.target.elements.message.value       //the message in e.target.elements.message.value is the input name in html. so we don't mess up with multiple input forms


    socket.emit('send-msg', message, (error) => {
        if (error) {
            return console.log(error)
        }

        console.log('The message was delivered!')
    })
})



document.querySelector('#send-location').addEventListener('click', () => {
    
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser!')
    }

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('send-location', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, (sharedLocation) => {
            console.log(sharedLocation)
        })
    })
})

const socket = io()

socket.on('message', (message) => {
    console.log(message)
})

document.querySelector('#message-form').addEventListener('submit', (e) =>{
    e.preventDefault()

    const message = e.target.elements.message.value       //the message in e.target.elements.message.value is the input name in html. so we don't mess up with multiple input forms
    socket.emit('send-msg', message)
})

const socket = io()

//Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $locationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')


//templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML



socket.on('message', (message) => {
    console.log(message.text)

    const html = Mustache.render(messageTemplate, {          //render the content
        message: message.text,
        createdAt: moment(message.createdAt).format('HH:mm A')
    }) 
    
    $messages.insertAdjacentHTML('beforeend', html)
    
})


socket.on('locationMessage', (message) => {

    console.log(message)
    const html = Mustache.render(locationTemplate, {
        url: message.url,
        createdAt: moment(message.createdAt).format('HH:mm A')
    })
    console.log(html)
    $messages.insertAdjacentHTML('beforeend', html)
})



$messageForm.addEventListener('submit', (e) =>{
    e.preventDefault()
    
    $messageFormButton.setAttribute('disabled', 'disabled')  //disable the button form util a new message is written 
    
    const message = e.target.elements.message.value       //the message in e.target.elements.message.value is the input name in html. so we don't mess up with multiple input forms


    socket.emit('send-msg', message, (error) => {

        $messageFormButton.removeAttribute('disabled')    //enable  the button again
        $messageFormInput.value = ''                     //clear the form text
        $messageFormInput.focus()                        //keep the focus cursor in the form               


        if (error) {
            return console.log(error)
        }

        console.log('The message was delivered!')
    })
})



$locationButton.addEventListener('click', () => {
    
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser!')
    }

    $locationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('send-location', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, (sharedLocation) => {
            $locationButton.removeAttribute('disabled')
            console.log(sharedLocation)
        })
    })
})

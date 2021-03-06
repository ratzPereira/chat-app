const socket = io()

//Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $locationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')
const $sidebar = document.querySelector('#sidebar')


//templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML


//Options
const {username, room} = Qs.parse(location.search, { ignoreQueryPrefix: true }) //The location.search property contains the query string of an URI (including the ?) , we parse it and save the room and the username



const autoScroll = () => {
    //New message element
    const $newMessage = $messages.lastElementChild  //we get the last message send ( the element)

    //Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)  //whe get here the value of the margin bottom
    const newMessageMargin = parseInt(newMessageStyles.marginBottom) // we get that value in this variable
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin // now we know the height of the margin we can calculate the total height 

    //visible height
    const visibleHeight = $messages.offsetHeight // we get the off set height of the message element

    //Height of messages container
    const containerHeight = $messages.scrollHeight  // here we get the total height of the container ( what we see and what not)

    //How far have I scrolled
    const scrollOffSet = $messages.scrollTop + visibleHeight // here we know how far down we scroll

    if (containerHeight - newMessageHeight <= scrollOffSet) {  // to total height we subst the message element height and if that number is < or = the scroll of set 
        $messages.scrollTop = $messages.scrollHeight
    }
}




socket.on('message', (message) => {
    console.log(message.text)

    const html = Mustache.render(messageTemplate, { 
        username: message.username,         //render the content
        message: message.text,
        createdAt: moment(message.createdAt).format('HH:mm A')
    }) 
    
    $messages.insertAdjacentHTML('beforeend', html)
    autoScroll()
})


socket.on('locationMessage', (message) => {

    console.log(message)
    const html = Mustache.render(locationTemplate, {
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format('HH:mm A')
    })
    console.log(html)
    $messages.insertAdjacentHTML('beforeend', html)
    autoScroll()
    
})


socket.on('roomData', ({ room, users }) => {
    
    const html = Mustache.render(sidebarTemplate, {
        users,
        room
    })
    document.querySelector('#sidebar').innerHTML = html
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


socket.emit('join', {username, room}, (error) => {
    if(error) {
        alert(error)
        location.href = '/'
    }
})
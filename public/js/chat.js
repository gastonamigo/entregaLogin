const socket = io()

let username

Swal.fire({
    title: "Introduce tu correo:",
    input: "text",
    inputValidator: (value)=>{
        return !value && "Es obligatorio introducir el correo."
    },
    allowOutsideClick: false
}).then((result)=>{   
    username = result.value
})

const chatInput = document.getElementById("chat-input")
const messages = document.getElementById("messages")

chatInput.addEventListener("keyup", (ev)=>{
    if (ev.key === "Enter"){
        const inputMessage = chatInput.value

        if (inputMessage.trim().length > 0){
            socket.emit("chat-message", {user: username, message: inputMessage})
            chatInput.value = ""
        }
    }
})

socket.on("set-messages", (data)=>{
    console.log(data)
    messages.innerHTML = ""
    data.forEach((m)=>{
        messages.innerHTML += `<p><strong>${m.user}:</strong> ${m.message}</p>`
    })
})

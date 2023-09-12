const socket = io();

const chatInput = document.getElementById('inputChat')
const chatButton = document.getElementById('chatButton')
const messagesP = document.getElementById('messagesP')

let email = '';

    Swal.fire({
        title: 'Registro de ususario',
        text: 'Por favor ingrese el email',
        input: 'text',
        inputValidator: valor => {
            return !valor && 'Ingrese un email válido';
        },
        allowOutsideClick: false,
    })
    .then(result => {
        email = result.value;
    });

chatButton.addEventListener('click', () => {
    if (chatInput.value.trim().length > 0) {
        socket.emit('mensaje', {
            email: email,
            message: chatInput.value,
        });
        chatInput.value = '';
    }
});

socket.on('mensajes', messages => {
	messagesP.innerHTML = '';
	messages.forEach(msg => {
		const { email, message } = msg;
		messagesP.innerHTML += `<p>${email} dice: </p> <p>${message}</p>`;
	});
});
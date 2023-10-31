

const socket = io();

const registerForm = document.getElementById('registerForm');

registerForm.addEventListener('submit', (e) =>{
    e.preventDefault();
    const formData = new FormData(e.target);
    const user = Object.fromEntries(formData);

    socket.emit('newUser', user);

    socket.on('userCreated', (message)=>{
        Swal.fire(
            'Listo!',
            message,
            'success'
        )
    })
})
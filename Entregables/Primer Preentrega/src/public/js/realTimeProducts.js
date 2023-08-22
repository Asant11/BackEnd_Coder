const socket = io();

const addform = document.getElementById('newProductForm');
const container =document.getElementById('productsContainer');
const deleteForm = document.getElementById('deleteProduct');

socket.emit('load');

socket.on('getProducts', (products) =>{
    container.innerHTML = '';
    products.forEach(prod => {
        container.innerHTML += `
        <div class="product">
            <p>ID: ${prod.id}</p>
            <p>Title:  ${prod.title}</p>
            <p>Description: ${prod.description}</p>
            <p>Price: ${prod.price}</p>
            <p>Status: ${prod.status}</p>
            <p>Code: ${prod.code}</p>
            <p>Stock: ${prod.stock}</p>
        </div>
        `
    });
})

addform.addEventListener('submit', (e) =>{
    e.preventDefault()
    const dataForm = new FormData(e.target)
    const product = Object.fromEntries(dataForm)
    socket.emit('newProduct', product)
    socket.on('newProductMsg', (message) =>{
        Swal.fire(
            'Listo!',
            message,
            'success'
        )
    })
    
})

deleteForm.addEventListener('submit', (e) =>{
    e.preventDefault()
    const dataForm = new FormData(e.target)
    const id = Object.fromEntries(dataForm)
    socket.emit('deleteProduct', id );
    socket.on('deleteMsg', (message) =>{
        Swal.fire(
            'Listo!',
            message,
            'success'
        )
    })
})



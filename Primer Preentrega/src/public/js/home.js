const socket = io();

const container =document.getElementById('productsContainer');

socket.emit('load');

socket.on('getProducts', (products) =>{
    container.innerHTML = '';
    products.forEach( (prod) => {
        container.innerHTML += `
        <div class="product">
            <p>Title:  ${prod.title}</p>
            <p>Description: ${prod.description}</p>
            <p>Category: ${prod.category}</p>
            <p>Price: ${prod.price}</p>
            <p>Status: ${prod.status}</p>
            <p>Code: ${prod.code}</p>
            <p>Stock: ${prod.stock}</p>
        </div>
        `
    });
})
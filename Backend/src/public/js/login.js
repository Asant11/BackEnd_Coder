import navigate from 'navigate'
let loginForm = document.getElementById('loginForm')
let submitBtn = document.getElementById('submitBtn')

navigate()

const handleSubmit =  async (e) => { //esto es para reemplasar el usestate y hacerlo mas rapido y simple
    e.preventDefault(); 
    const dataForm = new FormData(loginForm);//transforma la data del form html en un objeto iterable
    const data = Object.fromEntries(dataForm);  //dado un objeto iterator me lo transforma en una simple
    
    const response = await fetch('http://localhost:3000/api/session/login', {
        method:'POST',    
        headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        if (response.status === 200){
            const datos = await response.json()
        } else {
            console.log('Registro invalido')
        };
        
};


loginForm.onsubmit(handleSubmit)

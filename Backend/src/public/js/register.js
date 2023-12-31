let registerForm = document.getElementById('registerForm')


const handleSubmit =  async (e) => { //esto es para reemplasar el usestate y hacerlo mas rapido y simple
    e.preventDefault(); 
    const dataForm = new FormData(registerForm);//transforma la data del form html en un objeto iterable
    const data = Object.fromEntries(dataForm);  //dado un objeto iterator me lo transforma en una simple
    
    const response = await fetch('http://localhost:3000/api/session/register', {
        method:'POST',    
        headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (response.status === 200){
            const datos = await response.json();
            console.log(datos); 
        } else {
            console.log('Registro invalido')
        };
};

registerForm.onsubmit(handleSubmit)

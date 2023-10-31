import { useRef } from "react"
import { useNavigate} from 'react-router-dom'

export const NewProduct = () =>{
    const formRef = useRef(null);

    const navigate = useNavigate()

    const arrayCookies = document.cookie.split('; ')
    let token = null; 
    for(const cookie of arrayCookies){
        const [name, value] = cookie.split("=")
        if(name == 'jwtToken'){
            token = value
            break
        }
    }
    
    const handleSubmit = async (e) =>{
        e.preventDefault()
        const datForm = new FormData(formRef.current) //Transforma el HTML a un Objeto iterador
        const data = Object.fromEntries(datForm) // Transforma el objeto iterador a un objeto simple
        
        const response = await fetch('http://localhost:4000/api/products', {
        method: 'POST',
        headers: {
            'Content-type' : 'application/json',
            'authorization' : `${token}`
        },
        body: JSON.stringify(data)
        })

        if(response.status == 200 || response.status == 201){
            const datos = await response.json()
            console.log(datos);
            navigate('/products')
        } else{
            console.log('Error al crear producto');
        }
    }
    
    return (
        <div className="container">
            <h2>Añadir producto</h2>
            <form onSubmit={handleSubmit} ref={formRef}>
                <div className="mb-3">
                    <label htmlFor="title">Ingrese el nombre: </label>
                    <input type="text" name='title' />
                </div>
                <div className="mb-3">
                    <label htmlFor="description">Ingrese la descripción: </label>
                    <input type="text" name='description' />
                </div>
                <div className="mb-3">
                    <label htmlFor="category">Ingrese la categoría: </label>
                    <input type="text" name='category' />
                </div>
                <div className="mb-3">
                    <label htmlFor="code">Ingrese el código: </label>
                    <input type="text" name='code' />
                </div>
                <div className="mb-3">
                    <label htmlFor="price">Ingrese el precio: </label>
                    <input type="number" name='price' />
                </div>
                <div className="mb-3">
                    <label htmlFor="stock">Ingrese el stock: </label>
                    <input type="number" name='stock' />
                </div>
                <button type='submit' className="btn btn-success">Añadir producto</button>
            </form>
        </div>  
    )
}
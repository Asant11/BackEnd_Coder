import { useRef } from "react"
import { useNavigate} from 'react-router-dom'

export const Login = () =>{
    const formRef = useRef(null);

    const navigate = useNavigate()

    const handleSubmit = async (e) =>{
        e.preventDefault()
        const datForm = new FormData(formRef.current) //Transforma el HTML a un Objeto iterador
        const data = Object.fromEntries(datForm) // Transforma el objeto iterador a un objeto simple
        
        const response = await fetch('http://localhost:4000/api/sessions/login', {
        method: 'POST',
        headers: {
            'Content-type' : 'application/json',
        },
        body: JSON.stringify(data)
        })

        if(response.status == 200){
            const datos = await response.json()
            document.cookie = `jwtToken=${datos.token}; expires=${new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toUTCString()};path=/`
            navigate('/products')
        } else{
            console.log('Login inválido');
        }
    }

    return (
        <div className="container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit} ref={formRef}>
                <div className="mb-3">
                    <label htmlFor="email">Ingrese su email</label>
                    <input type="text" name='email' />
                </div>
                <div className="mb-3">
                    <label htmlFor="password">Ingrese su contraseña</label>
                    <input type="password" name='password'/>
                </div>
                <button type='submit' className="btn btn-success">Ingresar</button>
            </form>
        </div>  
    )
}
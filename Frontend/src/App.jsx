import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Login } from "./components/Login.jsx"
import { Register } from "./components/Register.jsx"
import { Products } from "./components/Products.jsx"
import { NewProduct } from "./components/newProduct.jsx"


export const App = () =>{
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/products" element={<Products />}></Route>
          <Route path="/newProduct" element={<NewProduct />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="*" element={<h1>404 Not Found</h1>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}
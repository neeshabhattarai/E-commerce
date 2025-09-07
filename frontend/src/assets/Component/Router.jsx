import {createBrowserRouter, RouterProvider} from "react-router-dom"
import Signup from "./Signup"
import Login from "./Login"
import AuthPage from "./AuthPage"
import Product from "./Product"
import AddProduct from "./AddProduct"
import AddCategory from "./AddCategory"
import CartDetails from "./CartDetails"
import BodyContainer from "./BodyContainer"
const route=createBrowserRouter([{element:
    <BodyContainer/>
  
    ,children:[
    {path:"/",element:<Login/>},
        {path:"/signup",element:<Signup/>},
        {path:"/product",element:
            <Product/>
        },
         {path:"/addproduct",element:
            <AddProduct/>
        },
        {path:"/addCategory",element:
            <AddCategory/>
        },
        {path:"/cart",element:
            <CartDetails/>
        },

]}])
 const ConfigRoute=()=>{
    return <RouterProvider router={route}/>
}
export default ConfigRoute;
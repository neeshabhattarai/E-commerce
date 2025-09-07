import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../src/assets/Component/AuthPage'

export default function ListProduct() {
    const[product,setProduct]=useState();
    const {token}=useContext(AuthContext);
    useEffect(()=>{
        if(token){
        const fetchProduct=async()=>{
            fetch("http://localhost:4000/product/",{
                method:"GET",
                headers:{
                    "Authorization":"Bearer "+token
                }
            }).then((res)=>res.json()).then(data=>setProduct(data))
        }
        
fetchProduct()
    }
},[token]
    )
  return (
    <div>
      <div>
        <div>

        <div></div>
        <div></div>
        <div></div>
        <div></div>
        </div>
      </div>
    </div>
  )
}

import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthPage";
import { Link, useNavigate, Navigate } from "react-router-dom";

export default function Navbar() {
  const { token, tokenDelete } = useContext(AuthContext);
  const navigate = useNavigate();
  

 useEffect(()=>{

 },[token])

//   🔹 If no token → redirect to login page
  if (!token) {
    return <Navigate to="/" replace />;
  }
  const handleLogout=()=>{
    if(confirm("Are you sure want to logout")){
    tokenDelete()
    navigate("/")
    }
  }

  return (
    
    <nav className="bg-gray-900 text-white px-6 py-3 flex justify-between items-center shadow-md">
      <div className="text-xl font-bold tracking-wide">My App</div>
      <div className="flex gap-6 items-center">
        <Link
          to="/product"
          className="hover:text-yellow-400 transition-colors duration-200"
        >
          Product
        </Link>
        <Link
          to="/cart"
          className="hover:text-yellow-400 transition-colors duration-200"
        >
          Cart
        </Link>
         <Link
          to="/addproduct"
          className="hover:text-yellow-400 transition-colors duration-200"
        >
       Add Product
        </Link>
         <Link
          to="/addCategory"
          className="hover:text-yellow-400 transition-colors duration-200"
        >
       Add Product
        </Link>
        <button
          onClick={handleLogout}
          className="!bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-medium transition-colors duration-200"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

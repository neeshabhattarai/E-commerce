import React, { useEffect, useState,useContext } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "./AuthPage";
import { useNavigate } from "react-router-dom";

export default function AddProduct() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [categories, setCategories] = useState([]);
  const {token}=useContext(AuthContext);
  console.log(token);
  const navigate=useNavigate();

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
        if(token){
      try {
        const res = await fetch("https://e-commerce-pmns.vercel.app/category",{
            method:"GET",
            headers:{
                "Authorization":"Bearer "+token,
                "Content-Type":"application/json"
            }
        });
        const data = await res.json();
        console.log(data);
        setCategories(data);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    }
    };
    fetchCategories();
  }, [token]);
  if(!categories || categories.length==0){
    return <div className="text-center flex flex-col gap-4 items-center">
        <h1 className="text-neutral-500">No category found </h1>
        <button onClick={()=>navigate("/addcategory")} className="!text-white !bg-blue-600">Add Category</button>
    </div>
  }

  const onSubmit = async (data) => {
  
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("price", data.price);
      formData.append("description", data.description || "");
      formData.append("category", data.category);
      formData.append("image", data.image[0]);
      const res = await fetch("https://e-commerce-pmns.vercel.app/product", {
        method: "POST",
        body:formData,
        
        headers: {
        
          "Authorization":"Bearer "+token
        },
      });

      if (res.ok) {
        alert("✅ Product added successfully!");
      } else {
        alert("❌ Failed to add product!");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Add New Product 🛒
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data" className="space-y-5">
          {/* Name (Required) */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Product Name
            </label>
            <input
              type="text"
              placeholder="Enter product name"
              {...register("name", { required: "Product name is required" })}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Price (Required) */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Price
            </label>
            <input
              type="number"
              placeholder="Enter price"
              {...register("price", { required: "Price is required" })}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.price ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>
            )}
          </div>

          {/* Image (Required) */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Image URL
            </label>
            <input
              type="file"
              placeholder="Enter image URL"
              {...register("image", { required: "Image is required" })}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.image ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            />
            {errors.image && (
              <p className="text-red-500 text-sm mt-1">
                {errors.image.message}
              </p>
            )}
          </div>

          {/* Category (Required, from DB) */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Category
            </label>
            <select
              {...register("category", { required: "Category is required" })}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.category ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">
                {errors.category.message}
              </p>
            )}
          </div>

          {/* Description (Optional) */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Description
            </label>
            <textarea
              placeholder="Enter product description (optional)"
              {...register("description")}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows="3"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full !bg-indigo-600 !hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
}

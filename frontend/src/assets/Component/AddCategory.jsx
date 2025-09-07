import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "./AuthPage";

export default function AddCategory() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const {token}=useContext(AuthContext);

  const onSubmit = async (data) => {
    try {
      const res = await fetch("http://localhost:4000/category", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
          "Authorization":"Bearer "+token
        },
      });

      if (res.ok) {
        alert("✅ Category added successfully!");
        reset();
      } else {
        alert("❌ Failed to add category!");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-indigo-600">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Add New Category 🏷️
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Category Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Category Name
            </label>
            <input
              type="text"
              placeholder="Enter category name"
              {...register("name", { required: "Category name is required" })}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full !bg-indigo-600 !hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
          >
            Add Category
          </button>
        </form>
      </div>
    </div>
  );
}

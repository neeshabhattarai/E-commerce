import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthPage";
import { useNavigate } from "react-router-dom";

export default function Product() {
  const { token } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    name: "",
    minPrice: "",
    maxPrice: "",
    category: "",
  });
  const navigate = useNavigate();

  // Fetch products with filters
  const fetchProduct = async () => {
    try {
      // Build query string from filters
      const query = new URLSearchParams(
        Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ""))
      ).toString();

      const res = await fetch("http://localhost:4000/product?" + query, {
        method: "GET",
        headers: { Authorization: "Bearer " + token },
      });

      const data = await res.json();

      // Add count property for quantity selector
      setProducts(data.map((p) => ({ ...p, count: 0 })));

      // Extract unique categories as objects (_id, name)
      const uniqueCategories = [];
      data.forEach((p) => {
        if (p.category && !uniqueCategories.find((c) => c._id === p.category._id)) {
          uniqueCategories.push(p.category);
        }
      });
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  // Fetch products on mount and when filters change
  useEffect(() => {
    if (token) fetchProduct();
  }, [token, filters]);

  // Quantity handlers
  const increment = (id) => {
    setProducts(
      products.map((p) => (p._id === id ? { ...p, count: p.count + 1 } : p))
    );
  };

  const decrement = (id) => {
    setProducts(
      products.map((p) =>
        p._id === id && p.count > 0 ? { ...p, count: p.count - 1 } : p
      )
    );
  };

  // Add to cart
  const handleAddToCart = async (product) => {
    const { count, _id } = product;
    if (count === 0) {
      alert("Please select quantity before adding to cart!");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/cart/", {
        method: "POST",
        body: JSON.stringify({ _id, count }),
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
      });

      if (res.ok) alert("Added to cart successfully!");
      else alert("Failed to add to cart.");
    } catch (error) {
      console.error(error);
      alert("Error adding to cart.");
    }
  };

  // Reset filters
  const resetFilters = () =>
    setFilters({ name: "", minPrice: "", maxPrice: "", category: "" });

  // Loading / empty state
  if (!products) return <h2 className="text-center mt-10">Loading...</h2>;

  return (
    <div className="p-6">
      {/* Filters */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 items-center">
   
        <input
          type="number"
          placeholder="Min Price"
          value={filters.minPrice}
          onChange={(e) =>
            setFilters({ ...filters, minPrice: e.target.value })
          }
          className="border px-3 py-2 rounded w-40"
        />
        <input
          type="number"
          placeholder="Max Price"
          value={filters.maxPrice}
          onChange={(e) =>
            setFilters({ ...filters, maxPrice: e.target.value })
          }
          className="border px-3 py-2 rounded w-40"
        />
        <select
          value={filters.category}
          onChange={(e) =>
            setFilters({ ...filters, category: e.target.value })
          }
          className="border px-3 py-2 rounded w-40"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
        <button
          onClick={resetFilters}
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
        >
          Reset
        </button>
      </div>

      {/* Products */}
      {products.length === 0 ? (
        <div className="text-center mt-10">
          <h2 className="text-xl mb-3">No products found</h2>
          <button
            onClick={() => navigate("/addproduct")}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Add Product
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
          {products.map((val) => (
            <div
              key={val._id}
              className="border rounded-xl shadow-md p-4 hover:shadow-lg transition w-72 flex flex-col"
            >
              <img
                src={val.image}
                alt={val.name}
                className="w-full h-40 object-cover rounded-lg mb-3"
              />
              <div className="flex flex-col mb-3">
                <div className="font-semibold text-lg truncate">{val.name}</div>
                <div className="text-green-600 font-bold text-md">
                  ${val.price}
                </div>
                <div className="text-gray-600 text-sm mt-1 truncate">
                  {val.category?.name || val.category}
                </div>
                <div className="text-gray-600 text-sm mt-1 truncate">
                  {val.description}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-1 justify-between mb-2">
                <div className="flex items-center border rounded-lg overflow-hidden">
                  <button
                    onClick={() => decrement(val._id)}
                    className="bg-gray-200 px-3 py-1 hover:bg-gray-300 transition"
                  >
                    -
                  </button>
                  <span className="px-4 text-sm text-center">{val.count}</span>
                  <button
                    onClick={() => increment(val._id)}
                    className="bg-gray-200 px-3 py-1 hover:bg-gray-300 transition"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => handleAddToCart(val)}
                  className="!bg-yellow-500 !text-[14px] text-white  rounded-lg hover:bg-yellow-600  transition"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

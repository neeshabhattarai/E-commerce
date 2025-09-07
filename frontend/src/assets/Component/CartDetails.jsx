import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from './AuthPage';
import { useNavigate } from 'react-router-dom';

export default function CartDetails() {
  const { token } = useContext(AuthContext);
  const [cart, setCart] = useState([]);
  const [quantities, setQuantities] = useState({});
  const navigate = useNavigate();

  // Fetch cart
  useEffect(() => {
    if (token) {
      const fetchCart = async () => {
        try {
          const res = await fetch("https://e-commerce-pmns.vercel.app/cart", {
            headers: { "Authorization": "Bearer " + token }
          });
          if (res.ok) {
            const data = await res.json();
            setCart(data);
            const qtys = {};
            data.forEach(item => qtys[item._id] = item.quantity);
            setQuantities(qtys);
          } else {
            console.log("Failed to fetch cart", res.status);
          }
        } catch (error) {
          console.error("Error fetching cart:", error);
        }
      };
      fetchCart();
    }
  }, [token]);

  // Delete item
  const handleDelete = async (id) => {
    console.log("Deleting item", id);
    try {
      const res = await fetch(`https://e-commerce-pmns.vercel.app/cart/${id}`, {
        method: "DELETE",
        headers: { "Authorization": "Bearer " + token }
      });
      if (res.ok) {
        setCart(cart.filter(item => item._id !== id));
        const newQuantities = { ...quantities };
        delete newQuantities[id];
        setQuantities(newQuantities);
        console.log("Deleted successfully");
      } else {
        console.log("Delete failed", res.status);
      }
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  // Edit quantity
  const handleEdit = async (id) => {
    const newQuantity = quantities[id];
    if (newQuantity < 1) return alert("Quantity must be at least 1");

    console.log("Updating item", id, "to quantity", newQuantity);
    try {
      const res = await fetch(`https://e-commerce-pmns.vercel.app/cart/${id}`, {
        method: "PUT",
        headers: {
          "Authorization": "Bearer " + token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ quantity: newQuantity })
      });

      if (res.ok) {
        setCart(cart.map(item => item._id === id ? { ...item, quantity: newQuantity } : item));
        alert("Quantity updated!");
        console.log("Updated successfully");
      } else {
        console.log("Update failed", res.status);
      }
    } catch (error) {
      console.error("Failed to update quantity:", error);
    }
  };

  if (!cart) return <h2 className="text-center mt-10">Loading...</h2>;

  if (cart.length === 0) {
    return (
      <div className="text-center mt-10">
        <div className="mb-4 text-lg">No products in cart</div>
        <button
          onClick={() => navigate("/product")}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Go Shopping
        </button>
      </div>
    );
  }

  // Calculate grand total
  const grandTotal = cart.reduce((acc, item) => {
    const qty = quantities[item._id] || 0;
    return acc + (+item.productid.price) * qty;
  }, 0);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Your Cart</h2>
      <div className="grid grid-cols-12 gap-4 font-bold border-b-2 py-2">
        <div className="col-span-4">Product Name</div>
        <div className="col-span-2">Price</div>
        <div className="col-span-2">Quantity</div>
        <div className="col-span-2">Total Price</div>
        <div className="col-span-2">Actions</div>
      </div>

      {cart.map((val) => {
        const { productid: { name, price }, _id } = val;
        const quantity = quantities[_id] || 0;

        return (
          <div key={_id} className="grid grid-cols-12 gap-4 items-center py-2 border-b">
            <div className="col-span-4">{name}</div>
            <div className="col-span-2">${price}</div>
            <div className="col-span-2">
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) =>
                  setQuantities({ ...quantities, [_id]: +e.target.value })
                }
                className="border rounded w-16 px-2 py-1 text-center"
              />
            </div>
            <div className="col-span-2">${(+price) * quantity}</div>
            <div className="col-span-2 flex gap-2">
              <button
                onClick={() => handleEdit(_id)}
                className="!bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
              >
                Add
              </button>
              <button
                onClick={() => handleDelete(_id)}
                className="!bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        );
      })}

      <div className="text-right mt-4 font-bold text-lg">
        Grand Total: ${grandTotal}
      </div>
    </div>
  );
}

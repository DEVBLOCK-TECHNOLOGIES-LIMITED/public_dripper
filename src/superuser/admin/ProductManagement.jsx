import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import uri from "../../features/config";
import AdminLayout from "../AdminLayout";
import {
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineSearch,
} from "react-icons/hi";
import { toast } from "react-toastify";
import { getProducts } from "../../features/products/productSlice";
import Modal from "../../components/Modal";

const ProductManagement = () => {
  const { user } = useSelector((state) => state.auth);
  const productsResult = useSelector((state) => state.products?.products?.data);
  const products = Array.isArray(productsResult) ? productsResult : [];
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    image: "",
    code: "", // Read-only for edit
  });

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    setFormData({ name: "", price: "", category: "", image: "", code: "" });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      image: product.image,
      code: product.code,
    });
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(
          `${uri}/api/admin/products/${formData.code}`,
          formData,
          { headers: { "x-user-email": user?.data?.email } },
        );
        toast.success("Product updated successfully");
      } else {
        await axios.post(`${uri}/api/admin/products`, formData, {
          headers: { "x-user-email": user?.data?.email },
        });
        toast.success("Product added successfully");
      }
      setIsModalOpen(false);
      dispatch(getProducts());
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save product");
    }
  };

  const handleDelete = async (code) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      await axios.delete(`${uri}/api/admin/products/${code}`, {
        headers: { "x-user-email": user?.data?.email },
      });
      toast.success("Product deleted successfully");
      dispatch(getProducts());
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete product");
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <AdminLayout>
      <div className="space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-champagne-100 tracking-tight">
              Product Catalog
            </h1>
            <p className="mt-1 text-champagne-400 font-medium">
              Manage your inventory and product listings.
            </p>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gold-500 text-noir-900 font-bold rounded-xl hover:bg-gold-400 transition-all shadow-lg shadow-gold-500/20"
          >
            <HiOutlinePlus size={20} />
            <span>Add New Product</span>
          </button>
        </header>

        {/* Search & Filter */}
        <div className="relative">
          <HiOutlineSearch
            className="absolute left-5 top-1/2 -translate-y-1/2 text-gold-500"
            size={20}
          />
          <input
            type="text"
            placeholder="Search by name or product code..."
            className="w-full pl-14 pr-6 py-4 bg-noir-800 border border-gold-500/20 rounded-xl shadow-sm focus:ring-1 focus:ring-gold-500 focus:border-gold-500 transition-all outline-none font-medium text-champagne-100 placeholder:text-champagne-500/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Product Table */}
        <div className="bg-noir-800 rounded-3xl shadow-sm border border-gold-500/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gold-500/10 text-gold-500 text-xs font-black tracking-[0.2em] uppercase border-b border-gold-500/10">
                  <th className="px-6 py-5">Product Info</th>
                  <th className="px-6 py-5">Price</th>
                  <th className="px-6 py-5">Category</th>
                  <th className="px-6 py-5">Code</th>
                  <th className="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold-500/10 text-sm">
                {filteredProducts.map((product) => (
                  <tr
                    key={product.code}
                    className="hover:bg-gold-500/5 transition-colors group"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <img
                          src={
                            product.image ||
                            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=100&auto=format&fit=crop"
                          }
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover shadow-sm bg-noir-700 border border-gold-500/20"
                        />
                        <div>
                          <p className="font-bold text-champagne-100 group-hover:text-gold-500 transition-colors">
                            {product.name}
                          </p>
                          <p className="text-xs text-champagne-400 font-medium">
                            Stock: Available
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 font-sans font-black text-champagne-100">
                      ${product.price}
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-3 py-1 bg-gold-500/10 text-gold-500 rounded-lg text-xs font-black uppercase tracking-wider border border-gold-500/20">
                        {product.category || "General"}
                      </span>
                    </td>
                    <td className="px-6 py-5 font-mono text-champagne-400 text-xs font-bold">
                      {product.code}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 text-champagne-400 hover:text-gold-500 hover:bg-gold-500/10 rounded-lg transition-all transform hover:scale-110"
                        >
                          <HiOutlinePencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.code)}
                          className="p-2 text-champagne-400 hover:text-rosegold-500 hover:bg-rosegold-500/10 rounded-lg transition-all transform hover:scale-110"
                        >
                          <HiOutlineTrash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditing ? "Edit Product" : "Add New Product"}
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-black">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Product Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none"
              placeholder="e.g. Luxury Watch"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Price ($)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Category
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none"
                placeholder="e.g. Accessories"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Image URL
            </label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              required
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none"
              placeholder="https://..."
            />
          </div>
          {isEditing && (
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Product Code (Read-only)
              </label>
              <input
                type="text"
                name="code"
                value={formData.code}
                readOnly
                className="w-full p-3 bg-gray-100 border border-gray-300 rounded-xl text-gray-500 cursor-not-allowed"
              />
            </div>
          )}
          <button
            type="submit"
            className="w-full py-3 bg-gold-500 text-white font-bold rounded-xl hover:bg-gold-600 transition-all shadow-lg"
          >
            {isEditing ? "Update Product" : "Create Product"}
          </button>
        </form>
      </Modal>
    </AdminLayout>
  );
};

export default ProductManagement;

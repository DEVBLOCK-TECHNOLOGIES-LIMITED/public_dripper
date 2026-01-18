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

const ProductManagement = () => {
  const { user } = useSelector((state) => state.auth);
  const productsResult = useSelector((state) => state.products?.products?.data);
  const products = Array.isArray(productsResult) ? productsResult : [];
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

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
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Product Catalog
            </h1>
            <p className="mt-1 text-gray-500 font-medium">
              Manage your inventory and product listings.
            </p>
          </div>
          <button className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
            <HiOutlinePlus size={20} />
            <span>Add New Product</span>
          </button>
        </header>

        {/* Search & Filter */}
        <div className="relative">
          <HiOutlineSearch
            className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search by name or product code..."
            className="w-full pl-14 pr-6 py-4 bg-white border border-gray-100 rounded-3xl shadow-sm focus:ring-4 focus:ring-blue-50 focus:border-blue-300 transition-all outline-none font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Product Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-gray-400 text-xs font-black tracking-[0.2em] uppercase">
                  <th className="px-6 py-5">Product Info</th>
                  <th className="px-6 py-5">Price</th>
                  <th className="px-6 py-5">Category</th>
                  <th className="px-6 py-5">Code</th>
                  <th className="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {filteredProducts.map((product) => (
                  <tr
                    key={product.code}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <img
                          src={
                            product.image ||
                            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=100&auto=format&fit=crop"
                          }
                          alt={product.name}
                          className="w-12 h-12 rounded-xl object-cover shadow-sm bg-gray-100"
                        />
                        <div>
                          <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-400 font-medium">
                            Stock: Available
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 font-black text-gray-700">
                      ${product.price}
                    </td>
                    <td className="px-6 py-5">
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-black uppercase tracking-wider">
                        {product.category || "General"}
                      </span>
                    </td>
                    <td className="px-6 py-5 font-mono text-gray-400 text-xs font-bold">
                      {product.code}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all transform hover:scale-110">
                          <HiOutlinePencil size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.code)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all transform hover:scale-110"
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
    </AdminLayout>
  );
};

export default ProductManagement;

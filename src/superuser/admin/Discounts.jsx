import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import uri from "../../features/config";
import AdminLayout from "../AdminLayout";
import { HiOutlinePlus, HiOutlineTrash, HiOutlineSearch } from "react-icons/hi";
import { useToast } from "../../context/ToastContext";
import { formatPrice } from "../../utils/formatPrice";
import Modal from "../../components/Modal";
import Loader from "../../components/Loader";

const Discounts = () => {
  const { user } = useSelector((state) => state.auth);
  const { toast } = useToast();
  const [discounts, setDiscounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    type: "percent",
    value: "",
  });

  const fetchDiscounts = React.useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${uri}/api/admin/discounts`, {
        headers: { "x-user-email": user?.data?.email },
      });
      setDiscounts(response.data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch discounts");
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    fetchDiscounts();
  }, [fetchDiscounts]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    setFormData({ code: "", type: "percent", value: "" });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${uri}/api/admin/discounts`, formData, {
        headers: { "x-user-email": user?.data?.email },
      });
      toast.success("Discount added successfully");
      setIsModalOpen(false);
      fetchDiscounts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add discount");
    }
  };

  const handleDelete = async (code) => {
    if (!window.confirm("Are you sure you want to delete this discount?"))
      return;
    try {
      await axios.delete(`${uri}/api/admin/discounts/${code}`, {
        headers: { "x-user-email": user?.data?.email },
      });
      toast.success("Discount deleted successfully");
      fetchDiscounts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete discount");
    }
  };

  const filteredDiscounts = discounts.filter((d) =>
    d.code.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <AdminLayout>
      <div className="space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-champagne-100 tracking-tight">
              Discount Codes
            </h1>
            <p className="mt-1 text-champagne-400 font-medium">
              Manage coupons and promo codes.
            </p>
          </div>
          <button
            onClick={handleAdd}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gold-500 text-noir-900 font-bold rounded-xl hover:bg-gold-400 transition-all shadow-lg shadow-gold-500/20"
          >
            <HiOutlinePlus size={20} />
            <span>Create Discount</span>
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
            placeholder="Search by code..."
            className="w-full pl-14 pr-6 py-4 bg-noir-800 border border-gold-500/20 rounded-xl shadow-sm focus:ring-1 focus:ring-gold-500 focus:border-gold-500 transition-all outline-none font-medium text-champagne-100 placeholder:text-champagne-500/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Discounts Table */}
        <div className="bg-noir-800 rounded-3xl shadow-sm border border-gold-500/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gold-500/10 text-gold-500 text-xs font-black tracking-[0.2em] uppercase border-b border-gold-500/10">
                  <th className="px-6 py-5">Discount Code</th>
                  <th className="px-6 py-5">Type</th>
                  <th className="px-6 py-5">Value</th>
                  <th className="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold-500/10 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="text-center py-8">
                      <Loader />
                    </td>
                  </tr>
                ) : (
                  filteredDiscounts.map((discount) => (
                    <tr
                      key={discount.code}
                      className="hover:bg-gold-500/5 transition-colors group"
                    >
                      <td className="px-6 py-5 font-mono font-bold text-champagne-100 text-lg">
                        {discount.code}
                      </td>
                      <td className="px-6 py-5">
                        <span className="px-3 py-1 bg-gold-500/10 text-gold-500 rounded-lg text-xs font-black uppercase tracking-wider border border-gold-500/20">
                          {discount.type}
                        </span>
                      </td>
                      <td className="px-6 py-5 font-sans font-black text-champagne-100">
                        {discount.type === "percent"
                          ? `${discount.value}%`
                          : `$${formatPrice(discount.value)}`}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleDelete(discount.code)}
                            className="p-2 text-champagne-400 hover:text-rosegold-500 hover:bg-rosegold-500/10 rounded-lg transition-all transform hover:scale-110"
                          >
                            <HiOutlineTrash size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
                {filteredDiscounts.length === 0 && !loading && (
                  <tr>
                    <td
                      colSpan="4"
                      className="text-center py-8 text-champagne-400"
                    >
                      No discounts found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Discount"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-black">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Discount Code
            </label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value.toUpperCase() })
              }
              required
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none uppercase font-mono"
              placeholder="e.g. SAVE10"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none bg-white"
              >
                <option value="percent">Percentage (%)</option>
                <option value="fixed">Fixed Amount ($)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Value
              </label>
              <input
                type="number"
                name="value"
                value={formData.value}
                onChange={handleInputChange}
                required
                className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gold-500 outline-none"
                placeholder={
                  formData.type === "percent" ? "e.g. 10" : "e.g. 5.00"
                }
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-gold-500 text-white font-bold rounded-xl hover:bg-gold-600 transition-all shadow-lg"
          >
            Create Discount
          </button>
        </form>
      </Modal>
    </AdminLayout>
  );
};

export default Discounts;

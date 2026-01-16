import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import uri from "../../features/config";
import AdminLayout from "../AdminLayout";
import {
  HiOutlineRefresh,
  HiOutlineEye,
  HiOutlineCheckCircle,
} from "react-icons/hi";
import { toast } from "react-toastify";

const OrderManagement = () => {
  const { user } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${uri}/api/admin/orders`, {
        headers: { "x-user-email": user?.data?.email },
      });
      setOrders(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.data?.email) fetchOrders();
  }, [user]);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `${uri}/api/admin/orders/${id}/status`,
        { status },
        {
          headers: { "x-user-email": user?.data?.email },
        }
      );
      toast.success(`Order marked as ${status}`);
      fetchOrders();
    } catch (error) {
      toast.error("Status update failed");
    }
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-700";
      case "shipped":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-amber-100 text-amber-700";
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Order Fulfillment
            </h1>
            <p className="mt-1 text-gray-500 font-medium">
              Monitor and update customer orders.
            </p>
          </div>
          <button
            onClick={fetchOrders}
            className="p-3 text-gray-500 hover:text-blue-600 hover:bg-white rounded-2xl shadow-sm border border-transparent hover:border-gray-100 transition-all"
          >
            <HiOutlineRefresh
              size={22}
              className={loading ? "animate-spin" : ""}
            />
          </button>
        </header>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-gray-400 text-xs font-black tracking-[0.2em] uppercase">
                  <th className="px-6 py-5">Order ID</th>
                  <th className="px-6 py-5">Customer</th>
                  <th className="px-6 py-5">Value</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5 text-right">Fulfillment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm font-medium">
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="px-6 py-5 font-mono text-xs text-gray-400 font-bold">
                      {order._id}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-gray-900 font-bold">
                          {order.email}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5 font-black text-gray-700">
                      ${order.total}
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${getStatusStyle(
                          order.status
                        )}`}
                      >
                        {order.status || "Processing"}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <select
                          value={order.status || "Processing"}
                          onChange={(e) =>
                            updateStatus(order._id, e.target.value)
                          }
                          className="bg-gray-100 border-none text-xs font-bold rounded-lg px-2 py-1 outline-none text-gray-600 focus:ring-2 focus:ring-blue-100"
                        >
                          <option value="Processing">Process</option>
                          <option value="Shipped">Ship</option>
                          <option value="Delivered">Deliver</option>
                        </select>
                        <button className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-all">
                          <HiOutlineEye size={18} />
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

export default OrderManagement;

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import uri from "../../features/config";
import AdminLayout from "../AdminLayout";
import { HiOutlineRefresh, HiOutlineEye } from "react-icons/hi";
import { useToast } from "../../context/ToastContext";
import { formatPrice } from "../../utils/formatPrice";

const OrderManagement = () => {
  const { user } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = useCallback(async () => {
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
  }, [user, toast]);

  useEffect(() => {
    if (user?.data?.email) fetchOrders();
  }, [user, fetchOrders]);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `${uri}/api/admin/orders/${id}/status`,
        { status },
        {
          headers: { "x-user-email": user?.data?.email },
        },
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
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "shipped":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default:
        return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    }
  };

  const getDeliveryLabel = (option) => {
    if (option === "premium") return "Premium (1-3 days)";
    return "Standard (5 days)";
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold text-champagne-100 tracking-tight">
              Order Fulfillment
            </h1>
            <p className="mt-1 text-champagne-400 font-medium">
              Monitor and update customer orders.
            </p>
          </div>
          <button
            onClick={fetchOrders}
            className="p-3 text-champagne-400 hover:text-gold-500 hover:bg-gold-500/10 rounded-2xl border border-gold-500/20 hover:border-gold-500/40 transition-all"
          >
            <HiOutlineRefresh
              size={22}
              className={loading ? "animate-spin" : ""}
            />
          </button>
        </header>

        <div className="bg-noir-800 rounded-3xl shadow-sm border border-gold-500/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gold-500/10 text-gold-500 text-xs font-black tracking-[0.2em] uppercase border-b border-gold-500/10">
                  <th className="px-6 py-5">Order ID</th>
                  <th className="px-6 py-5">Customer</th>
                  <th className="px-6 py-5">Value</th>
                  <th className="px-6 py-5">Delivery</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5 text-right">Fulfillment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold-500/10 text-sm font-medium">
                {loading ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-12 text-champagne-400"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <HiOutlineRefresh className="animate-spin" size={20} />
                        Loading orders...
                      </div>
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-12 text-champagne-400"
                    >
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr
                      key={order._id}
                      className="hover:bg-gold-500/5 transition-colors group"
                    >
                      <td className="px-6 py-5 font-mono text-xs text-champagne-500 font-bold">
                        {order._id.slice(-8).toUpperCase()}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="text-champagne-100 font-bold">
                            {order.email}
                          </span>
                          <span className="text-xs text-champagne-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 font-black text-gold-500">
                        {formatPrice(order.total)}
                      </td>
                      <td className="px-6 py-5">
                        <span className="px-3 py-1 bg-noir-900 text-champagne-300 rounded-lg text-xs font-bold border border-gold-500/20">
                          {getDeliveryLabel(order.deliveryOption)}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider border ${getStatusStyle(
                            order.status,
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
                            className="bg-noir-900 border border-gold-500/20 text-xs font-bold rounded-lg px-3 py-2 outline-none text-champagne-200 focus:ring-1 focus:ring-gold-500 cursor-pointer"
                          >
                            <option value="pending">Process</option>
                            <option value="shipped">Ship</option>
                            <option value="delivered">Deliver</option>
                          </select>
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-2 text-champagne-400 hover:text-gold-500 rounded-lg hover:bg-gold-500/10 transition-all"
                          >
                            <HiOutlineEye size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-noir-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-noir-800 rounded-3xl border border-gold-500/20 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gold-500/10 flex items-center justify-between">
              <h2 className="text-xl font-display font-bold text-champagne-100">
                Order Details
              </h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-champagne-400 hover:text-gold-500"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-champagne-500 mb-1">Order ID</p>
                  <p className="text-champagne-100 font-mono font-bold">
                    {selectedOrder._id}
                  </p>
                </div>
                <div>
                  <p className="text-champagne-500 mb-1">Customer</p>
                  <p className="text-champagne-100 font-bold">
                    {selectedOrder.email}
                  </p>
                </div>
                <div>
                  <p className="text-champagne-500 mb-1">Delivery Option</p>
                  <p className="text-champagne-100 font-bold">
                    {getDeliveryLabel(selectedOrder.deliveryOption)}
                    {selectedOrder.deliveryFee > 0 && (
                      <span className="text-gold-500 ml-2">
                        (+{formatPrice(selectedOrder.deliveryFee)})
                      </span>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-champagne-500 mb-1">Total</p>
                  <p className="text-gold-500 font-black text-lg">
                    {formatPrice(selectedOrder.total)}
                  </p>
                </div>
              </div>

              {selectedOrder.shippingAddress && (
                <div>
                  <p className="text-champagne-500 mb-2">Shipping Address</p>
                  <div className="bg-noir-900 p-4 rounded-xl border border-gold-500/10 text-champagne-200">
                    <p>{selectedOrder.shippingAddress.address}</p>
                    <p>
                      {selectedOrder.shippingAddress.city},{" "}
                      {selectedOrder.shippingAddress.state}{" "}
                      {selectedOrder.shippingAddress.zipCode}
                    </p>
                    {selectedOrder.shippingAddress.phoneNumber && (
                      <p className="text-champagne-400 mt-2">
                        Phone: {selectedOrder.shippingAddress.phoneNumber}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div>
                <p className="text-champagne-500 mb-2">Items</p>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 bg-noir-900 p-3 rounded-xl border border-gold-500/10"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-contain rounded-lg bg-noir-800"
                      />
                      <div className="flex-1">
                        <p className="text-champagne-100 font-bold text-sm">
                          {item.name}
                        </p>
                        <p className="text-gold-500 text-xs font-bold">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default OrderManagement;

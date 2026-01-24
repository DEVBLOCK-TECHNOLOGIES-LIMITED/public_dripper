import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import uri from "../../features/config";
import AdminLayout from "../AdminLayout";
import { HiOutlineShieldCheck } from "react-icons/hi";
import { useToast } from "../../context/ToastContext";
import { formatPrice } from "../../utils/formatPrice";

const UserManagement = () => {
  const { user: currentUser } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const { toast } = useToast();

  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get(`${uri}/api/admin/users`, {
        headers: { "x-user-email": currentUser?.data?.email },
      });
      setUsers(response.data.data);
    } catch (error) {
      toast.error("Failed to fetch users");
    }
  }, [currentUser, toast]);

  useEffect(() => {
    if (currentUser?.data?.email) fetchUsers();
  }, [currentUser, fetchUsers]);

  const toggleRole = async (email, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    if (!window.confirm(`Change ${email} to ${newRole}?`)) return;

    try {
      await axios.put(
        `${uri}/api/admin/users/${email}/role`,
        { role: newRole },
        {
          headers: { "x-user-email": currentUser?.data?.email },
        },
      );
      toast.success("Role updated successfully");
      fetchUsers();
    } catch (error) {
      toast.error("Failed to update role");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-display font-bold text-champagne-100 tracking-tight">
            Identity Management
          </h1>
          <p className="mt-1 text-champagne-400 font-medium">
            View and manage user permissions.
          </p>
        </header>

        <div className="bg-noir-800 rounded-3xl shadow-sm border border-gold-500/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gold-500/10 text-gold-500 text-xs font-black tracking-[0.2em] uppercase border-b border-gold-500/10">
                  <th className="px-6 py-5">User Account</th>
                  <th className="px-6 py-5">Credits</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5">Access Level</th>
                  <th className="px-6 py-5 text-right">Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold-500/10 text-sm">
                {users.map((u) => (
                  <tr
                    key={u.email}
                    className="hover:bg-gold-500/5 transition-colors group"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-2xl bg-gold-500/10 flex items-center justify-center font-black text-gold-500 shadow-inner border border-gold-500/20">
                          {u.name?.[0] || u.email[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-champagne-100">
                            {u.name || "Anonymous"}
                          </p>
                          <p className="text-xs text-champagne-500 font-medium">
                            {u.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="font-black text-gold-500">
                          {formatPrice(u.balance || 0)}
                        </span>
                        <span className="text-[10px] text-champagne-600 font-black uppercase tracking-widest">
                          Available
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse shadow-sm shadow-green-500/50"></div>
                        <span className="text-xs font-black text-champagne-400 uppercase tracking-wider">
                          Active
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider border ${
                          u.role === "admin"
                            ? "bg-gold-500/20 text-gold-400 border-gold-500/30"
                            : "bg-noir-900 text-champagne-400 border-gold-500/10"
                        }`}
                      >
                        {u.role || "User"}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => toggleRole(u.email, u.role)}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-champagne-400 hover:text-gold-500 hover:bg-gold-500/10 rounded-xl transition-all border border-transparent hover:border-gold-500/20"
                        >
                          <HiOutlineShieldCheck size={16} />
                          <span>Toggle Admin</span>
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

export default UserManagement;

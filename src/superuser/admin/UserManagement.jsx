import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import uri from "../../features/config";
import AdminLayout from "../AdminLayout";
import { HiOutlineShieldCheck } from "react-icons/hi";
import { useToast } from "../../context/ToastContext";

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
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Identity Management
          </h1>
          <p className="mt-1 text-gray-500 font-medium">
            View and manage user permissions.
          </p>
        </header>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-gray-400 text-xs font-black tracking-[0.2em] uppercase">
                  <th className="px-6 py-5">User Account</th>
                  <th className="px-6 py-5">Credits</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5">Access Level</th>
                  <th className="px-6 py-5 text-right">Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {users.map((u) => (
                  <tr
                    key={u.email}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center font-black text-gray-500 shadow-inner">
                          {u.name?.[0] || u.email[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">
                            {u.name || "Anonymous"}
                          </p>
                          <p className="text-xs text-gray-400 font-medium">
                            {u.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="font-black text-gray-700">
                          {u.balance?.toLocaleString() || 0}
                        </span>
                        <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                          Available
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse shadow-sm shadow-green-200"></div>
                        <span className="text-xs font-black text-gray-500 uppercase tracking-wider">
                          Active
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider ${
                          u.role === "admin"
                            ? "bg-purple-100 text-purple-700 border border-purple-200"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {u.role || "User"}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => toggleRole(u.email, u.role)}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
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

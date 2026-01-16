import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import uri from "../../features/config";
import AdminLayout from "../AdminLayout";
import {
  HiOutlinePlus,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineTicket,
} from "react-icons/hi";
import { toast } from "react-toastify";
import { getPackages } from "../../features/credits/creditsSlice";

const CreditManagement = () => {
  const { user } = useSelector((state) => state.auth);
  const packages = useSelector((state) => state.credits.packages);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    dispatch(getPackages());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure? This will remove the package from the store."
      )
    )
      return;
    try {
      await axios.delete(`${uri}/api/admin/credits/packages/${id}`, {
        headers: { "x-user-email": user?.data?.email },
      });
      toast.success("Package deleted");
      dispatch(getPackages());
    } catch (error) {
      toast.error("Failed to delete package");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Monetization Control
            </h1>
            <p className="mt-1 text-gray-500 font-medium">
              Manage credit packages and bonuses.
            </p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-amber-500 text-white font-bold rounded-2xl hover:bg-amber-600 transition-all shadow-lg shadow-amber-200">
            <HiOutlinePlus size={20} />
            <span>New Package</span>
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between group hover:shadow-xl transition-all h-full"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="bg-amber-50 p-4 rounded-2xl text-amber-500">
                  <HiOutlineTicket size={28} />
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <HiOutlinePencil size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(pkg.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <HiOutlineTrash size={18} />
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-black text-gray-900 mb-1">
                  {pkg.name}
                </h3>
                <p className="text-3xl font-black text-amber-500">
                  ${pkg.price}
                </p>

                <div className="mt-6 flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                  <div className="text-center flex-1">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                      Credits
                    </p>
                    <p className="text-xl font-black text-gray-800">
                      {pkg.credits?.toLocaleString()}
                    </p>
                  </div>
                  <div className="w-px h-8 bg-gray-200"></div>
                  <div className="text-center flex-1">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">
                      Bonus
                    </p>
                    <p className="text-xl font-black text-green-500">
                      +{pkg.bonus}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};

export default CreditManagement;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import uri from "../../features/config";
import AdminLayout from "../AdminLayout";
import {
  HiOutlineUserGroup,
  HiOutlineCube,
  HiOutlineCurrencyDollar,
  HiOutlineTrendingUp,
} from "react-icons/hi";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`${uri}/api/admin/stats`, {
          headers: { "x-user-email": user?.data?.email },
        });
        setStats(response.data.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.data?.email) fetchStats();
  }, [user]);

  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: <HiOutlineUserGroup size={24} />,
      color: "bg-gold-500",
    },
    {
      title: "Total Orders",
      value: stats?.totalOrders || 0,
      icon: <HiOutlineCube size={24} />,
      color: "bg-gold-500",
    },
    {
      title: "Total Pending",
      value: stats?.totalPending || 0,
      icon: <HiOutlineCube size={24} />,
      color: "bg-gold-500",
    },
    {
      title: "Total Shipped",
      value: stats?.totalShipped || 0,
      icon: <HiOutlineCube size={24} />,
      color: "bg-gold-500",
    },
    {
      title: "Total Delivered",
      value: stats?.totalDelivered || 0,
      icon: <HiOutlineCube size={24} />,
      color: "bg-gold-500",
    },
    {
      title: "Total Revenue",
      value: `£${stats?.totalRevenue?.toLocaleString() || 0}`,
      icon: <HiOutlineCurrencyDollar size={24} />,
      color: "bg-gold-500",
    },
  ];

  if (loading)
    return (
      <div className="flex items-center justify-center h-full text-gold-500 font-bold animate-pulse">
        Loading Metrics...
      </div>
    );

  return (
    <AdminLayout>
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-display font-bold text-champagne-100 tracking-tight">
            System Overview
          </h1>
          <p className="mt-1 text-champagne-400 font-medium">
            Platform performance and aggregate metrics.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, index) => (
            <div
              key={index}
              className="bg-noir-800 p-6 rounded-3xl shadow-sm border border-gold-500/10 hover:border-gold-500/30 transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <div
                  className={`bg-gold-500/10 text-gold-500 p-4 rounded-2xl shadow-lg shadow-gold-500/5`}
                >
                  {card.icon}
                </div>
              </div>
              <div className="mt-6">
                <p className="text-sm font-bold text-champagne-500 tracking-wider mb-1 uppercase">
                  {card.title}
                </p>
                <h3 className="text-3xl font-bold font-display text-champagne-100">
                  {card.value}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity Mockup */}
        <div className="bg-noir-800 rounded-3xl shadow-sm border border-gold-500/10 overflow-hidden">
          <div className="p-6 border-b border-gold-500/10 flex items-center justify-between">
            <h2 className="text-xl font-display font-bold text-champagne-100 tracking-tight">
              Recent System Pulse
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 hover:bg-gold-500/5 rounded-2xl transition-colors group cursor-pointer"
                >
                  <div className="h-10 w-10 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-500 font-bold border border-gold-500/20">
                    {i}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-champagne-200">
                      System event logged
                    </p>
                    <p className="text-xs text-champagne-400 font-medium">
                      Automatic performance check completed successfully.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-gold-500/50 uppercase">
                    2m ago
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;

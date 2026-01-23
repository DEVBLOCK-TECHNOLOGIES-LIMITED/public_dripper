import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getOrders } from "../features/orders/orderSlice";
import Loader from "../components/Loader";
import {
  HiOutlineCalendar,
  HiOutlineTicket,
  HiChevronDown,
  HiChevronUp,
  HiPrinter,
} from "react-icons/hi";
import { formatPrice } from "../utils/formatPrice";

function OrderItem({ order, user }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handlePrintInvoice = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>PublicDripper Invoice #${order._id.slice(-6).toUpperCase()}</title>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 25px; color: #1a1a1a; antialiased; font-size: 12px; }
            .header { display: flex; justify-content: space-between; margin-bottom: 25px; border-bottom: 2px solid #d4af37; padding-bottom: 15px; }
            .logo-section { display: flex; flex-direction: column; }
            .logo { font-size: 24px; font-weight: bold; color: #1a1a1a; letter-spacing: -1px; }
            .logo span { color: #d4af37; }
            .tagline { font-size: 9px; text-transform: uppercase; letter-spacing: 3px; color: #d4af37; margin-top: 3px; font-weight: bold; }
            .invoice-details { text-align: right; }
            .invoice-details h1 { margin: 0 0 5px 0; font-size: 24px; color: #1a1a1a; letter-spacing: 2px; }
            .invoice-details p { margin: 2px 0; font-size: 10px; color: #666; text-transform: uppercase; letter-spacing: 1px; }
            .main-content { margin-bottom: 25px; }
            .address-section { display: flex; justify-content: space-between; margin-bottom: 25px; }
            .address-box { flex: 1; }
            .address-box p { margin: 3px 0; font-size: 12px; color: #333; line-height: 1.4; }
            .address-box h3 { font-size: 10px; text-transform: uppercase; color: #d4af37; margin-bottom: 8px; letter-spacing: 1px; font-weight: bold; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
            th { text-align: left; padding: 10px 8px; border-bottom: 2px solid #d4af37; font-size: 10px; text-transform: uppercase; color: #1a1a1a; letter-spacing: 1px; }
            td { padding: 12px 8px; border-bottom: 1px solid #eee; font-size: 12px; color: #333; }
            .total-section { display: flex; flex-direction: column; align-items: flex-end; }
            .total-row { display: flex; justify-content: space-between; width: 250px; margin-bottom: 6px; font-size: 12px; color: #666; }
            .total-final { font-size: 16px; font-weight: bold; color: #1a1a1a; border-top: 2px solid #d4af37; padding-top: 10px; margin-top: 8px; }
            .footer { margin-top: 40px; text-align: center; font-size: 9px; color: #999; border-top: 1px solid #eee; padding-top: 20px; text-transform: uppercase; letter-spacing: 2px; }
            .watermark { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg); font-size: 100px; color: #f5f5f5; z-index: -1; font-weight: bold; }
            @media print { 
              button { display: none; } 
              body { -webkit-print-color-adjust: exact; padding: 20px; }
              @page { margin: 0; }
            }
          </style>
        </head>
        <body>
          <div class="watermark">PUBLIC DRIPPER</div>
          
          <div class="header">
            <div class="logo-section">
              <div class="logo">Public<span>Dripper</span></div>
              <div class="tagline">Luxury Redefined</div>
            </div>
            <div class="invoice-details">
              <h1>INVOICE</h1>
              <p>Invoice #: ${order._id.slice(-6).toUpperCase()}</p>
              <p>Date: ${new Date(order.createdAt).toLocaleDateString()}</p>
              <p>Status: ${order.status.toUpperCase()}</p>
            </div>
          </div>

          <div class="main-content">
            <div class="address-section">
              <div class="address-box">
                <h3>Billed To</h3>
                <p><strong>${user?.data?.name || "Valued User"}</strong></p>
                <p>${order.shippingAddress.address}</p>
                <p>${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}</p>
              </div>
              <div class="address-box" style="text-align: right;">
                <h3>Payment Details</h3>
                <p>${order.paymentMethod || "Credit Card"}</p>
                <p>${order.email}</p>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Item Collection</th>
                  <th>Reference</th>
                  <th style="text-align: right;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${order.items
                  .map(
                    (item) => `
                  <tr>
                    <td>
                      <div style="font-weight: bold; color: #1a1a1a;">${item.name}</div>
                    </td>
                    <td style="color: #666;">${item.code || "N/A"}</td>
                    <td style="text-align: right; font-weight: bold;">
                      ${
                        order.paymentMethod === "Store Credits"
                          ? `${(item.price * 100).toLocaleString()} Credits`
                          : `$${formatPrice(item.price)}`
                      }
                    </td>
                  </tr>
                `,
                  )
                  .join("")}
              </tbody>
            </table>

            <div class="total-section">
              <div class="total-row">
                <span>Subtotal</span>
                <span>${
                  order.paymentMethod === "Store Credits"
                    ? `${(order.total * 100).toLocaleString()} Credits`
                    : `$${formatPrice(order.total)}`
                }</span>
              </div>
              <div class="total-row">
                <span>Shipping</span>
                <span>Complimentary</span>
              </div>
              <div class="total-row total-final">
                <span>Total Amount</span>
                <span>${
                  order.paymentMethod === "Store Credits"
                    ? `${(order.total * 100).toLocaleString()} Credits`
                    : `$${formatPrice(order.total)}`
                }</span>
              </div>
            </div>
          </div>

          <div class="footer">
            <p>Thank you for choosing Public Dripper</p>
            <p>Authenticity Guaranteed • Global Luxury • Exclusive Access</p>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="bg-noir-800/50 rounded-2xl border border-gold-500/10 shadow-lg overflow-hidden hover:border-gold-500/30 transition-all backdrop-blur-sm">
      {/* Header Row - Always Visible */}
      <div
        className="p-6 flex flex-col md:flex-row justify-between gap-6 cursor-pointer group"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center flex-1">
          <div className="flex gap-4 items-center">
            <div className="w-12 h-12 bg-noir-900 rounded-xl flex items-center justify-center text-gold-500 font-bold text-lg border border-gold-500/20 group-hover:border-gold-500/50 transition-colors">
              #{order._id.slice(-4)}
            </div>
            <div>
              <p className="text-xs font-bold text-gold-500/60 uppercase mb-1 tracking-wider">
                Order Date
              </p>
              <p className="text-sm font-bold text-champagne-100 flex items-center gap-1">
                <HiOutlineCalendar className="text-gold-500" />
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold text-gold-500/60 uppercase mb-1 tracking-wider">
              Total Amount
            </p>
            <p className="text-sm font-black text-champagne-100">
              {order.paymentMethod === "Store Credits"
                ? `${(order.total * 100).toLocaleString()} Credits`
                : `$${formatPrice(order.total)}`}
            </p>
          </div>

          <div>
            <p className="text-xs font-bold text-gold-500/60 uppercase mb-1 tracking-wider">
              Items
            </p>
            <p className="text-sm font-bold text-champagne-400">
              {order.items.length} {order.items.length === 1 ? "Item" : "Items"}
            </p>
          </div>

          <div>
            <span
              className={`px-3 py-1 text-xs font-bold rounded-full uppercase border ${
                order.status === "completed"
                  ? "bg-green-900/20 text-green-400 border-green-500/30"
                  : order.status === "pending"
                    ? "bg-yellow-900/20 text-yellow-400 border-yellow-500/30"
                    : "bg-noir-900 text-champagne-500 border-gold-500/10"
              }`}
            >
              {order.status}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 self-end md:self-center">
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent toggling accordion
              handlePrintInvoice();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-noir-900 hover:bg-noir-800 text-gold-500 rounded-xl text-xs font-bold transition-colors border border-gold-500/20"
          >
            <HiPrinter className="text-lg" /> Invoice
          </button>

          <button
            className={`p-2 rounded-full transition-all ${
              isExpanded
                ? "bg-gold-500/10 text-gold-500"
                : "text-champagne-500 hover:text-gold-500"
            }`}
          >
            {isExpanded ? (
              <HiChevronUp className="text-xl" />
            ) : (
              <HiChevronDown className="text-xl" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="p-6 border-t border-gold-500/10 bg-noir-800/30 animate-fade-in-up">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              <h4 className="text-xs font-black text-gold-500/50 uppercase tracking-widest">
                Items Ordered
              </h4>
              <div className="space-y-3">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex gap-4 p-3 bg-noir-900/50 rounded-xl border border-gold-500/10"
                  >
                    <img
                      src={item.image}
                      alt=""
                      className="w-12 h-12 object-contain rounded-lg bg-white/5"
                    />
                    <div className="flex-1 flex justify-between items-center">
                      <div>
                        <p className="text-sm font-bold text-champagne-100">
                          {item.name}
                        </p>
                        <p className="text-xs text-champagne-500 line-clamp-1">
                          {item.description || "No description"}
                        </p>
                      </div>
                      <p className="text-sm font-bold text-gold-400">
                        {order.paymentMethod === "Store Credits"
                          ? `${(item.price * 100).toLocaleString()} Credits`
                          : `$${formatPrice(item.price)}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-black text-gold-500/50 uppercase tracking-widest mb-3">
                  Shipping Details
                </h4>
                <div className="bg-noir-900/50 p-4 rounded-xl border border-gold-500/10 text-sm text-champagne-300 leading-relaxed">
                  <p className="font-bold text-champagne-100 mb-1">
                    Standard Delivery
                  </p>
                  <p>{order.shippingAddress.address}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state}{" "}
                    {order.shippingAddress.zipCode}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-black text-gold-500/50 uppercase tracking-widest mb-3">
                  Payment Method
                </h4>
                <div className="bg-noir-900/50 p-4 rounded-xl border border-gold-500/10 text-sm text-champagne-300">
                  <p className="font-bold text-champagne-100 flex items-center gap-2">
                    {order.paymentMethod || "Credit Card"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MyOrders() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orders, isLoading } = useSelector((state) => state.orders);

  useEffect(() => {
    if (user?.data?.email) {
      dispatch(getOrders(user.data.email));
    }
  }, [user, dispatch]);

  if (isLoading)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader />
      </div>
    );

  return (
    <div className="min-h-screen bg-noir-900 py-12 px-4 selection:bg-gold-500/30">
      <div className="max-w-5xl mx-auto">
        <h1 className="font-display text-4xl font-bold text-champagne-100 mb-2">
          My Acquisitions
        </h1>
        <p className="text-champagne-400 mb-10">
          Track and download invoices for your past purchases.
        </p>

        {orders.length === 0 ? (
          <div className="bg-noir-800/50 p-12 rounded-3xl text-center border border-gold-500/10 shadow-sm backdrop-blur-sm">
            <HiOutlineTicket className="text-6xl text-gold-500/20 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-champagne-100 mb-2">
              No orders yet
            </h3>
            <p className="text-champagne-500">
              When you purchase a piece, it will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderItem key={order._id} order={order} user={user} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyOrders;

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

function OrderItem({ order }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handlePrintInvoice = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice #${order._id.slice(-6).toUpperCase()}</title>
          <style>
            body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 40px; color: #333; }
            .header { display: flex; justify-content: space-between; margin-bottom: 40px; border-bottom: 2px solid #eee; padding-bottom: 20px; }
            .logo { font-size: 24px; font-weight: bold; color: #7e22ce; }
            .invoice-details { text-align: right; }
            .invoice-details p { margin: 5px 0; font-size: 14px; }
            .address-section { display: flex; justify-content: space-between; margin-bottom: 40px; }
            .address-box p { margin: 5px 0; font-size: 14px; color: #555; }
            .address-box h3 { font-size: 14px; text-transform: uppercase; color: #888; margin-bottom: 10px; }
            table { w-full; border-collapse: collapse; margin-bottom: 30px; width: 100%; }
            th { text-align: left; padding: 15px 10px; border-bottom: 2px solid #eee; font-size: 12px; text-transform: uppercase; color: #888; }
            td { padding: 15px 10px; border-bottom: 1px solid #eee; font-size: 14px; }
            .total-section { text-align: right; }
            .total-row { display: flex; justify-content: flex-end; gap: 40px; margin-bottom: 10px; font-size: 14px; }
            .total-final { font-size: 20px; font-weight: bold; color: #7e22ce; }
            .footer { margin-top: 60px; text-align: center; font-size: 12px; color: #aaa; border-top: 1px solid #eee; padding-top: 20px; }
            @media print { button { display: none; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">ShopBuddy</div>
            <div class="invoice-details">
              <h1>INVOICE</h1>
              <p>Invoice #: ${order._id.slice(-6).toUpperCase()}</p>
              <p>Date: ${new Date(order.createdAt).toLocaleDateString()}</p>
              <p>Status: ${order.status.toUpperCase()}</p>
            </div>
          </div>

          <div class="address-section">
            <div class="address-box">
              <h3>Billed To:</h3>
              <p>${order.shippingAddress.address}</p>
              <p>${order.shippingAddress.city}, ${
      order.shippingAddress.state
    }</p>
              <p>${order.shippingAddress.zipCode}</p>
            </div>
            <div class="address-box">
              <h3>Payment Method:</h3>
              <p>${order.paymentMethod || "Card"}</p>
              <p>${order.email}</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Description</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              ${order.items
                .map(
                  (item) => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.code || "Standard Item"}</td>
                  <td>$${item.price}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>

          <div class="total-section">
            <div class="total-row">
              <span>Subtotal:</span>
              <span>${
                order.paymentMethod === "Store Credits"
                  ? `${(order.total * 100).toLocaleString()} Credits`
                  : `$${order.total.toFixed(2)}`
              }</span>
            </div>
            <div class="total-row">
              <span>Shipping:</span>
              <span>FREE</span>
            </div>
            <div class="total-row total-final">
              <span>Total:</span>
              <span>${
                order.paymentMethod === "Store Credits"
                  ? `${(order.total * 100).toLocaleString()} Credits`
                  : `$${order.total.toFixed(2)}`
              }</span>
            </div>
          </div>

          <div class="footer">
            <p>Thank you for shopping with ShopBuddy!</p>
            <p>If you have any questions about this invoice, please contact support.</p>
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
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {/* Header Row - Always Visible */}
      <div
        className="p-6 bg-white flex flex-col md:flex-row justify-between gap-6 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center flex-1">
          <div className="flex gap-4 items-center">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 font-bold text-lg">
              #{order._id.slice(-4)}
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase mb-1">
                Order Date
              </p>
              <p className="text-sm font-bold text-gray-900 flex items-center gap-1">
                <HiOutlineCalendar className="text-gray-400" />
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold text-gray-400 uppercase mb-1">
              Total Amount
            </p>
            <p className="text-sm font-black text-gray-900">
              {order.paymentMethod === "Store Credits"
                ? `${(order.total * 100).toLocaleString()} Credits`
                : `$${order.total.toFixed(2)}`}
            </p>
          </div>

          <div>
            <p className="text-xs font-bold text-gray-400 uppercase mb-1">
              Items
            </p>
            <p className="text-sm font-bold text-gray-600">
              {order.items.length} {order.items.length === 1 ? "Item" : "Items"}
            </p>
          </div>

          <div>
            <span
              className={`px-3 py-1 text-xs font-bold rounded-full uppercase ${
                order.status === "completed"
                  ? "bg-green-100 text-green-700"
                  : order.status === "pending"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-gray-100 text-gray-700"
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
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition-colors"
          >
            <HiPrinter className="text-lg" /> Invoice
          </button>

          <button
            className={`p-2 rounded-full transition-all ${
              isExpanded
                ? "bg-gray-100 text-gray-900"
                : "text-gray-400 hover:text-gray-600"
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
        <div className="p-6 border-t border-gray-100 bg-gray-50/50 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">
                Items Ordered
              </h4>
              <div className="space-y-3">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex gap-4 p-3 bg-white rounded-xl border border-gray-100"
                  >
                    <img
                      src={item.image}
                      alt=""
                      className="w-12 h-12 object-contain mix-blend-multiply"
                    />
                    <div className="flex-1 flex justify-between items-center">
                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500 line-clamp-1">
                          {item.description || "No description"}
                        </p>
                      </div>
                      <p className="text-sm font-bold text-purple-600">
                        {order.paymentMethod === "Store Credits"
                          ? `${(item.price * 100).toLocaleString()} Credits`
                          : `$${item.price}`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
                  Shipping Details
                </h4>
                <div className="bg-white p-4 rounded-xl border border-gray-100 text-sm text-gray-600 leading-relaxed">
                  <p className="font-bold text-gray-900 mb-1">
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
                <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
                  Payment Method
                </h4>
                <div className="bg-white p-4 rounded-xl border border-gray-100 text-sm text-gray-600">
                  <p className="font-bold text-gray-900 flex items-center gap-2">
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
    <div className="min-h-screen bg-gray-50 py-12 px-4 selection:bg-purple-100">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-black text-gray-900 mb-2">My Orders</h1>
        <p className="text-gray-500 mb-8">
          Track and download invoices for your past purchases.
        </p>

        {orders.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl text-center border border-gray-100 shadow-sm">
            <HiOutlineTicket className="text-6xl text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No orders yet
            </h3>
            <p className="text-gray-500">
              When you place an order, it will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderItem key={order._id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyOrders;

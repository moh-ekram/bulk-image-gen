import React from 'react';
import { Package, X, Phone, MapPin } from 'lucide-react';
import { CustomerOrder } from '../../types';

interface TShirtOrdersModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: CustomerOrder[];
  onUpdateOrderStatus: (orderId: string, newStatus: CustomerOrder['status']) => void;
}

export const TShirtOrdersModal: React.FC<TShirtOrdersModalProps> = ({
  isOpen,
  onClose,
  orders,
  onUpdateOrderStatus,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="bg-slate-900 rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-slate-800 relative my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-indigo-400" />
            <h2 className="font-extrabold text-white text-lg">
              Customer Order Management Dashboard
            </h2>
            <span className="text-xs bg-indigo-950 text-indigo-400 font-bold px-2 py-0.5 rounded-full">
              {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-300 hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Orders List Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                <Package className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-100 text-sm">No Orders Received Yet</h3>
              <p className="text-xs text-slate-400">
                Orders placed by customers on the storefront will appear here with live updates.
              </p>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="bg-slate-950 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 hover:border-slate-700 transition-colors shadow-2xs"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-extrabold text-white bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800 shadow-2xs">
                      #{order.id}
                    </span>
                    <span className="text-slate-400">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-semibold">Status:</span>
                    <select
                      value={order.status}
                      onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as any)}
                      className={`px-3 py-1 rounded-lg font-bold text-xs border cursor-pointer ${
                        order.status === 'Delivered'
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                          : order.status === 'Shipped'
                          ? 'bg-blue-950 text-blue-300 border-blue-700'
                          : order.status === 'Confirmed'
                          ? 'bg-purple-950 text-purple-300 border-purple-700'
                          : 'bg-amber-950 text-amber-300 border-amber-700'
                      }`}
                    >
                      <option value="Pending">Pending (Awaiting Verification)</option>
                      <option value="Confirmed">Confirmed (Processing)</option>
                      <option value="Shipped">Shipped (In Courier)</option>
                      <option value="Delivered">Delivered (Completed)</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* Customer Details & Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  {/* Customer Info (5 cols) */}
                  <div className="md:col-span-5 space-y-2 text-xs bg-slate-900 p-3.5 rounded-xl border border-slate-800">
                    <div className="font-bold text-white text-sm">{order.customerName}</div>
                    <div className="flex items-center gap-2 text-slate-300 font-semibold">
                      <Phone className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span>{order.phone}</span>
                    </div>
                    <div className="flex items-start gap-2 text-slate-300">
                      <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                      <span>{order.address} ({order.district})</span>
                    </div>
                    <div className="pt-1 text-[11px] font-bold text-emerald-400">
                      Payment: {order.paymentMethod === 'cod' ? 'Cash On Delivery' : order.paymentMethod.toUpperCase()}
                    </div>
                  </div>

                  {/* Items Ordered (7 cols) */}
                  <div className="md:col-span-7 space-y-2 bg-slate-900 p-3.5 rounded-xl border border-slate-800 text-xs">
                    <span className="font-bold text-slate-200 block mb-1">Ordered Items:</span>
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between text-xs pb-1 border-b border-slate-800 last:border-none">
                          <div className="flex items-center gap-2 min-w-0">
                            <div
                              className="w-3.5 h-3.5 rounded-full border border-slate-700 shrink-0"
                              style={{ backgroundColor: item.selectedColor }}
                            />
                            <span className="font-semibold text-white truncate">
                              {item.product.title}
                            </span>
                            <span className="text-slate-400 font-mono text-[11px]">
                              [{item.selectedSize} × {item.quantity}]
                            </span>
                          </div>
                          <span className="font-bold text-white shrink-0">
                            ৳{item.product.price * item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-baseline pt-2 border-t border-slate-800 font-bold text-white text-xs sm:text-sm">
                      <span>Grand Total (incl. delivery):</span>
                      <span className="text-indigo-400 text-base font-black">৳{order.total}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

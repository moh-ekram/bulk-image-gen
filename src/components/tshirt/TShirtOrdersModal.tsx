import React from 'react';
import { Package, X, Clock, CheckCircle2, Truck, Check, AlertCircle, Phone, MapPin } from 'lucide-react';
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
      <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-indigo-600" />
            <h2 className="font-extrabold text-slate-900 text-lg">
              কাস্টমার অর্ডার ড্যাশবোর্ড (Order Management)
            </h2>
            <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-full">
              {orders.length}টি অর্ডার
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Orders List Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {orders.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <Package className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">এখনো কোনো অর্ডার আসেনি</h3>
              <p className="text-xs text-slate-500">
                কাস্টমাররা ওয়েবসাইট থেকে অর্ডার করলে এখানে সকল বিস্তারিত দেখতে পাবেন।
              </p>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4 hover:border-slate-300 transition-colors shadow-2xs"
              >
                {/* Order Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 text-xs">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-extrabold text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                      #{order.id}
                    </span>
                    <span className="text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString('bn-BD', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 font-semibold">স্ট্যাটাস:</span>
                    <select
                      value={order.status}
                      onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as any)}
                      className={`px-3 py-1 rounded-lg font-bold text-xs border cursor-pointer ${
                        order.status === 'Delivered'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : order.status === 'Shipped'
                          ? 'bg-blue-50 text-blue-800 border-blue-300'
                          : order.status === 'Confirmed'
                          ? 'bg-purple-50 text-purple-800 border-purple-300'
                          : 'bg-amber-50 text-amber-800 border-amber-300'
                      }`}
                    >
                      <option value="Pending">Pending (অপেক্ষমাণ)</option>
                      <option value="Confirmed">Confirmed (ভেরিফাইড)</option>
                      <option value="Shipped">Shipped (কুরিয়ারে দেওয়া)</option>
                      <option value="Delivered">Delivered (ডেলিভার্ড)</option>
                      <option value="Cancelled">Cancelled (বাতিল)</option>
                    </select>
                  </div>
                </div>

                {/* Customer Details & Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  {/* Customer Info (5 cols) */}
                  <div className="md:col-span-5 space-y-2 text-xs bg-white p-3.5 rounded-xl border border-slate-200">
                    <div className="font-bold text-slate-900 text-sm">{order.customerName}</div>
                    <div className="flex items-center gap-2 text-slate-600 font-semibold">
                      <Phone className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span>{order.phone}</span>
                    </div>
                    <div className="flex items-start gap-2 text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                      <span>{order.address} ({order.district})</span>
                    </div>
                    <div className="pt-1 text-[11px] font-bold text-emerald-700">
                      পেমেন্ট মেথড: {order.paymentMethod === 'cod' ? 'Cash On Delivery' : order.paymentMethod.toUpperCase()}
                    </div>
                  </div>

                  {/* Items Ordered (7 cols) */}
                  <div className="md:col-span-7 space-y-2 bg-white p-3.5 rounded-xl border border-slate-200 text-xs">
                    <span className="font-bold text-slate-700 block mb-1">অর্ডারকৃত টিশার্টসমূহ:</span>
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between text-xs pb-1 border-b border-slate-100 last:border-none">
                          <div className="flex items-center gap-2 min-w-0">
                            <div
                              className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0"
                              style={{ backgroundColor: item.selectedColor }}
                            />
                            <span className="font-semibold text-slate-900 truncate">
                              {item.product.title}
                            </span>
                            <span className="text-slate-500 font-mono text-[11px]">
                              [{item.selectedSize} × {item.quantity}]
                            </span>
                          </div>
                          <span className="font-bold text-slate-900 shrink-0">
                            ৳{item.product.price * item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-baseline pt-2 border-t border-slate-200 font-bold text-slate-900 text-xs sm:text-sm">
                      <span>সর্বমোট (ডেলিভারিসহ):</span>
                      <span className="text-indigo-600 text-base font-black">৳{order.total}</span>
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

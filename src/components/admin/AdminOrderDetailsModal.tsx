import React, { useState } from 'react';
import {
  X,
  Package,
  Phone,
  MessageCircle,
  MapPin,
  Calendar,
  CreditCard,
  Truck,
  CheckCircle2,
  Printer,
  Clock,
  ArrowRight,
  AlertTriangle,
  FileText,
  User,
} from 'lucide-react';
import { CustomerOrder, StoreSettings } from '../../types';
import { TShirtMockupView } from '../tshirt/TShirtMockupView';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  order: CustomerOrder | null;
  onUpdateStatus: (orderId: string, newStatus: CustomerOrder['status']) => void;
  onOpenInvoice: (order: CustomerOrder) => void;
  storeSettings?: StoreSettings;
}

export const AdminOrderDetailsModal: React.FC<Props> = ({
  isOpen,
  onClose,
  order,
  onUpdateStatus,
  onOpenInvoice,
  storeSettings,
}) => {
  if (!isOpen || !order) return null;

  const STATUSES: CustomerOrder['status'][] = [
    'Pending',
    'Confirmed',
    'Shipped',
    'Delivered',
    'Cancelled',
  ];

  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // Generate WhatsApp Direct Link
  const cleanPhone = order.phone.replace(/[^0-9]/g, '');
  const internationalPhone = cleanPhone.startsWith('880')
    ? cleanPhone
    : cleanPhone.startsWith('0')
    ? `88${cleanPhone}`
    : `880${cleanPhone}`;
  
  const whatsappMessage = encodeURIComponent(
    `Hello ${order.customerName}! Greetings from ${storeSettings?.storeName || 'Streetwear Studio'}. We are processing your order #${order.id} for ৳${order.total}. Is your delivery address '${order.address}' confirmed?`
  );
  const whatsappUrl = `https://wa.me/${internationalPhone}?text=${whatsappMessage}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden my-6 animate-in zoom-in-95">
        {/* Modal Top Bar */}
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-amber-400">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black font-mono tracking-tight">#{order.id}</span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  order.status === 'Delivered'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : order.status === 'Shipped'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    : order.status === 'Confirmed'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    : order.status === 'Cancelled'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {order.status}
                </span>
              </div>
              <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>Placed on {formattedDate}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenInvoice(order)}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Status Stepper Progression */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Order Fulfillment Lifecycle:
              </span>
              <span className="text-xs font-semibold text-indigo-700">
                Current: <b>{order.status}</b>
              </span>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {STATUSES.map((st) => {
                const isActive = order.status === st;
                return (
                  <button
                    key={st}
                    onClick={() => onUpdateStatus(order.id, st)}
                    className={`py-2 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center border ${
                      isActive
                        ? st === 'Delivered'
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
                          : st === 'Cancelled'
                          ? 'bg-rose-600 border-rose-600 text-white shadow-xs'
                          : 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {st}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Customer Profile & Communication Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Customer Details */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-indigo-600" /> Customer Information
                </span>
                <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded">
                  COD Verified
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <p className="text-sm font-black text-slate-900">{order.customerName}</p>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-mono font-bold text-slate-800">{order.phone}</span>
                </div>
                <div className="flex items-start gap-2 text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{order.address}, {order.district}</span>
                </div>
              </div>

              {/* Quick Customer Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <a
                  href={`tel:${order.phone}`}
                  className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Call Customer</span>
                </a>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2 px-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Courier & Payment Info */}
            <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-indigo-600" /> Courier & Payment
                </span>
                <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded">
                  Steadfast / Pathao
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Payment Gateway:</span>
                  <span className="font-bold text-slate-900 uppercase">
                    {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Destination Region:</span>
                  <span className="font-bold text-slate-900">{order.district}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Courier Delivery Fee:</span>
                  <span className="font-mono font-bold text-slate-900">৳{order.deliveryFee}</span>
                </div>
                <div className="p-2.5 bg-amber-50/70 border border-amber-200/80 rounded-xl">
                  <span className="text-[11px] font-bold text-amber-900 block mb-0.5">Special Courier Notes:</span>
                  <p className="text-xs text-amber-800 italic">
                    {order.specialNotes || 'No special delivery instructions provided.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Ordered Line Items */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Ordered Items ({order.items.length} Products):
            </h3>

            <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100">
              {order.items.map((item) => (
                <div key={item.id} className="p-3.5 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                  <div className="w-16 h-16 bg-slate-900 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                    <TShirtMockupView
                      color={item.selectedColor}
                      designImage={item.product.designImage}
                      customMockupImage={item.product.customMockupImage}
                      designScale={50}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-black text-slate-900 truncate">{item.product.title}</h4>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                      <span className="font-bold text-slate-700">
                        Size: <b className="text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">{item.selectedSize}</b>
                      </span>
                      <span className="flex items-center gap-1.5">
                        Color:
                        <span
                          className="w-3 h-3 rounded-full border border-slate-300 inline-block"
                          style={{ backgroundColor: item.selectedColor }}
                        />
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-slate-500">
                      ৳{item.product.price} × {item.quantity}
                    </div>
                    <div className="text-sm font-black font-mono text-slate-900 mt-0.5">
                      ৳{item.product.price * item.quantity}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Grand Totals Summary */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs text-slate-400">Total Settlement:</span>
              <div className="text-xl font-black text-amber-400 font-mono">৳{order.total}</div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenInvoice(order)}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Packing Slip</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

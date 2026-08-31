import React, { useRef } from 'react';
import {
  Printer,
  X,
  ShoppingBag,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Truck,
  CheckCircle2,
  Download,
} from 'lucide-react';
import { CustomerOrder, StoreSettings } from '../../types';
import { DEFAULT_STORE_SETTINGS } from '../../data/adminDefaults';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  order: CustomerOrder | null;
  storeSettings?: StoreSettings;
}

export const AdminInvoiceModal: React.FC<Props> = ({
  isOpen,
  onClose,
  order,
  storeSettings = DEFAULT_STORE_SETTINGS,
}) => {
  const printableRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden my-8 animate-in zoom-in-95">
        {/* Top Control Bar (Hidden during Print) */}
        <div className="bg-black px-6 py-4 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-amber-400" />
            <h2 className="text-sm font-bold">Printable Official Invoice / Packing Slip</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
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

        {/* Printable Paper Area */}
        <div ref={printableRef} className="p-8 bg-slate-900 text-white space-y-6 print:p-0">
          {/* Header Section */}
          <div className="flex items-start justify-between border-b border-slate-800 pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-950 text-white flex items-center justify-center font-black text-sm">
                  <ShoppingBag className="w-4 h-4 text-amber-400" />
                </div>
                <h1 className="text-xl font-black tracking-tight text-white">
                  {storeSettings.storeName}
                </h1>
              </div>
              <p className="text-xs text-slate-400 font-medium">{storeSettings.tagline}</p>
              <p className="text-xs text-slate-300">{storeSettings.address}</p>
              <p className="text-xs text-slate-300 font-mono">
                Hotline: {storeSettings.hotlinePhone} | Email: {storeSettings.supportEmail}
              </p>
            </div>

            <div className="text-right space-y-1">
              <span className="text-xs font-black uppercase tracking-widest bg-slate-800 text-white px-2.5 py-1 rounded">
                TAX INVOICE / MEMO
              </span>
              <div className="text-base font-mono font-bold text-indigo-400 mt-2">
                #{order.id}
              </div>
              <div className="text-xs text-slate-400 flex items-center justify-end gap-1 font-medium">
                <Calendar className="w-3 h-3" />
                <span>{formattedDate}</span>
              </div>
            </div>
          </div>

          {/* Customer & Courier Summary Grid */}
          <div className="grid grid-cols-2 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                DELIVER TO (CUSTOMER)
              </span>
              <p className="text-sm font-black text-white">{order.customerName}</p>
              <p className="text-slate-200 font-mono font-semibold flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-indigo-400" />
                <span>{order.phone}</span>
              </p>
              <p className="text-slate-300 leading-relaxed flex items-start gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>{order.address}, {order.district}</span>
              </p>
            </div>

            <div className="space-y-1 border-l border-slate-800 pl-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                PAYMENT & DELIVERY STATUS
              </span>
              <div className="flex items-center gap-2">
                <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-bold text-slate-100 uppercase">
                  {order.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : order.paymentMethod.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-semibold text-slate-200">{order.district}</span>
              </div>
              <div className="pt-1">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold ${
                  order.status === 'Delivered'
                    ? 'bg-emerald-900 text-emerald-300'
                    : order.status === 'Shipped'
                    ? 'bg-blue-900 text-blue-300'
                    : order.status === 'Confirmed'
                    ? 'bg-purple-900 text-purple-300'
                    : 'bg-amber-900 text-amber-300'
                }`}>
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Order Status: {order.status}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="border border-slate-800 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800 border-b border-slate-800 font-bold text-slate-200 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">Product Description</th>
                  <th className="p-3 text-center">Size</th>
                  <th className="p-3 text-center">Color</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-right">Unit Price</th>
                  <th className="p-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-medium">
                {order.items.map((item, idx) => (
                  <tr key={item.id} className="hover:bg-slate-950">
                    <td className="p-3 font-mono text-slate-400">{idx + 1}</td>
                    <td className="p-3 font-bold text-white">
                      {item.product.title}
                      <span className="block text-[10px] text-slate-400 font-normal">
                        Heavyweight 240 GSM Cotton Drop
                      </span>
                    </td>
                    <td className="p-3 text-center font-bold font-mono bg-slate-950/50">
                      <span className="px-2 py-0.5 bg-slate-700 text-slate-100 rounded">
                        {item.selectedSize}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-slate-700 inline-block shadow-2xs"
                          style={{ backgroundColor: item.selectedColor }}
                        />
                      </div>
                    </td>
                    <td className="p-3 text-center font-bold text-white">{item.quantity}</td>
                    <td className="p-3 text-right font-mono font-semibold">৳{item.product.price}</td>
                    <td className="p-3 text-right font-mono font-bold text-white">
                      ৳{item.product.price * item.quantity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pricing Totals & Special Notes */}
          <div className="grid grid-cols-2 gap-6 pt-2">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1.5">
              <span className="font-bold text-slate-200 block text-[11px] uppercase tracking-wider">
                Special Delivery Instructions:
              </span>
              <p className="text-slate-300 italic">
                {order.specialNotes || 'Standard door-to-door courier delivery. Check parcel before payment.'}
              </p>
              <div className="pt-2 text-[10px] text-slate-400 font-mono">
                Steadfast / Pathao Parcel Verified ID: SF-{order.id}
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Subtotal Items:</span>
                <span className="font-mono font-semibold">৳{order.subtotal}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Courier Delivery Charge:</span>
                <span className="font-mono font-semibold">৳{order.deliveryFee}</span>
              </div>
              <div className="flex justify-between text-white font-bold text-base border-t border-slate-700 pt-2">
                <span>Net Payable Amount:</span>
                <span className="font-mono text-indigo-400">৳{order.total}</span>
              </div>
              {order.paymentMethod === 'cod' && (
                <p className="text-[11px] text-amber-400 font-bold text-right">
                  * Collect ৳{order.total} upon parcel handover
                </p>
              )}
            </div>
          </div>

          {/* Footer Barcode / Signature */}
          <div className="pt-6 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div className="space-y-1 font-mono text-[10px]">
              <div className="tracking-widest font-bold text-slate-100">||| | | |||| | ||| |||| | | |||</div>
              <div>AUTH-{order.id}-VERIFIED</div>
            </div>

            <div className="text-center">
              <div className="w-32 border-b border-slate-600 mb-1"></div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">Authorized Signature</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

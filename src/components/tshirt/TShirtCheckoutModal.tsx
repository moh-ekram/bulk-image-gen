import React, { useState } from 'react';
import {
  CheckCircle2,
  X,
  Truck,
  CreditCard,
  Banknote,
  Smartphone,
  ShoppingBag,
} from 'lucide-react';
import { CartItem, CustomerOrder } from '../../types';

interface TShirtCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderPlaced: (order: CustomerOrder) => void;
}

export const TShirtCheckoutModal: React.FC<TShirtCheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  onOrderPlaced,
}) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [districtZone, setDistrictZone] = useState<'inside_dhaka' | 'outside_dhaka'>('inside_dhaka');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash' | 'nagad'>('cod');
  const [specialNotes, setSpecialNotes] = useState('');
  const [placedOrder, setPlacedOrder] = useState<CustomerOrder | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = districtZone === 'inside_dhaka' ? 60 : 120;
  const grandTotal = subtotal + deliveryFee;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = 'Please enter your full name';
    if (!phone.trim() || phone.trim().length < 10) errs.phone = 'Please enter a valid 11-digit phone number';
    if (!address.trim() || address.trim().length < 8) errs.address = 'Please enter complete delivery address (House, Road, Area)';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const newOrder: CustomerOrder = {
      id: `ORD-${Date.now().toString().slice(-6)}`,
      customerName: name,
      phone,
      address,
      district: districtZone === 'inside_dhaka' ? 'Inside Dhaka' : 'Outside Dhaka',
      deliveryFee,
      paymentMethod,
      specialNotes,
      items: [...items],
      subtotal,
      total: grandTotal,
      status: 'Pending',
      createdAt: Date.now(),
    };

    setPlacedOrder(newOrder);
    onOrderPlaced(newOrder);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="bg-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-800 relative my-8">
        {!placedOrder ? (
          <>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-indigo-400" />
                <h2 className="font-extrabold text-white text-lg">
                  Direct Checkout & Delivery
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-300 hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePlaceOrder} className="space-y-5 pt-4">
              {/* Order Summary Strip */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="text-xs font-bold text-slate-200 flex items-center justify-between">
                  <span>Order Items ({items.length}):</span>
                  <span className="font-mono text-indigo-400">Subtotal: ৳{subtotal}</span>
                </div>

                <div className="max-h-36 overflow-y-auto space-y-2 pr-1">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-xs bg-slate-900 p-2 rounded-xl border border-slate-800">
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className="w-3.5 h-3.5 rounded-full border border-slate-700 shrink-0"
                          style={{ backgroundColor: item.selectedColor }}
                        />
                        <span className="font-semibold text-slate-100 truncate">
                          {item.product.title}
                        </span>
                        <span className="text-slate-400 font-mono text-[11px]">
                          ({item.selectedSize} × {item.quantity})
                        </span>
                      </div>
                      <span className="font-bold text-white shrink-0">
                        ৳{item.product.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Inputs */}
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-200 mb-1">
                    Your Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-semibold text-white focus:outline-none focus:border-indigo-600"
                  />
                  {errors.name && <p className="text-[11px] text-rose-400 mt-1 font-semibold">{errors.name}</p>}
                </div>

                <div>
                  <label className="block font-bold text-slate-200 mb-1">
                    Mobile Phone (11 digits) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 017XXXXXXXX"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-semibold text-white focus:outline-none focus:border-indigo-600"
                  />
                  {errors.phone && <p className="text-[11px] text-rose-400 mt-1 font-semibold">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block font-bold text-slate-200 mb-1">
                    Full Delivery Address <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={2}
                    placeholder="House / Apartment no., Road, Area, City..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-medium text-white focus:outline-none focus:border-indigo-600"
                  />
                  {errors.address && <p className="text-[11px] text-rose-400 mt-1 font-semibold">{errors.address}</p>}
                </div>

                {/* Delivery Zone Selector */}
                <div>
                  <label className="block font-bold text-slate-200 mb-1">
                    Select Delivery Zone
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setDistrictZone('inside_dhaka')}
                      className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between cursor-pointer transition-all ${
                        districtZone === 'inside_dhaka'
                          ? 'bg-indigo-950 border-indigo-600 text-indigo-300 shadow-xs'
                          : 'bg-slate-950 border-slate-800 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-indigo-400" />
                        <span>Inside Dhaka</span>
                      </div>
                      <span className="font-mono">৳60</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDistrictZone('outside_dhaka')}
                      className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between cursor-pointer transition-all ${
                        districtZone === 'outside_dhaka'
                          ? 'bg-indigo-950 border-indigo-600 text-indigo-300 shadow-xs'
                          : 'bg-slate-950 border-slate-800 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-indigo-400" />
                        <span>Outside Dhaka</span>
                      </div>
                      <span className="font-mono">৳120</span>
                    </button>
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div>
                  <label className="block font-bold text-slate-200 mb-1">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                        paymentMethod === 'cod'
                          ? 'bg-emerald-950 border-emerald-600 text-emerald-300 ring-1 ring-emerald-700'
                          : 'bg-slate-950 border-slate-800 text-slate-200'
                      }`}
                    >
                      <Banknote className="w-4 h-4 text-emerald-400" />
                      <span>Cash on Delivery</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('bkash')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                        paymentMethod === 'bkash'
                          ? 'bg-pink-950 border-pink-600 text-pink-300 ring-1 ring-pink-700'
                          : 'bg-slate-950 border-slate-800 text-slate-200'
                      }`}
                    >
                      <Smartphone className="w-4 h-4 text-pink-400" />
                      <span>bKash</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('nagad')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                        paymentMethod === 'nagad'
                          ? 'bg-orange-950 border-orange-600 text-orange-300 ring-1 ring-orange-700'
                          : 'bg-slate-950 border-slate-800 text-slate-200'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 text-orange-400" />
                      <span>Nagad</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Total Calculation Strip */}
              <div className="p-4 bg-black text-white rounded-2xl space-y-2">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Subtotal:</span>
                  <span>৳{subtotal}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Delivery Charge:</span>
                  <span>৳{deliveryFee}</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-slate-800">
                  <span>Grand Total:</span>
                  <span className="text-amber-400">৳{grandTotal}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Confirm & Place Order</span>
              </button>
            </form>
          </>
        ) : (
          /* Order Confirmed Celebration Screen */
          <div className="text-center py-6 space-y-5 animate-in zoom-in-95">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-900 flex items-center justify-center text-emerald-400 shadow-lg">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-indigo-400 bg-indigo-950 px-3 py-1 rounded-full">
                Order Confirmed • #{placedOrder.id}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                Thank you! Your order has been placed.
              </h2>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Our support team will contact you shortly at <strong>{placedOrder.phone}</strong> to confirm dispatch details.
              </p>
            </div>

            {/* Order Details Card */}
            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 text-left text-xs space-y-3 max-w-md mx-auto">
              <div className="flex justify-between pb-2 border-b border-slate-800">
                <span className="text-slate-400">Customer Name:</span>
                <span className="font-bold text-white">{placedOrder.customerName}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-800">
                <span className="text-slate-400">Delivery Address:</span>
                <span className="font-semibold text-slate-100">{placedOrder.address}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-800">
                <span className="text-slate-400">Payment Method:</span>
                <span className="font-bold text-emerald-400">
                  {placedOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : placedOrder.paymentMethod.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-white pt-1">
                <span>Total Payable:</span>
                <span className="text-indigo-400">৳{placedOrder.total}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-3 bg-black hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl cursor-pointer shadow-md"
            >
              Back to Store
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

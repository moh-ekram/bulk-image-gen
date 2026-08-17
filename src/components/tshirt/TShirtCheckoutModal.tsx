import React, { useState } from 'react';
import {
  CheckCircle2,
  X,
  Truck,
  ShieldCheck,
  CreditCard,
  Banknote,
  Smartphone,
  Sparkles,
  ShoppingBag,
  ArrowLeft,
} from 'lucide-react';
import { CartItem, CustomerOrder } from '../../types';
import { TShirtMockupView } from './TShirtMockupView';

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
    if (!name.trim()) errs.name = 'অনুগ্রহ করে আপনার পুরো নাম লিখুন';
    if (!phone.trim() || phone.trim().length < 10) errs.phone = 'সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন';
    if (!address.trim() || address.trim().length < 8) errs.address = 'সম্পূর্ণ ঠিকানা লিখুন (বাসা, রোড, এলাকা)';
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
      district: districtZone === 'inside_dhaka' ? 'ঢাকা সিটি (Inside Dhaka)' : 'ঢাকার বাইরে (Outside Dhaka)',
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
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-8">
        {!placedOrder ? (
          <>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-indigo-600" />
                <h2 className="font-extrabold text-slate-900 text-lg">
                  ক্যাশ অন ডেলিভারি চেকআউট (Order Details)
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePlaceOrder} className="space-y-5 pt-4">
              {/* Order Summary Strip */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
                <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
                  <span>অর্ডার সারসংক্ষেপ ({items.length}টি আইটেম):</span>
                  <span className="font-mono text-indigo-600">সাবটোটাল: ৳{subtotal}</span>
                </div>

                <div className="max-h-36 overflow-y-auto space-y-2 pr-1">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-xs bg-white p-2 rounded-xl border border-slate-200">
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0"
                          style={{ backgroundColor: item.selectedColor }}
                        />
                        <span className="font-semibold text-slate-800 truncate">
                          {item.product.title}
                        </span>
                        <span className="text-slate-500 font-mono text-[11px]">
                          ({item.selectedSize} × {item.quantity})
                        </span>
                      </div>
                      <span className="font-bold text-slate-900 shrink-0">
                        ৳{item.product.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Inputs */}
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    আপনার সম্পূর্ণ নাম <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="যেমন: তানভীর আহমেদ"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                  {errors.name && <p className="text-[11px] text-rose-600 mt-1 font-semibold">{errors.name}</p>}
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    মোবাইল নম্বর (১১ ডিজিট) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="যেমন: 017XXXXXXXX"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                  {errors.phone && <p className="text-[11px] text-rose-600 mt-1 font-semibold">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    সম্পূর্ণ ডেলিভারি ঠিকানা <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={2}
                    placeholder="বাসা নম্বর, রোড নম্বর, এলাকা, থানা ও জেলা..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-medium text-slate-900 focus:outline-none focus:border-indigo-600"
                  />
                  {errors.address && <p className="text-[11px] text-rose-600 mt-1 font-semibold">{errors.address}</p>}
                </div>

                {/* Delivery Zone Selector */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    ডেলিভারি এরিয়া সিলেক্ট করুন
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setDistrictZone('inside_dhaka')}
                      className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between cursor-pointer transition-all ${
                        districtZone === 'inside_dhaka'
                          ? 'bg-indigo-50 border-indigo-600 text-indigo-900 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-indigo-600" />
                        <span>ঢাকা সিটির ভেতরে</span>
                      </div>
                      <span className="font-mono">৳৬০</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setDistrictZone('outside_dhaka')}
                      className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-between cursor-pointer transition-all ${
                        districtZone === 'outside_dhaka'
                          ? 'bg-indigo-50 border-indigo-600 text-indigo-900 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-indigo-600" />
                        <span>ঢাকার বাইরে</span>
                      </div>
                      <span className="font-mono">৳১২০</span>
                    </button>
                  </div>
                </div>

                {/* Payment Method Selector */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    পেমেন্ট মেথড
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                        paymentMethod === 'cod'
                          ? 'bg-emerald-50 border-emerald-600 text-emerald-900 ring-1 ring-emerald-300'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <Banknote className="w-4 h-4 text-emerald-600" />
                      <span>ক্যাশ অন ডেলিভারি</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('bkash')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                        paymentMethod === 'bkash'
                          ? 'bg-pink-50 border-pink-600 text-pink-900 ring-1 ring-pink-300'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <Smartphone className="w-4 h-4 text-pink-600" />
                      <span>বিকাশ (bKash)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('nagad')}
                      className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                        paymentMethod === 'nagad'
                          ? 'bg-orange-50 border-orange-600 text-orange-900 ring-1 ring-orange-300'
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <CreditCard className="w-4 h-4 text-orange-600" />
                      <span>নগদ (Nagad)</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Total Calculation Strip */}
              <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>সাবটোটাল:</span>
                  <span>৳{subtotal}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-300">
                  <span>ডেলিভারি চার্জ:</span>
                  <span>৳{deliveryFee}</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-white pt-2 border-t border-slate-800">
                  <span>সর্বমোট প্রদেয় (Grand Total):</span>
                  <span className="text-amber-400">৳{grandTotal}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm sm:text-base rounded-2xl shadow-xl flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>অর্ডার নিশ্চিত করুন (Place Order)</span>
              </button>
            </form>
          </>
        ) : (
          /* Order Confirmed Celebration Screen */
          <div className="text-center py-6 space-y-5 animate-in zoom-in-95">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-lg">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                Order Confirmed • #{placedOrder.id}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                ধন্যবাদ! আপনার অর্ডার সফলভাবে সম্পন্ন হয়েছে
              </h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                আমাদের প্রতিনিধি শীঘ্রই <strong>{placedOrder.phone}</strong> নম্বরে কল করে অর্ডার ভেরিফাই করবেন।
              </p>
            </div>

            {/* Order Details Card */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left text-xs space-y-3 max-w-md mx-auto">
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500">গ্রাহকের নাম:</span>
                <span className="font-bold text-slate-900">{placedOrder.customerName}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500">ঠিকানা:</span>
                <span className="font-semibold text-slate-800">{placedOrder.address}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500">পেমেন্ট মেথড:</span>
                <span className="font-bold text-emerald-700">
                  {placedOrder.paymentMethod === 'cod' ? 'ক্যাশ অন ডেলিভারি' : placedOrder.paymentMethod.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-1">
                <span>সর্বমোট পরিশোধযোগ্য:</span>
                <span className="text-indigo-600">৳{placedOrder.total}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl cursor-pointer shadow-md"
            >
              শপে ফিরে যান
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

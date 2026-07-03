import React, { useState } from 'react';
import { CartItem } from '../types';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Check, Percent, MapPin, Phone, User, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateCart: (productId: string, quantity: number) => void;
  onRemoveFromCart: (productId: string) => void;
  onClearCart: () => void;
  onPlaceOrder: (address: any, paymentMethod: string, couponDiscount: number) => void;
  currentUser?: any;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateCart,
  onRemoveFromCart,
  onClearCart,
  onPlaceOrder,
  currentUser,
}: CartDrawerProps) {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout'>('cart');

  // Checkout form fields
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [flat, setFlat] = useState(currentUser?.address || '');
  const [area, setArea] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('New Delhi');
  const [pincode, setPincode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi' | 'card'>('cod');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Sync with currentUser when logged in
  React.useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setPhone(currentUser.phone || '');
      setFlat(currentUser.address || '');
    }
  }, [currentUser]);

  const FREE_DELIVERY_THRESHOLD = 200;
  const STANDARD_DELIVERY_CHARGE = 25;
  const PACKING_FEE = 3;

  // Calculations
  const itemTotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const mrpTotal = cartItems.reduce((sum, item) => sum + item.product.mrp * item.quantity, 0);
  const productDiscount = mrpTotal - itemTotal;

  const isFreeDelivery = itemTotal >= FREE_DELIVERY_THRESHOLD || appliedCoupon === 'FREESHIP';
  const deliveryCharge = itemTotal === 0 ? 0 : (isFreeDelivery ? 0 : STANDARD_DELIVERY_CHARGE);
  const amountToFreeDelivery = FREE_DELIVERY_THRESHOLD - itemTotal;

  const handleApplyCoupon = (code: string) => {
    const cleanCode = code.toUpperCase().trim();
    if (cleanCode === 'DESI10') {
      const discount = Math.round(itemTotal * 0.1);
      setCouponDiscount(discount);
      setAppliedCoupon('DESI10');
    } else if (cleanCode === 'FREESHIP') {
      setCouponDiscount(0);
      setAppliedCoupon('FREESHIP');
    } else if (cleanCode === 'FESTIVE25') {
      if (itemTotal >= 150) {
        setCouponDiscount(25);
        setAppliedCoupon('FESTIVE25');
      } else {
        alert('FESTIVE25 coupon is only applicable on orders above ₹150.');
      }
    } else {
      alert('Invalid Coupon Code! Try DESI10, FESTIVE25, or FREESHIP');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponCode('');
  };

  const finalTotal = Math.max(0, itemTotal + deliveryCharge + PACKING_FEE - couponDiscount);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!name.trim()) errors.name = 'Full name is required';
    if (!phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(phone.trim())) {
      errors.phone = 'Please enter a valid 10-digit mobile number';
    }
    if (!flat.trim()) errors.flat = 'Flat/House details are required';
    if (!area.trim()) errors.area = 'Street/Locality name is required';
    if (!pincode.trim()) {
      errors.pincode = 'Pincode is required';
    } else if (!/^\d{6}$/.test(pincode.trim())) {
      errors.pincode = 'Please enter a valid 6-digit postal code';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onPlaceOrder(
        { name, phone, flat, area, landmark, city, pincode },
        paymentMethod,
        couponDiscount
      );
      // Reset checkout step for next open
      setTimeout(() => {
        setCheckoutStep('cart');
      }, 500);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-50 cursor-pointer"
          />

          {/* Sliding Cart Panel Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-neutral-50 dark:bg-neutral-950 shadow-2xl z-50 flex flex-col border-l border-neutral-200 dark:border-neutral-800 transition-colors duration-300"
            id="cart-drawer-panel"
          >
            {/* Header */}
            <div className="p-4 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center shrink-0 transition-colors duration-300">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 rounded-lg">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-extrabold text-base text-neutral-800 dark:text-white">Your Basket</h2>
                  <p className="text-xs text-neutral-400 dark:text-neutral-500 font-semibold">
                    {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} loaded
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-500 dark:text-neutral-400"
                id="close-cart-drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Content Area */}
            {cartItems.length === 0 ? (
              <div className="flex-grow flex flex-col justify-center items-center p-8 text-center">
                <div className="w-20 h-20 bg-neutral-100 rounded-full flex justify-center items-center text-neutral-400 mb-4 animate-pulse">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h3 className="font-extrabold text-lg text-neutral-700">Your Basket is Empty</h3>
                <p className="text-sm text-neutral-400 mt-2 max-w-xs font-medium">
                  Looks like you haven't added anything yet. Explore our grocery categories and enjoy special prices!
                </p>
                <button
                  onClick={onClose}
                  className="mt-6 bg-emerald-700 text-white font-extrabold text-xs px-6 py-3 rounded-xl shadow-md hover:bg-emerald-800 transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : checkoutStep === 'cart' ? (
              // --- CART VIEW STEP ---
              <div className="flex-grow flex flex-col overflow-hidden">
                {/* Free Delivery Meter */}
                <div className="p-4 bg-white dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-850 shrink-0 transition-colors duration-300">
                  {isFreeDelivery ? (
                    <div className="flex items-center gap-2.5 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-2.5 rounded-xl border border-emerald-100 dark:border-emerald-800/60">
                      <div className="w-5 h-5 bg-emerald-600 rounded-full flex justify-center items-center text-white text-[10px] font-black shrink-0">
                        ✓
                      </div>
                      <span className="text-xs font-extrabold">Yay! You unlocked FREE Delivery with this order!</span>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold text-neutral-600 dark:text-neutral-300">
                        <span>Delivery Meter</span>
                        <span>Add <b>₹{amountToFreeDelivery}</b> for FREE delivery</span>
                      </div>
                      <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(100, (itemTotal / FREE_DELIVERY_THRESHOLD) * 100)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Scrollable list of items */}
                <div className="flex-grow overflow-y-auto p-4 space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-bold text-neutral-400 tracking-wider uppercase mb-1">
                    <span>ITEMS IN CART</span>
                    <button onClick={onClearCart} className="text-rose-600 hover:underline">
                      Clear Basket
                    </button>
                  </div>

                  {cartItems.map((item) => {
                    const itemSavings = (item.product.mrp - item.product.price) * item.quantity;
                    return (
                      <div
                        key={item.product.id}
                        className="bg-white dark:bg-neutral-900 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 flex gap-3 shadow-sm"
                        id={`cart-item-${item.product.id}`}
                      >
                        {/* Miniature Package Preview */}
                        <div className="w-16 h-16 bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-850 rounded-lg flex-shrink-0 flex items-center justify-center p-1 text-[16px]">
                          {item.product.id === 'good-day-cashew' ? '🍪' : item.product.id === 'oreo-choco' ? '🍩' : item.product.category === 'oils-ghee' ? '🧴' : item.product.category === 'household-care' ? '🧼' : '📦'}
                        </div>

                        {/* Content */}
                        <div className="flex-grow flex flex-col justify-between">
                          <div>
                            <h4 className="font-bold text-xs text-neutral-800 dark:text-neutral-100 line-clamp-1">
                              {item.product.name}
                            </h4>
                            <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-semibold">{item.product.unit} pack</p>
                          </div>

                          <div className="flex justify-between items-end mt-1">
                            {/* Costings */}
                            <div className="flex flex-col">
                              <div className="flex items-center gap-1.5">
                                <span className="font-black text-sm text-neutral-800 dark:text-white">₹{item.product.price * item.quantity}</span>
                                <span className="text-[10px] text-neutral-400 dark:text-neutral-500 line-through font-medium">₹{item.product.mrp * item.quantity}</span>
                              </div>
                              {itemSavings > 0 && (
                                <span className="text-[9px] font-extrabold text-emerald-600 dark:text-emerald-400">Saved ₹{itemSavings}</span>
                              )}
                            </div>

                            {/* Stepper controls */}
                            <div className="bg-emerald-700 text-white rounded-lg h-7 px-1.5 flex items-center justify-between gap-3">
                              <button
                                onClick={() => onUpdateCart(item.product.id, item.quantity - 1)}
                                className="p-0.5 hover:bg-emerald-800 rounded text-white"
                                id={`cart-decrement-${item.product.id}`}
                              >
                                <Minus className="w-3 h-3 stroke-[3]" />
                              </button>
                              <span className="font-extrabold text-xs select-none">{item.quantity}</span>
                              <button
                                onClick={() => onUpdateCart(item.product.id, item.quantity + 1)}
                                className="p-0.5 hover:bg-emerald-800 rounded text-white"
                                id={`cart-increment-${item.product.id}`}
                              >
                                <Plus className="w-3 h-3 stroke-[3]" />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Delete button */}
                        <button
                          onClick={() => onRemoveFromCart(item.product.id)}
                          className="p-1 hover:bg-rose-50 text-neutral-300 hover:text-rose-600 rounded-lg transition-colors shrink-0 flex items-center"
                          id={`cart-remove-${item.product.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Footer calculations & checkout trigger */}
                <div className="p-4 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 space-y-4 shrink-0 transition-colors duration-300">
                  {/* Promo coupons block */}
                  <div className="bg-neutral-50 dark:bg-neutral-950 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-black text-neutral-700 dark:text-neutral-300">
                      <Percent className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span>Promotional Coupons</span>
                    </div>

                    {appliedCoupon ? (
                      <div className="flex justify-between items-center bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 px-2.5 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800/60 text-xs font-bold">
                        <div className="flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>Coupon <b>{appliedCoupon}</b> Applied!</span>
                        </div>
                        <button onClick={handleRemoveCoupon} className="text-rose-600 font-extrabold hover:underline">
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Enter Coupon (e.g. DESI10)"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            className="flex-grow bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 px-3 py-1.5 rounded-lg text-xs font-semibold focus:outline-none focus:border-emerald-500 uppercase text-neutral-800 dark:text-neutral-100"
                            id="coupon-input"
                          />
                          <button
                            onClick={() => handleApplyCoupon(couponCode)}
                            className="bg-emerald-700 text-white font-extrabold text-xs px-4 rounded-lg hover:bg-emerald-800"
                            id="apply-coupon-btn"
                          >
                            Apply
                          </button>
                        </div>
                        {/* Quick options links */}
                        <div className="flex gap-1.5 overflow-x-auto pb-1 text-[9px] font-black uppercase text-neutral-500">
                          <button
                            onClick={() => handleApplyCoupon('DESI10')}
                            className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-750 hover:border-emerald-300 px-2 py-1 rounded shadow-sm hover:bg-emerald-50/50 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 shrink-0"
                          >
                            DESI10 (10% Off)
                          </button>
                          <button
                            onClick={() => handleApplyCoupon('FREESHIP')}
                            className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-750 hover:border-emerald-300 px-2 py-1 rounded shadow-sm hover:bg-emerald-50/50 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 shrink-0"
                          >
                            FREESHIP
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Pricing detail list */}
                  <div className="space-y-1.5 text-xs text-neutral-600 dark:text-neutral-400">
                    <div className="flex justify-between">
                      <span>Total MRP</span>
                      <span className="line-through">₹{mrpTotal}</span>
                    </div>
                    {productDiscount > 0 && (
                      <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                        <span>Special Store Discount</span>
                        <span>-₹{productDiscount}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Store Price</span>
                      <span>₹{itemTotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Charge</span>
                      <span>{deliveryCharge === 0 ? <b className="text-emerald-600 dark:text-emerald-400 font-extrabold">FREE</b> : `₹${deliveryCharge}`}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Convenience & Packing Fee</span>
                      <span>₹{PACKING_FEE}</span>
                    </div>
                    {couponDiscount > 0 && (
                      <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-1 rounded border border-emerald-100 dark:border-emerald-900">
                        <span>Coupon Discount</span>
                        <span>-₹{couponDiscount}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-base font-black text-neutral-900 dark:text-white pt-1.5 border-t border-dashed border-neutral-200 dark:border-neutral-800">
                      <span>Total To Pay</span>
                      <span>₹{finalTotal}</span>
                    </div>
                  </div>

                  {/* Proceed button */}
                  <button
                    onClick={() => setCheckoutStep('checkout')}
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-3.5 px-4 rounded-xl font-extrabold text-sm shadow-lg flex items-center justify-between transition-colors"
                    id="proceed-to-checkout-btn"
                  >
                    <span>Proceed to Delivery details</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              // --- DELIVERY DETAILS CHECKOUT STEP ---
              <form onSubmit={handleCheckoutSubmit} className="flex-grow flex flex-col overflow-hidden">
                <div className="p-4 bg-white dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-850 shrink-0 flex items-center gap-2 transition-colors duration-300">
                  <button
                    type="button"
                    onClick={() => setCheckoutStep('cart')}
                    className="text-xs text-emerald-700 dark:text-emerald-400 font-black hover:underline"
                  >
                    ← Back to Basket
                  </button>
                  <span className="text-xs text-neutral-400 dark:text-neutral-500">/ Checkout Details</span>
                </div>

                {/* Form area scrollable */}
                <div className="flex-grow overflow-y-auto p-4 space-y-4">
                  <h3 className="font-extrabold text-sm text-neutral-800 dark:text-neutral-100 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
                    <span>Enter Delivery Address</span>
                  </h3>

                  {/* Name field */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                      <User className="w-3.5 h-3.5" /> Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full bg-white dark:bg-neutral-900 border ${formErrors.name ? 'border-rose-500' : 'border-neutral-300 dark:border-neutral-700'} px-3 py-2 rounded-lg text-xs font-semibold focus:outline-none focus:border-emerald-500 text-neutral-800 dark:text-neutral-100`}
                      id="checkout-name"
                    />
                    {formErrors.name && <p className="text-[10px] font-bold text-rose-500 dark:text-rose-400">{formErrors.name}</p>}
                  </div>

                  {/* Phone field */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5" /> 10-Digit Mobile Number
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. 9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`w-full bg-white dark:bg-neutral-900 border ${formErrors.phone ? 'border-rose-500' : 'border-neutral-300 dark:border-neutral-700'} px-3 py-2 rounded-lg text-xs font-semibold focus:outline-none focus:border-emerald-500 text-neutral-800 dark:text-neutral-100`}
                      id="checkout-phone"
                    />
                    {formErrors.phone && <p className="text-[10px] font-bold text-rose-500 dark:text-rose-400">{formErrors.phone}</p>}
                  </div>

                  {/* Flat / House details */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                      <Home className="w-3.5 h-3.5" /> Flat / House / Floor / Building No.
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Flat 304, Block-B, Sunrise Apartments"
                      value={flat}
                      onChange={(e) => setFlat(e.target.value)}
                      className={`w-full bg-white dark:bg-neutral-900 border ${formErrors.flat ? 'border-rose-500' : 'border-neutral-300 dark:border-neutral-700'} px-3 py-2 rounded-lg text-xs font-semibold focus:outline-none focus:border-emerald-500 text-neutral-800 dark:text-neutral-100`}
                      id="checkout-flat"
                    />
                    {formErrors.flat && <p className="text-[10px] font-bold text-rose-500 dark:text-rose-400">{formErrors.flat}</p>}
                  </div>

                  {/* Locality details */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Area / Colony / Street Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Sector 15, Rohini"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className={`w-full bg-white dark:bg-neutral-900 border ${formErrors.area ? 'border-rose-500' : 'border-neutral-300 dark:border-neutral-700'} px-3 py-2 rounded-lg text-xs font-semibold focus:outline-none focus:border-emerald-500 text-neutral-800 dark:text-neutral-100`}
                      id="checkout-area"
                    />
                    {formErrors.area && <p className="text-[10px] font-bold text-rose-500 dark:text-rose-400">{formErrors.area}</p>}
                  </div>

                  {/* Landmark, City & Pincode */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1 col-span-2">
                      <label className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        Landmark (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Opposite Central Park"
                        value={landmark}
                        onChange={(e) => setLandmark(e.target.value)}
                        className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 px-3 py-2 rounded-lg text-xs font-semibold focus:outline-none focus:border-emerald-500 text-neutral-800 dark:text-neutral-100"
                        id="checkout-landmark"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        City
                      </label>
                      <select
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 px-3 py-2 rounded-lg text-xs font-semibold focus:outline-none focus:border-emerald-500 text-neutral-800 dark:text-neutral-100"
                        id="checkout-city"
                      >
                        <option value="New Delhi" className="bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100">New Delhi</option>
                        <option value="Mumbai" className="bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100">Mumbai</option>
                        <option value="Bengaluru" className="bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100">Bengaluru</option>
                        <option value="Kolkata" className="bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100">Kolkata</option>
                        <option value="Chennai" className="bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-100">Chennai</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        Pincode
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 110085"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        className={`w-full bg-white dark:bg-neutral-900 border ${formErrors.pincode ? 'border-rose-500' : 'border-neutral-300 dark:border-neutral-700'} px-3 py-2 rounded-lg text-xs font-semibold focus:outline-none focus:border-emerald-500 text-neutral-800 dark:text-neutral-100`}
                        id="checkout-pincode"
                      />
                      {formErrors.pincode && <p className="text-[10px] font-bold text-rose-500 dark:text-rose-400">{formErrors.pincode}</p>}
                    </div>
                  </div>

                  {/* Payment method */}
                  <div className="space-y-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                    <h4 className="font-extrabold text-sm text-neutral-800 dark:text-neutral-100">Select Payment Method</h4>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('cod')}
                        className={`p-3 rounded-xl border font-bold text-xs flex flex-col justify-center items-center gap-1 transition-all ${
                          paymentMethod === 'cod'
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-300 shadow'
                            : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                        }`}
                        id="payment-cod"
                      >
                        <span className="text-lg">💵</span>
                        <span>Cash/COD</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('upi')}
                        className={`p-3 rounded-xl border font-bold text-xs flex flex-col justify-center items-center gap-1 transition-all ${
                          paymentMethod === 'upi'
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-300 shadow'
                            : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                        }`}
                        id="payment-upi"
                      >
                        <span className="text-lg">📱</span>
                        <span>UPI QR</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('card')}
                        className={`p-3 rounded-xl border font-bold text-xs flex flex-col justify-center items-center gap-1 transition-all ${
                          paymentMethod === 'card'
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-800 dark:text-emerald-300 shadow'
                            : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                        }`}
                        id="payment-card"
                      >
                        <span className="text-lg">💳</span>
                        <span>Card/Net</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Footer and checkout action */}
                <div className="p-4 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 shrink-0 transition-colors duration-300">
                  <div className="flex justify-between items-center text-xs text-neutral-600 dark:text-neutral-400 mb-3 font-semibold">
                    <span>Total Amount to Pay:</span>
                    <span className="text-lg font-black text-neutral-900 dark:text-white">₹{finalTotal}</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-4 rounded-xl font-extrabold text-sm shadow-lg flex items-center justify-center gap-2 transition-colors"
                    id="place-order-submit-btn"
                  >
                    <span>PLACE SIMULATED ORDER</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

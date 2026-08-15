import React, { useState } from 'react';
import { CartItem } from '../types';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Check, Percent, MapPin, Phone, User, Home, CreditCard, QrCode, Lock, RefreshCw, ArrowLeft, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import UPIMerchantPayment from './UPIMerchantPayment';

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
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout' | 'payment_upi' | 'payment_card'>('cart');

  // Checkout form fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [flat, setFlat] = useState('');
  const [area, setArea] = useState('');
  const [landmark, setLandmark] = useState('');
  const [city, setCity] = useState('Varanasi');
  const [pincode, setPincode] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [locatingError, setLocatingError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi' | 'card'>('cod');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);

  // Wrapper to save address as default on successful order placement.
  // IMPORTANT: this is scoped to the logged-in customer's own id/email, never
  // to a single global browser-wide key. A global key meant that if two
  // different people checked out on the same device (family member, shared
  // shop tablet, etc.), the second person's order could silently inherit the
  // first person's saved phone number - which is exactly what was causing
  // wrong contact numbers to show up in the owner dashboard.
  const handleSaveAddressAndPlaceOrder = (address: any, method: string, discount: number) => {
    try {
      if (currentUser && (currentUser.id || currentUser.email)) {
        const key = `grocery_default_address_${currentUser.id || currentUser.email}`;
        localStorage.setItem(key, JSON.stringify(address));
      }
      // For guest checkouts we deliberately do NOT persist to a shared/global
      // key - each guest must always enter their own details fresh.
    } catch (e) {
      console.error('Failed to save default address:', e);
    }
    onPlaceOrder(address, method, discount);
  };

  // Card details state
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [isCvvFocused, setIsCvvFocused] = useState(false);
  const [cardError, setCardError] = useState('');

  // UPI/Universal payment process states
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'idle' | 'authorizing' | 'success'>('idle');
  const [upiCountdown, setUpiCountdown] = useState(300); // 5 mins
  const [qrType, setQrType] = useState<'shop' | 'dynamic'>('shop');

  const POPULAR_CITIES = [
    'Varanasi',
    'New Delhi',
    'Mumbai',
    'Bengaluru',
    'Kolkata',
    'Chennai',
    'Pune',
    'Lucknow',
    'Patna',
    'Jaipur',
    'Hyderabad',
    'Ahmedabad'
  ];

  const filteredCities = city
    ? POPULAR_CITIES.filter(c => c.toLowerCase().includes(city.toLowerCase()))
    : POPULAR_CITIES;

  // Sync with currentUser's own saved address when drawer opens.
  // Deliberately scoped to the logged-in user's id/email - never a global,
  // device-wide default - so a guest or a different logged-in customer on
  // the same browser never sees someone else's phone number pre-filled.
  React.useEffect(() => {
    if (isOpen) {
      if (currentUser && (currentUser.id || currentUser.email)) {
        try {
          const key = `grocery_default_address_${currentUser.id || currentUser.email}`;
          const saved = localStorage.getItem(key);
          if (saved) {
            const addr = JSON.parse(saved);
            setName(addr.name || currentUser.name || '');
            setPhone(addr.phone || currentUser.phone || '');
            setFlat(addr.flat || currentUser.address || '');
            setArea(addr.area || '');
            setLandmark(addr.landmark || '');
            setCity(addr.city || 'Varanasi');
            setPincode(addr.pincode || '');
            setLatitude(addr.latitude || '');
            setLongitude(addr.longitude || '');
            return;
          }
        } catch (e) {
          console.error('Error loading default saved address:', e);
        }

        setName(currentUser.name || '');
        setPhone(currentUser.phone || '');
        setFlat(currentUser.address || '');
      } else {
        // Guest checkout: always start blank so the person filling the form
        // right now enters their own real phone number, instead of
        // inheriting whatever was last saved on this device.
        setName('');
        setPhone('');
        setFlat('');
        setArea('');
        setLandmark('');
        setCity('Varanasi');
        setPincode('');
        setLatitude('');
        setLongitude('');
      }
    }
  }, [isOpen, currentUser]);

  // UPI Countdown effect
  React.useEffect(() => {
    if (checkoutStep !== 'payment_upi') {
      setUpiCountdown(300);
      return;
    }
    const interval = setInterval(() => {
      setUpiCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [checkoutStep]);

  const FREE_DELIVERY_THRESHOLD = 99;
  const STANDARD_DELIVERY_CHARGE = 15;
  const PACKING_FEE = 3;

  // Calculations
  const itemTotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const mrpTotal = cartItems.reduce((sum, item) => sum + item.product.mrp * item.quantity, 0);
  const productDiscount = mrpTotal - itemTotal;

  const isFreeDelivery = itemTotal >= FREE_DELIVERY_THRESHOLD;
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

  // Card Formatters
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, '');
    const limited = rawVal.slice(0, 16);
    const formatted = limited.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  const handleCardExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, '');
    const limited = rawVal.slice(0, 4);
    let formatted = limited;
    if (limited.length > 2) {
      formatted = `${limited.slice(0, 2)}/${limited.slice(2)}`;
    }
    setCardExpiry(formatted);
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, '');
    setCardCvv(rawVal.slice(0, 3));
  };

  // Payment Simulators
  const handleUpiSuccess = () => {
    setIsProcessingPayment(true);
    setPaymentStep('authorizing');
    setTimeout(() => {
      setPaymentStep('success');
      setTimeout(() => {
        handleSaveAddressAndPlaceOrder(
          { name, phone, flat, area, landmark, city, pincode, latitude, longitude },
          'upi',
          couponDiscount
        );
        setCheckoutStep('cart');
        setIsProcessingPayment(false);
        setPaymentStep('idle');
      }, 1000);
    }, 1800);
  };

  const handleCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCardError('');
    
    if (cardNumber.replace(/\s/g, '').length !== 16) {
      setCardError('Please enter a valid 16-digit card number.');
      return;
    }
    const cleanExpiry = cardExpiry.replace('/', '');
    if (cleanExpiry.length !== 4) {
      setCardError('Please enter a valid expiry date (MM/YY).');
      return;
    }
    if (cardCvv.length !== 3) {
      setCardError('Please enter a 3-digit CVV number.');
      return;
    }
    const nameToUse = cardName.trim() || name.trim();
    if (!nameToUse) {
      setCardError('Please enter the cardholder name.');
      return;
    }

    setIsProcessingPayment(true);
    setPaymentStep('authorizing');

    setTimeout(() => {
      setPaymentStep('success');
      setTimeout(() => {
        handleSaveAddressAndPlaceOrder(
          { name, phone, flat, area, landmark, city, pincode, latitude, longitude },
          'card',
          couponDiscount
        );
        setCheckoutStep('cart');
        setIsProcessingPayment(false);
        setPaymentStep('idle');
        setCardNumber('');
        setCardName('');
        setCardExpiry('');
        setCardCvv('');
      }, 1000);
    }, 2000);
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
    if (!city.trim()) errors.city = 'City is required';
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
      if (paymentMethod === 'upi') {
        setCheckoutStep('payment_upi');
      } else if (paymentMethod === 'card') {
        setCheckoutStep('payment_card');
      } else {
        handleSaveAddressAndPlaceOrder(
          { name, phone, flat, area, landmark, city, pincode, latitude, longitude },
          paymentMethod,
          couponDiscount
        );
        setTimeout(() => {
          setCheckoutStep('cart');
        }, 500);
      }
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
                          {item.product.id === 'good-day-cashew' ? '🍪' : item.product.id === 'oreo-choco' ? '🍩' : item.product.category === 'oil-and-ghee' ? '🧴' : item.product.category === 'clothes-wash-utensils' ? '🧼' : item.product.category === 'soap-skin-care' ? '🧼' : item.product.category === 'oral-care' ? '🪥' : item.product.category === 'puja-need' ? '🪔' : item.product.category === 'dairy-and-bakery' ? '🥛' : item.product.category === 'health-and-pharmacy' ? '💊' : item.product.category === 'feminine-hygiene' ? '🌸' : item.product.category === 'stationary-and-books' ? '📚' : '📦'}
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
            ) : checkoutStep === 'checkout' ? (
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

                    <div className="space-y-1 relative">
                      <label className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        City
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Varanasi"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        onFocus={() => setShowCitySuggestions(true)}
                        onBlur={() => setTimeout(() => setShowCitySuggestions(false), 200)}
                        className={`w-full bg-white dark:bg-neutral-900 border ${formErrors.city ? 'border-rose-500' : 'border-neutral-300 dark:border-neutral-700'} px-3 py-2 rounded-lg text-xs font-semibold focus:outline-none focus:border-emerald-500 text-neutral-800 dark:text-neutral-100`}
                        id="checkout-city"
                        autoComplete="off"
                      />
                      {showCitySuggestions && filteredCities.length > 0 && (
                        <div className="absolute left-0 right-0 top-[100%] mt-1 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl max-h-40 overflow-y-auto z-50 divide-y divide-neutral-100 dark:divide-neutral-900">
                          {filteredCities.map((item) => (
                            <div
                              key={item}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                setCity(item);
                                setShowCitySuggestions(false);
                              }}
                              className="px-3 py-2 text-xs font-bold text-neutral-700 dark:text-neutral-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer transition-colors flex items-center justify-between"
                            >
                              <span>{item}</span>
                              {city.toLowerCase() === item.toLowerCase() && (
                                <span className="text-emerald-500">✓</span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                      {formErrors.city && <p className="text-[10px] font-bold text-rose-500 dark:text-rose-400">{formErrors.city}</p>}
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

                    {/* GPS Delivery Location Pinning */}
                    <div className="col-span-2 space-y-2 p-3 bg-neutral-50 dark:bg-neutral-900/40 rounded-xl border border-neutral-200 dark:border-neutral-800">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-black text-neutral-600 dark:text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600" /> GPS Delivery Location
                        </span>
                        
                        <button
                          type="button"
                          onClick={() => {
                            setIsLocating(true);
                            setLocatingError(null);
                            if (!navigator.geolocation) {
                              setLocatingError('Not supported by browser');
                              setIsLocating(false);
                              return;
                            }
                            navigator.geolocation.getCurrentPosition(
                              (pos) => {
                                setLatitude(pos.coords.latitude.toFixed(6));
                                setLongitude(pos.coords.longitude.toFixed(6));
                                setIsLocating(false);
                                setLocatingError(null);
                              },
                              (err) => {
                                console.warn('Geolocation failed or was blocked by the browser.', err);
                                setIsLocating(false);
                                setLatitude('');
                                setLongitude('');
                                setLocatingError(
                                  err.code === 1
                                    ? 'Location permission denied. Please fill in your address manually below.'
                                    : 'Could not detect your location. Please fill in your address manually below.'
                                );
                              },
                              { enableHighAccuracy: true, timeout: 5000 }
                            );
                          }}
                          disabled={isLocating}
                          className="flex items-center gap-1 text-[10px] font-black uppercase text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors cursor-pointer"
                        >
                          {isLocating ? (
                            <>
                              <RefreshCw className="w-3 h-3 animate-spin" />
                              <span>Detecting...</span>
                            </>
                          ) : (
                            <>
                              <MapPin className="w-3 h-3" />
                              <span>Share GPS Location</span>
                            </>
                          )}
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <div>
                          <label className="text-[9px] font-extrabold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Latitude</label>
                          <input
                            type="text"
                            placeholder="e.g. 25.3176"
                            value={latitude}
                            onChange={(e) => setLatitude(e.target.value)}
                            className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 px-2.5 py-1.5 rounded-lg text-xs font-semibold focus:outline-none focus:border-emerald-500 text-neutral-800 dark:text-neutral-100"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] font-extrabold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">Longitude</label>
                          <input
                            type="text"
                            placeholder="e.g. 82.9739"
                            value={longitude}
                            onChange={(e) => setLongitude(e.target.value)}
                            className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 px-2.5 py-1.5 rounded-lg text-xs font-semibold focus:outline-none focus:border-emerald-500 text-neutral-800 dark:text-neutral-100"
                          />
                        </div>
                      </div>
                      
                      {locatingError && (
                        <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 leading-tight pt-1">
                          ⚠️ {locatingError}
                        </p>
                      )}
                      
                      {latitude && longitude && !locatingError && (
                        <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 pt-1">
                          ✓ GPS coordinates locked! Link: <a href={`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`} target="_blank" rel="noreferrer" className="underline hover:text-emerald-700">Open Map</a>
                        </p>
                      )}
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
                    <span>
                      {paymentMethod === 'cod' 
                        ? 'PLACE ORDER' 
                        : paymentMethod === 'upi' 
                          ? 'PROCEED TO UPI QR PORTAL' 
                          : 'PROCEED TO SECURE CARD PAY'
                      }
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            ) : checkoutStep === 'payment_upi' ? (
              <UPIMerchantPayment
                totalAmount={finalTotal}
                onPaymentSuccess={() => {
                  handleSaveAddressAndPlaceOrder(
                    { name, phone, flat, area, landmark, city, pincode, latitude, longitude },
                    'upi',
                    couponDiscount
                  );
                  setCheckoutStep('cart');
                }}
                onCancel={() => setCheckoutStep('checkout')}
              />
            ) : (
              // --- CARD PAYMENT PORTAL ---
              <div className="flex-grow flex flex-col overflow-hidden">
                {/* Back link header */}
                <div className="p-4 bg-white dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-850 shrink-0 flex items-center gap-2 transition-colors duration-300">
                  <button
                    type="button"
                    onClick={() => setCheckoutStep('checkout')}
                    disabled={isProcessingPayment}
                    className="text-xs text-emerald-700 dark:text-emerald-400 font-black hover:underline disabled:opacity-50"
                  >
                    ← Back to Details
                  </button>
                  <span className="text-xs text-neutral-400 dark:text-neutral-500">/ Secure Card Checkout</span>
                </div>

                {/* Form area scrollable */}
                <form onSubmit={handleCardSubmit} className="flex-grow flex flex-col overflow-hidden">
                  <div className="flex-grow overflow-y-auto p-4 space-y-4">
                    {/* Visual Card Display */}
                    <div className="w-full mb-4">
                      <AnimatePresence mode="wait">
                        {isCvvFocused ? (
                          <motion.div
                            key="back"
                            initial={{ rotateY: -90, opacity: 0 }}
                            animate={{ rotateY: 0, opacity: 1 }}
                            exit={{ rotateY: 90, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            {/* Card back visual */}
                            <div className="relative w-full h-40 rounded-2xl bg-gradient-to-r from-neutral-800 via-neutral-950 to-neutral-900 p-5 text-white shadow-xl overflow-hidden flex flex-col justify-between border border-neutral-700/50">
                              {/* Magnetic stripe */}
                              <div className="absolute top-5 left-0 right-0 h-8 bg-neutral-950" />
                              <div className="mt-10 flex items-center justify-between gap-4">
                                {/* Signature strip */}
                                <div className="flex-grow bg-neutral-100/90 h-8 rounded px-2 flex items-center justify-end font-mono text-black text-[10px] font-semibold italic select-none">
                                  Annapurna Premium Customer
                                </div>
                                {/* CVV */}
                                <div className="bg-amber-400 text-black px-3 py-1.5 rounded font-mono font-extrabold text-xs shadow-inner">
                                  {cardCvv || '•••'}
                                </div>
                              </div>
                              <p className="text-[7px] text-neutral-400 leading-tight">
                                Sandbox Card Security System. Do not enter actual confidential credentials.
                              </p>
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="front"
                            initial={{ rotateY: 90, opacity: 0 }}
                            animate={{ rotateY: 0, opacity: 1 }}
                            exit={{ rotateY: -90, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            {/* Card front visual */}
                            <div className="relative w-full h-40 rounded-2xl bg-gradient-to-r from-indigo-950 via-purple-900 to-neutral-950 p-5 text-white shadow-xl overflow-hidden flex flex-col justify-between border border-white/10">
                              {/* Glass glossy overlay */}
                              <div className="absolute inset-0 bg-white/5 backdrop-blur-xs pointer-events-none" />
                              {/* Card brand & wifi */}
                              <div className="flex justify-between items-center z-10">
                                <span className="font-extrabold text-[10px] tracking-widest text-indigo-200">ANNAPURNA PREMIUM</span>
                                <span className="text-base">💳</span>
                              </div>
                              {/* Chip */}
                              <div className="flex gap-2 items-center z-10 my-1">
                                <div className="w-7 h-5 rounded-md bg-gradient-to-tr from-yellow-500 to-amber-300 opacity-90 border border-amber-600" />
                                <span className="text-[8px] text-indigo-300/80 font-bold uppercase tracking-wider">Contactless Sandbox</span>
                              </div>
                              {/* Card number */}
                              <div className="font-mono text-base tracking-wider text-center py-1 z-10">
                                {cardNumber || '•••• •••• •••• ••••'}
                              </div>
                              {/* Card holder & expiry */}
                              <div className="flex justify-between items-end z-10">
                                <div>
                                  <p className="text-[7px] uppercase text-indigo-200/60 font-bold">Card Holder</p>
                                  <p className="font-bold text-[10px] uppercase tracking-wide truncate max-w-[180px]">{cardName || name || 'VALUED CUSTOMER'}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-[7px] uppercase text-indigo-200/60 font-bold">Expires</p>
                                  <p className="font-mono font-bold text-[10px]">{cardExpiry || 'MM/YY'}</p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {cardError && (
                      <div className="bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-xs font-bold p-3 rounded-xl border border-rose-100 dark:border-rose-900">
                        ⚠️ {cardError}
                      </div>
                    )}

                    <div className="space-y-3">
                      {/* Cardholder name input */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          placeholder={name || "e.g. Rahul Sharma"}
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          disabled={isProcessingPayment}
                          className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 px-3 py-2 rounded-lg text-xs font-semibold focus:outline-none focus:border-emerald-500 text-neutral-800 dark:text-neutral-100"
                          id="card-holder-name-input"
                        />
                      </div>

                      {/* Card Number Input */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                          Card Number
                        </label>
                        <input
                          type="text"
                          placeholder="4111 2222 3333 4444"
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          disabled={isProcessingPayment}
                          className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 px-3 py-2 rounded-lg text-xs font-semibold font-mono tracking-wider focus:outline-none focus:border-emerald-500 text-neutral-800 dark:text-neutral-100"
                          id="card-number-input"
                        />
                      </div>

                      {/* Expiry & CVV */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                            Expiry Date
                          </label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            value={cardExpiry}
                            onChange={handleCardExpiryChange}
                            disabled={isProcessingPayment}
                            className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 px-3 py-2 rounded-lg text-xs font-semibold font-mono focus:outline-none focus:border-emerald-500 text-neutral-800 dark:text-neutral-100"
                            id="card-expiry-input"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                            CVV
                          </label>
                          <input
                            type="password"
                            placeholder="•••"
                            value={cardCvv}
                            onChange={handleCvvChange}
                            onFocus={() => setIsCvvFocused(true)}
                            onBlur={() => setIsCvvFocused(false)}
                            disabled={isProcessingPayment}
                            className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 px-3 py-2 rounded-lg text-xs font-semibold font-mono focus:outline-none focus:border-emerald-500 text-neutral-800 dark:text-neutral-100"
                            id="card-cvv-input"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-neutral-100 dark:bg-neutral-900 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800">
                      <p className="text-[10px] text-neutral-500 dark:text-neutral-400 leading-relaxed font-semibold">
                        🔒 <b>Banking Sandbox Protection:</b> No real transaction takes place. Feel free to type dummy values like Visa testing card <i>4111 2222 3333 4444</i> with any valid date and CVV.
                      </p>
                    </div>
                  </div>

                  {/* Card payment footer */}
                  <div className="p-4 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 shrink-0 transition-colors duration-300 space-y-2">
                    <button
                      type="submit"
                      disabled={isProcessingPayment}
                      className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:bg-neutral-300 text-white py-3.5 rounded-xl font-extrabold text-sm shadow-lg flex items-center justify-center gap-2 transition-colors"
                      id="card-pay-btn"
                    >
                      {isProcessingPayment ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Processing Secure Payment...</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          <span>PAY ₹{finalTotal} SECURELY</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setCheckoutStep('checkout')}
                      disabled={isProcessingPayment}
                      className="w-full bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400 py-2.5 rounded-xl font-bold text-xs transition-colors"
                    >
                      Cancel & Go Back
                    </button>
                  </div>
                </form>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

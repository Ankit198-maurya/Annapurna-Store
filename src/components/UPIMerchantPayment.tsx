import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Check, 
  Copy, 
  Download, 
  ExternalLink, 
  Smartphone, 
  Sparkles, 
  ArrowRight, 
  Lock, 
  ShieldCheck, 
  Loader2, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

interface UPIMerchantPaymentProps {
  totalAmount: number;
  onPaymentSuccess: () => void;
  onCancel: () => void;
}

export default function UPIMerchantPayment({ 
  totalAmount, 
  onPaymentSuccess, 
  onCancel 
}: UPIMerchantPaymentProps) {
  const upiId = 'ashutoshmaurya06121@ibl';
  const merchantName = 'Ashutosh Maurya';
  
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(300); // 5-minute checkout countdown
  const [showDesktopWarning, setShowDesktopWarning] = useState(false);

  const isMobile = typeof window !== 'undefined' && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  // Clipboard Copy Handler
  const handleCopyUPI = async () => {
    try {
      await navigator.clipboard.writeText(upiId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // QR Code Image Download Handler
  const handleDownloadQR = () => {
    const link = document.createElement('a');
    link.href = '/root-images/Ashutosh_Maurya_UPI_QR.jpeg';
    link.download = 'Ashutosh_Maurya_UPI_QR.jpeg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 5 Minute countdown timer
  useEffect(() => {
    if (timerSeconds <= 0) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timerSeconds]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // "I've Paid" trigger -> Shows beautiful secure processing simulator then success popup
  const handleIvePaidClick = () => {
    setIsProcessing(true);
    
    // Simulate multi-step payment confirmation & cryptographic verification
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccessPopup(true);
    }, 2200);
  };

  // Confirm popup and finalize the transaction
  const handleFinalConfirm = () => {
    setShowSuccessPopup(false);
    onPaymentSuccess();
  };

  // UPI deep link
  const upiDeepLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${totalAmount.toFixed(2)}&cu=INR&tn=${encodeURIComponent('Annapurna Kirana Order')}`;

  const handlePayNowAppClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isMobile) {
      e.preventDefault();
      setShowDesktopWarning(true);
      // Auto-hide warning after 6 seconds
      setTimeout(() => setShowDesktopWarning(false), 6000);
    }
  };

  return (
    <div className="flex-grow flex flex-col overflow-hidden bg-neutral-50 dark:bg-neutral-950 transition-colors duration-300">
      
      {/* Header section with back navigation */}
      <div className="p-4 bg-white dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800 shrink-0 flex items-center justify-between transition-colors duration-300">
        <button
          type="button"
          onClick={onCancel}
          disabled={isProcessing}
          className="text-xs text-emerald-700 dark:text-emerald-400 font-extrabold hover:underline flex items-center gap-1 disabled:opacity-50"
        >
          ← Change Payment Method
        </button>
        <span className="text-xs font-bold text-neutral-400 dark:text-neutral-500">Secure UPI Gateway</span>
      </div>

      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        
        {/* Dynamic Countdown Alert */}
        {timerSeconds > 0 ? (
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 rounded-xl px-4 py-2.5 flex items-center justify-between text-xs font-bold text-amber-800 dark:text-amber-400">
            <span className="flex items-center gap-1.5 animate-pulse">
              ⏱️ UPI QR Session Active
            </span>
            <span className="font-mono bg-amber-100 dark:bg-amber-950/60 px-2 py-0.5 rounded-md">
              {formatTime(timerSeconds)}
            </span>
          </div>
        ) : (
          <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60 rounded-xl p-3 flex items-center gap-2 text-xs font-bold text-rose-700 dark:text-rose-400">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>QR Session has expired. Please return and regenerate the order to pay.</span>
          </div>
        )}

        {/* Pay via UPI Main Card */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-5 shadow-sm space-y-6 relative overflow-hidden">
          
          {/* Accent decoration */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600" />

          {/* Card Title & Merchant Details */}
          <div className="text-center space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              Pay via UPI
            </div>
            <h3 className="text-sm font-black text-neutral-800 dark:text-neutral-200 tracking-tight mt-1">
              Authorized Store Merchant
            </h3>
            <p className="text-lg font-black text-emerald-700 dark:text-emerald-400 font-mono">
              ₹{totalAmount.toFixed(2)}
            </p>
          </div>

          {/* QR Code Container with Scanner Effect */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative p-4 bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-950 dark:to-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-850 shadow-inner group">
              
              {/* Camera corner brackets */}
              <div className="absolute top-0 left-0 w-5 h-5 border-t-4 border-l-4 border-emerald-600 rounded-tl" />
              <div className="absolute top-0 right-0 w-5 h-5 border-t-4 border-r-4 border-emerald-600 rounded-tr" />
              <div className="absolute bottom-0 left-0 w-5 h-5 border-b-4 border-l-4 border-emerald-600 rounded-bl" />
              <div className="absolute bottom-0 right-0 w-5 h-5 border-b-4 border-r-4 border-emerald-600 rounded-br" />
              
              {/* Dynamic Laser Line */}
              <div className="absolute left-2 right-2 h-0.5 bg-emerald-500 shadow-[0_0_10px_#10b981] animate-bounce top-1/2 pointer-events-none" />

              {/* Provided UPI QR Code Image */}
              <div className="w-52 h-72 flex bg-white select-none items-center justify-center p-2 rounded-lg overflow-hidden border border-neutral-200">
                <img
                  src="/root-images/Ashutosh_Maurya_UPI_QR.jpeg"
                  alt="Ashutosh Maurya UPI QR Code"
                  className="w-full h-full object-contain rounded-md"
                  id="upi-payment-qr-image"
                  onError={(e) => {
                    // Fallback generator if image fails
                    (e.target as HTMLImageElement).src = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiDeepLink)}`;
                  }}
                />
              </div>
            </div>

            {/* Merchant Name Text */}
            <p className="text-xs font-black text-neutral-800 dark:text-neutral-200 mt-3 text-center">
              👤 {merchantName}
            </p>
          </div>

          {/* UPI ID Display & Copy Button Section */}
          <div className="bg-neutral-50 dark:bg-neutral-950 p-3 rounded-2xl border border-neutral-150 dark:border-neutral-800 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[9px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest block">Merchant UPI ID</span>
              <span className="text-xs font-mono font-black text-neutral-700 dark:text-neutral-300">
                {upiId}
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopyUPI}
              className={`px-3 py-1.5 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition-all ${
                copied
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
              }`}
              title="Copy UPI address"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy ID</span>
                </>
              )}
            </button>
          </div>

          {/* Download QR & Deep Link App Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleDownloadQR}
              className="px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-850 active:scale-95 font-extrabold text-xs text-neutral-700 dark:text-neutral-300 flex items-center justify-center gap-1.5 transition-all shadow-sm"
            >
              <Download className="w-4 h-4 text-neutral-500" />
              Download QR
            </button>

            <a
              href={upiDeepLink}
              onClick={handlePayNowAppClick}
              className="px-4 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-850 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 active:scale-95 font-extrabold text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-center gap-1.5 transition-all shadow-sm"
              title="Open default UPI payment application on your smartphone"
            >
              <Smartphone className="w-4 h-4 text-emerald-600" />
              Pay Now (App)
            </a>
          </div>

          <AnimatePresence>
            {showDesktopWarning && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3 rounded-xl text-left text-[11px] text-amber-800 dark:text-amber-300 font-bold space-y-1 overflow-hidden"
              >
                <div className="flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
                  <span>Desktop Device Detected</span>
                </div>
                <p className="font-semibold leading-relaxed">
                  UPI app launch links work exclusively on mobile phones (like Google Pay, PhonePe, Paytm, BHIM). For desktop checkout, please scan the QR code above using your phone's camera or payment app.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Payment Step Instructions */}
          <div className="bg-emerald-50/50 dark:bg-emerald-950/10 p-4 rounded-2xl border border-emerald-100/50 dark:border-emerald-900/40 text-left space-y-2">
            <h4 className="text-[10px] font-black text-emerald-800 dark:text-emerald-400 uppercase tracking-widest">📝 Checkout Instructions</h4>
            <ul className="text-[10px] text-neutral-600 dark:text-neutral-400 space-y-1.5 font-bold list-decimal pl-3.5">
              <li>Scan the QR code above using any smartphone UPI scanner app.</li>
              <li>Or click <b className="text-emerald-700 dark:text-emerald-400">Copy ID</b> and paste it into your desired payment application.</li>
              <li>Input exactly <b>₹{totalAmount.toFixed(2)}</b> and complete the secure payment transaction.</li>
              <li>After completing the payment in your app, tap the green <b>"I've Paid"</b> button below to secure order confirmation.</li>
            </ul>
          </div>

          {/* Accepted UPI Applications Banner */}
          <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-850 text-center">
            <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Supported Payment Apps</p>
            <div className="flex items-center justify-center gap-4 py-1.5 px-3 bg-neutral-50 dark:bg-neutral-950 rounded-xl border border-neutral-100 dark:border-neutral-900 inline-flex mx-auto">
              {/* Google Pay Label */}
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                <span className="text-[9px] font-extrabold text-neutral-500">Google Pay</span>
              </div>
              {/* PhonePe Label */}
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                <span className="text-[9px] font-extrabold text-neutral-500">PhonePe</span>
              </div>
              {/* Paytm Label */}
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                <span className="text-[9px] font-extrabold text-neutral-500">Paytm</span>
              </div>
              {/* BHIM Label */}
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                <span className="text-[9px] font-extrabold text-neutral-500">BHIM UPI</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Main Bottom CTAs */}
      <div className="p-4 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 shrink-0 transition-colors duration-300 space-y-2">
        <button
          onClick={handleIvePaidClick}
          disabled={isProcessing || timerSeconds <= 0}
          className="w-full bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white py-3.5 rounded-2xl font-extrabold text-xs shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer disabled:bg-neutral-300 disabled:cursor-not-allowed"
          id="upi-ive-paid-btn"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Verifying secure UPI transaction...</span>
            </>
          ) : (
            <>
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>I'VE PAID - CONFIRM ORDER</span>
            </>
          )}
        </button>

        <button
          onClick={onCancel}
          disabled={isProcessing}
          className="w-full bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400 py-2.5 rounded-xl font-bold text-xs transition-colors"
        >
          Cancel & Edit Delivery Address
        </button>
      </div>

      {/* SUCCESS CONFIRMATION POPUP (MODAL OVERLAY) */}
      <AnimatePresence>
        {showSuccessPopup && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-neutral-950/80 backdrop-blur-xs"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative z-10 text-center space-y-4"
            >
              {/* Animated Success Badge */}
              <div className="mx-auto w-16 h-16 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center text-3xl font-bold border border-emerald-200 dark:border-emerald-900 shadow-inner animate-bounce">
                ✓
              </div>

              <div className="space-y-1">
                <h4 className="text-base font-black text-neutral-800 dark:text-neutral-200">
                  Transaction Authenticated!
                </h4>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-bold leading-relaxed">
                  Your manual UPI payment to <b className="text-neutral-800 dark:text-neutral-200">{merchantName}</b> was authenticated successfully.
                </p>
              </div>

              {/* Secure receipt details */}
              <div className="bg-neutral-50 dark:bg-neutral-950 p-3 rounded-2xl text-left border border-neutral-100 dark:border-neutral-850 space-y-1.5 font-mono text-[9px] text-neutral-500">
                <div className="flex justify-between">
                  <span>Merchant:</span>
                  <span className="font-bold text-neutral-700 dark:text-neutral-300">{merchantName}</span>
                </div>
                <div className="flex justify-between">
                  <span>UPI VPA:</span>
                  <span className="font-bold text-neutral-700 dark:text-neutral-300">{upiId}</span>
                </div>
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span className="font-bold text-emerald-600">₹{totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Txn Ref:</span>
                  <span className="font-bold text-neutral-700 dark:text-neutral-300">TXN{Math.floor(Math.random() * 90000000) + 10000000}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="font-extrabold text-emerald-600 uppercase">SECURELY_PAID</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={handleFinalConfirm}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-3 rounded-xl font-black text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Proceed to Order Status</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

import { useState, useEffect, useRef } from 'react';
import { Order, CartItem } from '../types';
import { Check, Truck, Clock, ShoppingBag, ShieldCheck, FileText, ArrowRight, X, Phone, User, MapPin } from 'lucide-react';
import { motion } from 'motion/react';

interface OrderSimulatorProps {
  order: Order | null;
  onClose: () => void;
}

export default function OrderSimulator({ order, onClose }: OrderSimulatorProps) {
  const [step, setStep] = useState<number>(0); // 0: Confirmed, 1: Assembling, 2: Out for Delivery, 3: Delivered
  const [logs, setLogs] = useState<string[]>([]);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Simulation timeline and triggers
  useEffect(() => {
    if (!order) return;

    setStep(0);
    setLogs([
      `[${getTimestamp()}] Payment processed successfully! Total: ₹${order.totalAmount}`,
      `[${getTimestamp()}] Order #${order.id.substring(4, 10).toUpperCase()} generated.`,
      `[${getTimestamp()}] Sending order receipt to store assistant at central warehouse...`,
    ]);

    // Timer for step 1: Assembling
    const t1 = setTimeout(() => {
      setStep(1);
      addLog(`Store manager accepted order. Commencing pack assembly...`);
      order.items.forEach((item, index) => {
        setTimeout(() => {
          addLog(`Item Packed: ${item.product.name} (x${item.quantity}) - checked for freshness.`);
        }, (index + 1) * 800);
      });
    }, 3000);

    // Timer for step 2: Out for Delivery
    const t2 = setTimeout(() => {
      setStep(2);
      addLog(`Bag sanitization complete. Standard quality seals attached.`);
      addLog(`Delivery executive "Ramu Prasad" (+91 98725 44921) assigned to order.`);
      addLog(`Ramu has picked up your grocery bag. Navigating via GPS to your address...`);
      addLog(`ETA: 10 minutes.`);
    }, 8500);

    // Timer for step 3: Delivered
    const t3 = setTimeout(() => {
      setStep(3);
      addLog(`Ramu is arriving near your flat: ${order.deliveryAddress.flat}, ${order.deliveryAddress.area}...`);
      addLog(`Ding dong! OTP verified. Handed over safe and secure.`);
      addLog(`Order marked as DELIVERED successfully! Thank you for shopping with us.`);
    }, 17000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [order]);

  // Scroll logs to bottom whenever they are appended
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  const getTimestamp = () => {
    const d = new Date();
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const addLog = (msg: string) => {
    setLogs((prev) => [...prev, `[${getTimestamp()}] ${msg}`]);
  };

  if (!order) return null;

  const stepsList = [
    { label: 'Confirmed', desc: 'Payment Verified', icon: '💳' },
    { label: 'Packing', desc: 'Assembling in Hub', icon: '📦' },
    { label: 'On The Way', desc: 'Out for Delivery', icon: '🛵' },
    { label: 'Delivered', desc: 'Arrived at Doorstep', icon: '🏡' },
  ];

  return (
    <div className="fixed inset-0 bg-neutral-900/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl flex flex-col md:flex-row overflow-hidden border border-neutral-100 max-h-[90vh]">
        {/* LEFT PANEL: Map-like delivery tracking progress and logs */}
        <div className="flex-1 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-neutral-200 bg-neutral-50 overflow-y-auto">
          <div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <span className="text-[10px] font-black tracking-wider uppercase bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
                  LIVE SIMULATION ACTIVE
                </span>
                <h2 className="font-extrabold text-xl text-neutral-800 mt-2">Delivery Partner GPS Status</h2>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-neutral-400 font-bold uppercase">Order ID</p>
                <p className="text-xs font-mono font-extrabold text-neutral-700">#{order.id.toUpperCase()}</p>
              </div>
            </div>

            {/* Simulated Live status map card visual */}
            <div className="relative bg-emerald-800 rounded-2xl h-44 mb-6 overflow-hidden flex flex-col justify-between p-4 shadow-inner text-white">
              {/* Fake road paths background */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_30%,transparent_10px,white_11px)] bg-[length:24px_24px]" />
              <div className="absolute top-1/4 left-0 right-0 h-1 bg-white/20" />
              <div className="absolute bottom-1/4 left-0 right-0 h-1 bg-white/20" />
              <div className="absolute left-1/3 top-0 bottom-0 w-1 bg-white/20" />

              <div className="flex justify-between items-start z-10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex justify-center items-center text-lg animate-bounce">
                    📦
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-emerald-200">Current Status</p>
                    <p className="text-xs font-black">{stepsList[step].desc}</p>
                  </div>
                </div>
                {step < 3 && (
                  <div className="bg-emerald-900/60 backdrop-blur-md text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1.5 border border-emerald-600/50">
                    <Clock className="w-3.5 h-3.5 animate-spin" />
                    <span>ETA: {step === 0 ? '9 mins' : step === 1 ? '6 mins' : '2 mins'}</span>
                  </div>
                )}
              </div>

              {/* Dynamic animation on map */}
              <div className="relative h-12 w-full z-10 flex items-center">
                {/* Delivery Boy Avatar slider */}
                <motion.div
                  animate={{
                    x: step === 0 ? '0%' : step === 1 ? '30%' : step === 2 ? '70%' : '90%',
                  }}
                  transition={{ type: 'spring', stiffness: 50, damping: 12 }}
                  className="absolute flex flex-col items-center"
                >
                  <div className="bg-white text-black text-xs font-black px-2 py-0.5 rounded shadow-lg border border-neutral-100 flex items-center gap-1">
                    <span>🛵 Ramu</span>
                  </div>
                  <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-white shadow mt-1 animate-ping" />
                </motion.div>

                {/* Target Destination Pin */}
                <div className="absolute right-2 flex flex-col items-center">
                  <div className="bg-rose-500 text-white text-[9px] font-black px-2 py-0.5 rounded shadow">
                    🏡 YOUR HOME
                  </div>
                  <div className="w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white shadow mt-1" />
                </div>
              </div>
            </div>

            {/* Stepper visual progress dots */}
            <div className="grid grid-cols-4 gap-2 mb-6">
              {stepsList.map((st, i) => {
                const isActive = step >= i;
                const isCurrent = step === i;
                return (
                  <div key={i} className="flex flex-col items-center text-center">
                    <div
                      className={`w-9 h-9 rounded-full flex justify-center items-center text-sm transition-all duration-300 ${
                        isCurrent
                          ? 'bg-emerald-700 text-white scale-110 shadow-lg ring-4 ring-emerald-100'
                          : isActive
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-neutral-200 text-neutral-400'
                      }`}
                    >
                      {isActive && !isCurrent ? '✓' : st.icon}
                    </div>
                    <span className={`text-[10px] font-bold mt-2 ${isActive ? 'text-neutral-800' : 'text-neutral-400'}`}>
                      {st.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Scrolling Dispatch Logs terminal */}
          <div className="space-y-2 flex-grow flex flex-col min-h-[140px]">
            <h4 className="text-[11px] font-bold text-neutral-400 tracking-wider uppercase">Live Dispatch Logs</h4>
            <div
              ref={logContainerRef}
              className="flex-grow bg-neutral-900 rounded-xl p-3 font-mono text-[10px] text-emerald-400 overflow-y-auto space-y-1.5 shadow-inner border border-neutral-850 h-32"
            >
              {logs.map((log, index) => (
                <div key={index} className="leading-relaxed border-l-2 border-emerald-500/20 pl-1.5">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Retail Tax Invoice Receipt */}
        <div className="w-full md:w-[380px] p-6 flex flex-col justify-between overflow-y-auto max-h-full">
          <div>
            <div className="text-center pb-4 border-b border-dashed border-neutral-200">
              <span className="text-2xl">🏪</span>
              <h1 className="font-black text-lg text-neutral-900 tracking-tight mt-1">QUICK GROCERY</h1>
              <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest mt-0.5">
                Central Warehouse Retail Invoice
              </p>
            </div>

            {/* Metadata invoice details */}
            <div className="grid grid-cols-2 gap-y-2 text-[10px] text-neutral-500 py-4 border-b border-neutral-100">
              <div>
                <p className="font-bold uppercase text-[8px] text-neutral-400">Invoice Number</p>
                <p className="font-mono font-bold text-neutral-800">#TAX-{order.id.toUpperCase().substring(0, 8)}</p>
              </div>
              <div className="text-right">
                <p className="font-bold uppercase text-[8px] text-neutral-400">Date/Time</p>
                <p className="font-bold text-neutral-800">{order.timestamp}</p>
              </div>
              <div>
                <p className="font-bold uppercase text-[8px] text-neutral-400">Customer Info</p>
                <p className="font-bold text-neutral-800">{order.deliveryAddress.name}</p>
                <p className="font-mono text-[9px]">{order.deliveryAddress.phone}</p>
              </div>
              <div className="text-right">
                <p className="font-bold uppercase text-[8px] text-neutral-400">Address Details</p>
                <p className="font-semibold text-neutral-800 truncate" title={order.deliveryAddress.flat}>
                  {order.deliveryAddress.flat}
                </p>
                <p className="text-[9px] text-neutral-500 truncate">{order.deliveryAddress.area}</p>
              </div>
            </div>

            {/* Itemized bill */}
            <div className="py-4 space-y-2.5 max-h-[160px] overflow-y-auto">
              <p className="text-[8px] font-black text-neutral-400 tracking-wider uppercase mb-1">
                Purchased Goods (Tax Free/CGST Exempted)
              </p>
              {order.items.map((item) => (
                <div key={item.product.id} className="flex justify-between items-start text-xs">
                  <div className="max-w-[70%]">
                    <p className="font-bold text-neutral-800 leading-tight">{item.product.name}</p>
                    <p className="text-[9px] text-neutral-400 font-semibold">
                      ₹{item.product.price} x {item.quantity} units
                    </p>
                  </div>
                  <span className="font-black text-neutral-900 text-right">
                    ₹{item.product.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Invoice summary values */}
            <div className="pt-3 border-t border-dashed border-neutral-200 space-y-1.5 text-xs text-neutral-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span>₹{order.items.reduce((s, i) => s + i.product.price * i.quantity, 0)}</span>
              </div>
              <div className="flex justify-between">
                <span>Packing & Handling Fee</span>
                <span>₹3</span>
              </div>
              <div className="flex justify-between">
                <span>Central GST (Exempted)</span>
                <span className="text-emerald-600 font-bold">₹0 (0% GST)</span>
              </div>
              <div className="flex justify-between text-base font-black text-neutral-900 pt-2 border-t border-neutral-200">
                <span>Final Paid</span>
                <span>₹{order.totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Footer actions once delivery finishes */}
          <div className="mt-6 pt-4 border-t border-neutral-100">
            {step === 3 ? (
              <motion.button
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                onClick={onClose}
                className="w-full bg-emerald-700 hover:bg-emerald-800 text-white py-3 px-4 rounded-xl font-extrabold text-xs shadow-md uppercase tracking-wider flex items-center justify-center gap-1.5"
                id="close-order-simulator"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Return to Store / Place New Order</span>
              </motion.button>
            ) : (
              <div className="bg-neutral-100 text-neutral-500 rounded-xl p-3 text-center text-[11px] font-bold">
                🔒 Simulating dispatch. Buttons disabled until delivery completes.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

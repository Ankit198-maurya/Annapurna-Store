import { useState, useEffect } from 'react';
import { Order } from '../types';
import { Check, Truck, ShoppingBag, ShieldCheck, FileText, ArrowRight, X, Phone, User, MapPin } from 'lucide-react';
import { motion } from 'motion/react';

interface OrderSimulatorProps {
  order: Order | null;
  onClose: () => void;
}

export default function OrderSimulator({ order, onClose }: OrderSimulatorProps) {
  const [currentOrder, setCurrentOrder] = useState<Order | null>(order);

  // Sync state with order prop
  useEffect(() => {
    if (order) {
      setCurrentOrder(order);
    }
  }, [order]);

  // Real-time polling or local simulation of current status
  useEffect(() => {
    if (!order) return;

    // 1. Attempt to poll the backend if the server is available
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/orders/${order.id}`);
        if (response.ok) {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const updatedOrder: Order = await response.json();
            setCurrentOrder(updatedOrder);
          }
        }
      } catch (err) {
        console.error('Error polling latest order status:', err);
      }
    }, 4000);

    // 2. Client-side automatic simulation sequence
    // Automatically progress order statuses locally over time (12s per stage)
    // so that the customer always has a fully interactive, successful, visual feedback experience!
    // "pending" -> "preparing" -> "dispatched" -> "delivered"
    const simulateStep = () => {
      setCurrentOrder((prev) => {
        if (!prev) return null;
        let nextStatus: Order['status'] = prev.status;
        if (prev.status === 'pending') {
          nextStatus = 'preparing';
        } else if (prev.status === 'preparing') {
          nextStatus = 'dispatched';
        } else if (prev.status === 'dispatched') {
          nextStatus = 'delivered';
        } else {
          return prev;
        }

        // Keep the local state persisted in localStorage in sync too!
        try {
          const savedOrdersStr = localStorage.getItem('grocery_orders');
          if (savedOrdersStr) {
            const savedOrders: Order[] = JSON.parse(savedOrdersStr);
            const index = savedOrders.findIndex((o) => o.id === prev.id);
            if (index !== -1) {
              savedOrders[index].status = nextStatus;
              if (nextStatus === 'preparing') savedOrders[index].eta = 8;
              else if (nextStatus === 'dispatched') savedOrders[index].eta = 4;
              else if (nextStatus === 'delivered') savedOrders[index].eta = 0;
              localStorage.setItem('grocery_orders', JSON.stringify(savedOrders));
            }
          }
        } catch (e) {
          console.error('Failed to sync simulated status to localStorage:', e);
        }

        return {
          ...prev,
          status: nextStatus,
          eta: nextStatus === 'preparing' ? 8 : nextStatus === 'dispatched' ? 4 : 0,
        };
      });
    };

    const localSimulationTimer = setInterval(() => {
      simulateStep();
    }, 12000); // 12 seconds per stage

    return () => {
      clearInterval(pollInterval);
      clearInterval(localSimulationTimer);
    };
  }, [order]);

  if (!currentOrder) return null;

  const step = currentOrder.status === 'pending' ? 0
             : currentOrder.status === 'preparing' ? 1
             : currentOrder.status === 'dispatched' ? 2
             : 3;


  const stepsList = [
    { label: 'Order Placed', desc: 'Order Confirmed', icon: '💳' },
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
                <p className="text-xs font-mono font-extrabold text-neutral-700">#{currentOrder.id.toUpperCase()}</p>
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
                    <span>🛵 Delivery Boy</span>
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
                <p className="font-mono font-bold text-neutral-800">#TAX-{currentOrder.id.toUpperCase().substring(0, 8)}</p>
              </div>
              <div className="text-right">
                <p className="font-bold uppercase text-[8px] text-neutral-400">Date/Time Ordered</p>
                <p className="font-bold text-neutral-800">{currentOrder.timestamp}</p>
              </div>
              <div>
                <p className="font-bold uppercase text-[8px] text-neutral-400">Customer Info</p>
                <p className="font-bold text-neutral-800">{currentOrder.deliveryAddress.name}</p>
                <p className="font-mono text-[9px]">{currentOrder.deliveryAddress.phone}</p>
              </div>
              <div className="text-right">
                <p className="font-bold uppercase text-[8px] text-neutral-400">Address Details</p>
                <p className="font-semibold text-neutral-800 truncate" title={currentOrder.deliveryAddress.flat}>
                  {currentOrder.deliveryAddress.flat}
                </p>
                <p className="text-[9px] text-neutral-500 truncate">{currentOrder.deliveryAddress.area}</p>
              </div>
            </div>

            {/* Itemized bill */}
            <div className="py-4 space-y-2.5 max-h-[160px] overflow-y-auto">
              <p className="text-[8px] font-black text-neutral-400 tracking-wider uppercase mb-1">
                Purchased Goods (Tax Free/CGST Exempted)
              </p>
              {currentOrder.items.map((item) => (
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
                <span>₹{currentOrder.items.reduce((s, i) => s + i.product.price * i.quantity, 0)}</span>
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
                <span>₹{currentOrder.totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Footer actions once delivery finishes */}
          <div className="mt-6 pt-4 border-t border-neutral-100 flex flex-col gap-3">
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
              <>
                <div className="bg-neutral-100 text-neutral-500 rounded-xl p-3 text-center text-[11px] font-bold">
                  ⏳ Waiting for delivery partner updates. The owner is processing your order.
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full border-2 border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 text-neutral-700 py-3 px-4 rounded-xl font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all"
                  id="back-to-home-from-simulator"
                >
                  <span>← Back to Home Page</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

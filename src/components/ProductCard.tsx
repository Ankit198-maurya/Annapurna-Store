import { useState } from 'react';
import { Product, CartItem } from '../types';
import { Heart, Star, Plus, Minus, Check, ShoppingCart, Percent } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ProductIllustration, { getBackgroundImageUrl } from './ProductIllustration';

interface ProductCardProps {
  key?: string;
  product: Product;
  cartItems: CartItem[];
  isWishlisted: boolean;
  onUpdateCart: (productId: string, quantity: number, productOverride?: Product) => void;
  onToggleWishlist: (productId: string) => void;
  onQuickView: (product: Product) => void;
}

export default function ProductCard({
  product,
  cartItems,
  isWishlisted,
  onUpdateCart,
  onToggleWishlist,
  onQuickView,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // --- Size / pack-weight variant selection (e.g. Ghee 250gm vs 500gm) ---
  const hasVariants = !!product.variants && product.variants.length > 0;
  const [selectedVariantId, setSelectedVariantId] = useState<string>(() => {
    if (!product.variants || product.variants.length === 0) return '';
    const def = product.variants.find((v) => v.isDefault) || product.variants[0];
    return def.id;
  });
  const selectedVariant = hasVariants
    ? product.variants!.find((v) => v.id === selectedVariantId) || product.variants![0]
    : undefined;

  // The cart line for a variant product is tracked under its own composite id,
  // so different sizes of the same product can sit in the basket independently.
  const cartId = selectedVariant ? `${product.id}::${selectedVariant.id}` : product.id;
  const effectivePrice = selectedVariant ? selectedVariant.price : product.price;
  const effectiveMrp = selectedVariant ? selectedVariant.mrp : product.mrp;
  const effectiveUnit = selectedVariant ? selectedVariant.unit : product.unit;

  const quantity = cartItems.find((item) => item.product.id === cartId)?.quantity || 0;

  const buildCartProduct = (): Product => {
    if (!selectedVariant) return product;
    return {
      ...product,
      id: cartId,
      price: selectedVariant.price,
      mrp: selectedVariant.mrp,
      unit: selectedVariant.unit,
    };
  };

  // Return tailwind bg color classes based on colorTheme
  const getThemeColors = (theme: string) => {
    switch (theme) {
      case 'amber':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          text: 'text-amber-800',
          accent: 'bg-amber-600 hover:bg-amber-700',
          badge: 'bg-amber-100 text-amber-800 border-amber-300',
          gradient: 'from-amber-400 to-amber-600',
        };
      case 'blue':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          text: 'text-blue-800',
          accent: 'bg-blue-600 hover:bg-blue-700',
          badge: 'bg-blue-100 text-blue-800 border-blue-300',
          gradient: 'from-blue-500 to-indigo-700',
        };
      case 'yellow':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          text: 'text-yellow-800',
          accent: 'bg-yellow-500 hover:bg-yellow-600',
          badge: 'bg-yellow-100 text-yellow-800 border-yellow-300',
          gradient: 'from-yellow-400 to-amber-500',
        };
      case 'orange':
        return {
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          text: 'text-orange-800',
          accent: 'bg-orange-500 hover:bg-orange-600',
          badge: 'bg-orange-100 text-orange-800 border-orange-300',
          gradient: 'from-orange-400 to-red-500',
        };
      case 'red':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-800',
          accent: 'bg-red-600 hover:bg-red-700',
          badge: 'bg-red-100 text-red-800 border-red-300',
          gradient: 'from-red-500 to-rose-700',
        };
      case 'green':
      case 'emerald':
        return {
          bg: 'bg-emerald-50',
          border: 'border-emerald-200',
          text: 'text-emerald-800',
          accent: 'bg-emerald-600 hover:bg-emerald-700',
          badge: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          gradient: 'from-emerald-400 to-teal-600',
        };
      case 'cyan':
      case 'sky':
        return {
          bg: 'bg-sky-50',
          border: 'border-sky-200',
          text: 'text-sky-800',
          accent: 'bg-sky-600 hover:bg-sky-700',
          badge: 'bg-sky-100 text-sky-800 border-sky-300',
          gradient: 'from-sky-400 to-blue-600',
        };
      case 'purple':
      case 'indigo':
        return {
          bg: 'bg-purple-50',
          border: 'border-purple-200',
          text: 'text-purple-800',
          accent: 'bg-purple-600 hover:bg-purple-700',
          badge: 'bg-purple-100 text-purple-800 border-purple-300',
          gradient: 'from-purple-500 to-indigo-700',
        };
      case 'stone':
      case 'slate':
      case 'neutral':
      default:
        return {
          bg: 'bg-slate-50',
          border: 'border-slate-200',
          text: 'text-slate-800',
          accent: 'bg-slate-700 hover:bg-slate-800',
          badge: 'bg-slate-100 text-slate-800 border-slate-300',
          gradient: 'from-slate-600 to-slate-800',
        };
    }
  };

  const theme = getThemeColors(product.colorTheme);

  // Render a brand-matching custom package illustration using purely Tailwind
  const renderProductIllustration = () => {
  return (
    <img
      src={product.image || getBackgroundImageUrl(product.id)}
      alt={product.name}
      className="w-full h-full object-cover rounded-2xl"
    />
  );
};

  const savings = effectiveMrp - effectivePrice;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`relative bg-white dark:bg-neutral-900 rounded-2xl border ${isHovered ? 'border-neutral-300 dark:border-neutral-700 shadow-xl' : 'border-neutral-200 dark:border-neutral-800 shadow-sm'} transition-all duration-300 flex flex-col h-full`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      id={`product-card-${product.id}`}
    >
      {/* Absolute top badge wrapper */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1.5">
        {/* Vegetarian Dot Symbol */}
        {product.isVeg && (
          <div className="w-5 h-5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded flex justify-center items-center shadow-sm" title="100% Vegetarian">
            <div className="w-3 h-3 border-2 border-emerald-600 flex justify-center items-center">
              <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
            </div>
          </div>
        )}

        {/* Brand special packaging tag as seen on screenshots */}
        {product.specialOffer && (
          <div className="bg-yellow-400 text-black border border-yellow-500 font-extrabold text-[8px] uppercase tracking-wide px-1.5 py-0.5 rounded-full shadow flex items-center gap-0.5">
            <Percent className="w-2.5 h-2.5 shrink-0" />
            <span>{product.specialOffer}</span>
          </div>
        )}
      </div>

      {/* Wishlist Heart button */}
      <button
        onClick={() => onToggleWishlist(product.id)}
        className={`absolute top-2 right-2 z-10 p-1.5 rounded-full shadow-md transition-all duration-200 ${
          isWishlisted
            ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-500'
            : 'bg-white dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 hover:text-rose-500 hover:scale-110'
        }`}
        id={`wishlist-btn-${product.id}`}
      >
        <Heart className="w-4 h-4" fill={isWishlisted ? 'currentColor' : 'none'} />
      </button>

      {/* Product Realistic Image Header */}
      <div
        onClick={() => onQuickView(product)}
        className="w-full h-28 sm:h-44 rounded-t-2xl flex justify-center items-center border-b border-neutral-100 dark:border-neutral-800 cursor-pointer relative group overflow-hidden bg-white dark:bg-neutral-950"
      >
        <img
          src={product.image || getBackgroundImageUrl(product.id)}
          alt={product.name}
          className="w-full h-full object-cover opacity-100 group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center items-center z-20">
          <span className="bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 text-[10px] font-bold py-1 px-2.5 rounded-full shadow-lg border border-neutral-200 dark:border-neutral-700">
            Quick View
          </span>
        </div>
      </div>

      {/* Product Details Info Section */}
      <div className="p-2.5 sm:p-4 flex flex-col flex-grow justify-between">
        <div>
          {/* Brand & Category */}
          <div className="flex justify-between items-center text-[10px] font-bold text-neutral-400 dark:text-neutral-500 tracking-wider uppercase mb-1">
            <span>{product.brand}</span>
            <span>{effectiveUnit}</span>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => onQuickView(product)}
            className="font-bold text-xs sm:text-sm text-neutral-800 dark:text-neutral-100 leading-snug tracking-tight hover:text-emerald-600 dark:hover:text-emerald-400 cursor-pointer line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem]"
          >
            {product.name}
          </h3>

          {/* Star Rating & Reviews */}
          <div className="flex items-center gap-1 mt-1 mb-2">
            <div className="flex items-center text-amber-400">
              <Star className="w-3.5 h-3.5 fill-current" />
            </div>
            <span className="text-[11px] font-extrabold text-neutral-700 dark:text-neutral-300">{product.rating}</span>
            <span className="text-[10px] text-neutral-400 dark:text-neutral-500">({product.reviewsCount} bought)</span>
          </div>
        </div>

        {/* Size / pack-weight choice pills - only shown for products with variants */}
        {hasVariants && (
          <div className="flex flex-wrap gap-1.5 mt-2" id={`variant-selector-${product.id}`}>
            {product.variants!.map((variant) => (
              <button
                key={variant.id}
                type="button"
                onClick={() => setSelectedVariantId(variant.id)}
                className={`text-[10px] sm:text-[11px] font-bold px-2 py-1 rounded-lg border transition-colors ${
                  selectedVariantId === variant.id
                    ? `${theme.accent} text-white border-transparent`
                    : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:border-neutral-400'
                }`}
                id={`variant-${product.id}-${variant.id}`}
              >
                {variant.label}
              </button>
            ))}
          </div>
        )}

        {/* Price and Add to Cart Row */}
        <div className="mt-2 pt-2 border-t border-neutral-50 dark:border-neutral-800/80 flex items-end justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-neutral-400 dark:text-neutral-500 line-through font-medium">MRP ₹{effectiveMrp}</span>
            <div className="flex items-baseline gap-1">
              <span className="text-base sm:text-lg font-black text-neutral-900 dark:text-white">₹{effectivePrice}</span>
              {savings > 0 && (
                <span className="hidden sm:inline text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1 py-0.2 rounded">
                  Save ₹{savings}
                </span>
              )}
            </div>
          </div>

          {/* Blinkit/Instamart styled Add Button Stepper */}
          <div className="w-16 sm:w-24 h-8 sm:h-9 shrink-0 flex items-center justify-end">
            <AnimatePresence mode="wait">
              {quantity === 0 ? (
                <motion.button
                  key="add-btn"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={() => onUpdateCart(cartId, 1, buildCartProduct())}
                  className="w-full h-full bg-white dark:bg-neutral-800 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-neutral-700 font-extrabold text-xs rounded-xl shadow-sm hover:bg-emerald-50 dark:hover:bg-neutral-700 hover:border-emerald-400 dark:hover:border-emerald-600 transition-colors duration-200 flex justify-center items-center gap-1"
                  id={`add-to-cart-${product.id}`}
                >
                  <Plus className="w-3 h-3" />
                  ADD
                </motion.button>
              ) : (
                <motion.div
                  key="stepper"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="w-full h-full bg-emerald-700 text-white rounded-xl shadow-md flex items-center justify-between px-2"
                >
                  <button
                    onClick={() => onUpdateCart(cartId, quantity - 1)}
                    className="p-1 hover:bg-emerald-800 rounded transition-colors"
                    id={`decrement-${product.id}`}
                  >
                    <Minus className="w-3.5 h-3.5 stroke-[3]" />
                  </button>
                  <span className="font-extrabold text-sm select-none" id={`quantity-${product.id}`}>{quantity}</span>
                  <button
                    onClick={() => onUpdateCart(cartId, quantity + 1, buildCartProduct())}
                    className="p-1 hover:bg-emerald-800 rounded transition-colors"
                    id={`increment-${product.id}`}
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[3]" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

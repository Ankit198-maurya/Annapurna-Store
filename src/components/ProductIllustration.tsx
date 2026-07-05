import { cloneElement } from 'react';
import { Product } from '../types';

export function getBackgroundImageUrl(id: string): string {
  const normId = id.toLowerCase();
  
  if (normId === 'maggi-noodles') {
    return 'https://kkfemwduwimomkalgzua.supabase.co/storage/v1/object/public/store/maggi-noodles.jpeg';
  }
  
  if (normId === 'desi-chawal') {
    return 'https://kkfemwduwimomkalgzua.supabase.co/storage/v1/object/public/store/chawal.jpeg';
  }
  
  if (normId === 'patanjali-butter-cookies') {
    return 'https://kkfemwduwimomkalgzua.supabase.co/storage/v1/object/public/store/patanjali-butter-cookies.jpeg';
  }
  
  if (normId === 'raag-palmolein') {
    return 'https://kkfemwduwimomkalgzua.supabase.co/storage/v1/object/public/store/raag-palmolein.jpeg';
  }
  
  if (normId === 'saloni-mustard-oil') {
    return 'https://kkfemwduwimomkalgzua.supabase.co/storage/v1/object/public/store/saloni-mustard-oil.jpeg';
  }
  
  if (normId === 'yippee-noodles-4pack') {
    return 'https://kkfemwduwimomkalgzua.supabase.co/storage/v1/object/public/store/yippee-noodles-4pack.jpeg';
  }
  
  if (normId === 'yippee-noodles-single') {
    return 'https://kkfemwduwimomkalgzua.supabase.co/storage/v1/object/public/store/yippee-noodles-single.jpeg';
  }
  
  if (normId === 'soya-chunks') {
    return 'https://kkfemwduwimomkalgzua.supabase.co/storage/v1/object/public/store/soya-chunks.jpeg';
  }
  
  if (normId === 'bounce-choco') {
    return 'https://kkfemwduwimomkalgzua.supabase.co/storage/v1/object/public/store/bounce.jpeg';
  }
  
  if (normId === 'unibic-cashew-almond') {
    return 'https://kkfemwduwimomkalgzua.supabase.co/storage/v1/object/public/store/cashew.jpeg';
  }
  
  if (normId === 'rozana-urad-papad') {
    return 'https://kkfemwduwimomkalgzua.supabase.co/storage/v1/object/public/store/urad.jpeg';
  }
  
  if (normId === 'moong-dal') {
    return 'https://kkfemwduwimomkalgzua.supabase.co/storage/v1/object/public/store/moong.jpeg';
  }
  
  if (normId === 'toor-dal') {
    return 'https://kkfemwduwimomkalgzua.supabase.co/storage/v1/object/public/store/arahar.jpeg';
  }
  
  // Patanjali Products
  if (normId.includes('patanjali') || normId.includes('doodh')) {
    if (normId.includes('soap')) {
      return '/root-images/WhatsApp%20Image%202026-07-03%20at%2014,24,01%20(1)-1.jpeg';
    }
    if (normId.includes('doodh')) {
      return '/root-images/WhatsApp%20Image%202026-07-03%20at%2014,34,20%20(1)-1.jpeg';
    }
    return '/root-images/WhatsApp%20Image%202026-07-03%20at%2013,50,30-1.jpeg';
  }
  
  // Cooking Oils & Ghee
  if (normId.includes('oil') || normId.includes('mustard') || normId.includes('soyabean') || normId.includes('ghee') || normId.includes('kolhu') || normId.includes('groundnut')) {
    if (normId === 'fortune-groundnut') {
      return 'https://kkfemwduwimomkalgzua.supabase.co/storage/v1/object/public/store/fortune-groundnut.jpeg';
    }
    if (normId === 'fortune-mustard-pouch') {
      return 'https://kkfemwduwimomkalgzua.supabase.co/storage/v1/object/public/store/fortune-mustard-bottle.jpeg';
    }
    if (normId === 'bail-kolhu-oil') {
      return 'https://kkfemwduwimomkalgzua.supabase.co/storage/v1/object/public/store/bail-kolhu-oil.jpeg';
    }
    if (normId === 'ananda-ghee') {
      return 'https://kkfemwduwimomkalgzua.supabase.co/storage/v1/object/public/store/ananda-ghee.jpeg';
    }
    if (normId === 'kings-soyabean-oil') {
      return 'https://kkfemwduwimomkalgzua.supabase.co/storage/v1/object/public/store/kings-soyabean-oil.jpeg';
    }
    if (normId.includes('soyabean')) {
      return '/root-images/WhatsApp%20Image%202026-07-03%20at%2014,14,32%20(1)-1.jpeg';
    }
    if (normId.includes('groundnut')) {
      return '/root-images/WhatsApp%20Image%202026-07-03%20at%2014,34,17%20(1)-1.jpeg';
    }
    if (normId.includes('raag') || normId.includes('palmolein')) {
      return '/root-images/WhatsApp%20Image%202026-07-03%20at%2014,14,30-1.jpeg';
    }
    if (normId.includes('fortune') && normId.includes('mustard')) {
      if (normId.includes('pouch')) {
        return '/root-images/WhatsApp%20Image%202026-07-03%20at%2014,14,32-1.jpeg';
      }
      return '/root-images/WhatsApp%20Image%202026-07-03%20at%2013,59,14-1.jpeg';
    }
    if (normId.includes('saloni')) {
      return '/root-images/WhatsApp%20Image%202026-07-03%20at%2014,14,33-1.jpeg';
    }
    if (normId.includes('kolhu')) {
      return '/root-images/WhatsApp%20Image%202026-07-03%20at%2014,14,31%20(2)-1.jpeg';
    }
    if (normId.includes('kolhu') || normId.includes('mustard')) {
      return '/root-images/WhatsApp%20Image%202026-07-03%20at%2014.34.19.jpeg';
    }
    if (normId.includes('fortune')) {
      return '/root-images/WhatsApp%20Image%202026-07-03%20at%2014,34,17-1.jpeg';
    }
    if (normId.includes('namaste')) {
      return '/root-images/WhatsApp%20Image%202026-07-03%20at%2014,14,30%20(1)-1.jpeg';
    }
    if (normId.includes('ananda')) {
      return '/root-images/WhatsApp%20Image%202026-07-03%20at%2014,14,30%20(2)-1.jpeg';
    }
    if (normId.includes('ghee')) {
      return '/root-images/WhatsApp%20Image%202026-07-03%20at%2014.34.15.jpeg';
    }
    return '/root-images/WhatsApp%20Image%202026-07-03%20at%2014.34.18.jpeg';
  }

  // Biscuits & Cookies
  if (normId.includes('unibic') || normId.includes('cookies') || normId.includes('cashew') || normId.includes('oreo') || normId.includes('bounce') || normId.includes('bourbon') || normId.includes('magic') || normId.includes('parle-g') || normId.includes('parleg') || normId.includes('fantasy')) {
    if (normId.includes('unibic')) {
      return '/root-images/WhatsApp%20Image%202026-07-03%20at%2014,34,20%20(2)-1.jpeg';
    }
    if (normId === 'bounce-orange') {
      return '/root-images/WhatsApp%20Image%202026-07-03%20at%2014,34,19%20(1)-1.jpeg';
    }
    if (normId.includes('bounce')) {
      return '/root-images/WhatsApp%20Image%202026-07-03%20at%2014,34,21%20(1)-1.jpeg';
    }
    if (normId === 'parle-g') {
      return 'https://kkfemwduwimomkalgzua.supabase.co/storage/v1/object/public/store/parle-g.jpeg';
    }
    if (normId.includes('parle-g') || normId.includes('parleg') || normId.includes('parle')) {
      return '/root-images/WhatsApp%20Image%202026-07-03%20at%2013,50,38-1.jpeg';
    }
    if (normId === 'moms-magic-butter') {
      return 'https://kkfemwduwimomkalgzua.supabase.co/storage/v1/object/public/store/moms-magic-butter.jpeg';
    }
    if (normId.includes('magic')) {
      return '/root-images/WhatsApp%20Image%202026-07-03%20at%2013,50,36%20(3)-1.jpeg';
    }
    if (normId === 'britannia-bourbon') {
      return 'https://kkfemwduwimomkalgzua.supabase.co/storage/v1/object/public/store/britannia-bourbon.jpeg';
    }
    if (normId.includes('bourbon')) {
      return '/root-images/WhatsApp%20Image%202026-07-03%20at%2013,50,30%20(1)-1.jpeg';
    }
    if (normId === 'good-day-cashew') {
      return 'https://kkfemwduwimomkalgzua.supabase.co/storage/v1/object/public/store/good-day-cashew.jpeg';
    }
    if (normId.includes('cashew') || normId.includes('good-day')) {
      return '/root-images/WhatsApp%20Image%202026-07-03%20at%2013,50,39-1.jpeg';
    }
    if (normId === 'dark-fantasy-fills') {
      return 'https://kkfemwduwimomkalgzua.supabase.co/storage/v1/object/public/store/dark-fantasy-fills.jpeg';
    }
    if (normId.includes('fantasy')) {
      return '/root-images/WhatsApp%20Image%202026-07-03%20at%2013.50.29.jpeg';
    }
    if (normId === 'oreo-choco') {
      return 'https://kkfemwduwimomkalgzua.supabase.co/storage/v1/object/public/store/oreo-choco.jpeg';
    }
    if (normId.includes('oreo')) {
      return '/root-images/WhatsApp%20Image%202026-07-03%20at%2013,50,38%20(3)-1.jpeg';
    }
    return '/root-images/WhatsApp%20Image%202026-07-03%20at%2013.50.31.jpeg';
  }

  // Noodles & Snacks
  if (normId.includes('noodles') || normId.includes('maggi') || normId.includes('yippee') || normId.includes('kurkure') || normId.includes('tedhe-medhe') || normId.includes('snack') || normId.includes('peanut') || normId.includes('cracker') || normId.includes('khatta')) {
    if (normId.includes('yippee') && normId.includes('4pack')) {
      return '/root-images/WhatsApp%20Image%202026-07-03%20at%2014,34,17%20(2)-1.jpeg';
    }
    if (normId.includes('yippee')) {
      return '/root-images/WhatsApp%20Image%202026-07-03%20at%2014,34,17%20(1)-1.jpeg';
    }
    if (normId.includes('maggi')) {
      return '/root-images/WhatsApp%20Image%202026-07-03%20at%2014,34,18-1.jpeg';
    }
    if (normId.includes('noodles')) {
      return '/root-images/WhatsApp%20Image%202026-07-03%20at%2014.14.33.jpeg';
    }
    if (normId === 'kurkure-masala') {
      return 'https://kkfemwduwimomkalgzua.supabase.co/storage/v1/object/public/store/kings-soyabean-oil.jpeg';
    }
    if (normId === 'bingo-tedhe-medhe') {
      return 'https://kkfemwduwimomkalgzua.supabase.co/storage/v1/object/public/store/bingo-tedhe-medhe.jpeg';
    }
    if (normId.includes('kurkure')) {
      return '/root-images/WhatsApp%20Image%202026-07-03%20at%2014,34,15%20(1)-1.jpeg';
    }
    if (normId.includes('tedhe-medhe')) {
      return '/root-images/WhatsApp%20Image%202026-07-03%20at%2014,34,15-1.jpeg';
    }
    if (normId === 'haldiram-khatta-meetha') {
      return 'https://kkfemwduwimomkalgzua.supabase.co/storage/v1/object/public/store/haldiram-khatta-meetha.jpeg';
    }
    if (normId === 'haldiram-peanuts') {
      return 'https://kkfemwduwimomkalgzua.supabase.co/storage/v1/object/public/store/haldiram-peanuts.jpeg';
    }
    if (normId === 'haldiram-nut-cracker') {
      return 'https://kkfemwduwimomkalgzua.supabase.co/storage/v1/object/public/store/haldiram-nut-cracker.jpeg';
    }
    if (normId.includes('peanut')) {
      return '/root-images/WhatsApp%20Image%202026-07-03%20at%2014,34,16%20(1)-1.jpeg';
    }
    if (normId.includes('cracker')) {
      return '/root-images/WhatsApp%20Image%202026-07-03%20at%2014,34,16-1.jpeg';
    }
    if (normId.includes('khatta')) {
      return '/root-images/WhatsApp%20Image%202026-07-03%20at%2014,34,17-1.jpeg';
    }
    return '/root-images/WhatsApp%20Image%202026-07-03%20at%2014.14.32.jpeg';
  }

  // Staples, Spices, Dals, Salts, Sugar
  if (normId.includes('clove') || normId.includes('sugar') || normId.includes('mishri') || normId.includes('salt') || normId.includes('dal') || normId.includes('toor') || normId.includes('moong') || normId.includes('chana') || normId.includes('papad')) {
    if (normId.includes('toor')) {
      return '/root-images/WhatsApp%20Image%202026-07-03%20at%2013,58,54-1.jpeg';
    }
    if (normId.includes('moong')) {
      return '/root-images/WhatsApp%20Image%202026-07-03%20at%2013,58,17-1.jpeg';
    }
    if (normId === 'chana-dal') {
      return 'https://kkfemwduwimomkalgzua.supabase.co/storage/v1/object/public/store/chana-dal.jpeg';
    }
    if (normId.includes('chana')) {
      return '/root-images/WhatsApp%20Image%202026-07-03%20at%2013,57,36-1.jpeg';
    }
    if (normId === 'premium-cloves') {
      return 'https://kkfemwduwimomkalgzua.supabase.co/storage/v1/object/public/store/premium-cloves.jpeg';
    }
    if (normId.includes('clove')) {
      return '/root-images/WhatsApp%20Image%202026-07-03%20at%2013,50,33-1.jpeg';
    }
    if (normId.includes('urad')) {
      return '/root-images/WhatsApp%20Image%202026-07-03%20at%2014,34,18%20(2)-1.jpeg';
    }
    if (normId.includes('rice') || normId.includes('zhakaas')) {
      return '/root-images/WhatsApp%20Image%202026-07-03%20at%2014,34,19%20(1)-1.jpeg';
    }
    if (normId.includes('sabudana')) {
      return '/root-images/WhatsApp%20Image%202026-07-03%20at%2014,34,19-1.jpeg';
    }
    if (normId === 'mothers-potato-papad') {
      return 'https://kkfemwduwimomkalgzua.supabase.co/storage/v1/object/public/store/mothers-potato-papad.jpeg';
    }
    if (normId.includes('papad')) {
      return '/root-images/WhatsApp%20Image%202026-07-03%20at%2014,34,18%20(1)-1.jpeg';
    }
    if (normId === 'kings-mishri') {
      return 'https://kkfemwduwimomkalgzua.supabase.co/storage/v1/object/public/store/kings-mishri.jpeg';
    }
    if (normId.includes('mishri')) {
      return '/root-images/WhatsApp%20Image%202026-07-03%20at%2014,14,29-1.jpeg';
    }
    if (normId === 'pure-sugar') {
      return 'https://kkfemwduwimomkalgzua.supabase.co/storage/v1/object/public/store/pure-sugar.jpeg';
    }
    if (normId.includes('sugar')) {
      return '/root-images/WhatsApp%20Image%202026-07-03%20at%2014,14,31%20(1)-1.jpeg';
    }
    if (normId === 'catch-black-salt') {
      return 'https://kkfemwduwimomkalgzua.supabase.co/storage/v1/object/public/store/catch-black-salt.jpeg';
    }
    if (normId === 'tata-salt') {
      return 'https://kkfemwduwimomkalgzua.supabase.co/storage/v1/object/public/store/WhatsApp%20Image%202026-07-03%20at%2013.59.32.jpeg';
    }
    if (normId.includes('catch') || normId.includes('black-salt')) {
      return '/root-images/WhatsApp%20Image%202026-07-03%20at%2014,14,31-1.jpeg';
    }
    if (normId.includes('salt') || normId.includes('tata')) {
      return '/root-images/WhatsApp%20Image%202026-07-03%20at%2013,59,32-1.jpeg';
    }
    return '/root-images/WhatsApp%20Image%202026-07-03%20at%2013.50.33.jpeg';
  }

  // Toothbrush / Personal Care
  if (normId.includes('toothbrush') || normId.includes('anchor')) {
    return 'https://kkfemwduwimomkalgzua.supabase.co/storage/v1/object/public/store/WhatsApp%20Image%202026-07-03%20at%2013.50.30%20(2).jpeg';
  }

  // Detergent / Cleaners
  if (normId.includes('detergent') || normId.includes('dive') || normId.includes('surf') || normId.includes('excel') || normId.includes('rin') || normId.includes('wheel') || normId.includes('nirma') || normId.includes('ghadi') || normId.includes('vanya')) {
    if (normId.includes('vanya')) {
      return '/root-images/WhatsApp%20Image%202026-07-03%20at%2014,24,04-1.jpeg';
    }
    if (normId.includes('surf') && normId.includes('bar')) {
      return '/root-images/WhatsApp%20Image%202026-07-03%20at%2014,24,01-1.jpeg';
    }
    if (normId.includes('surf') && (normId.includes('sachet') || normId.includes('easywash'))) {
      return '/root-images/WhatsApp%20Image%202026-07-03%20at%2014,24,03%20(1)-1.jpeg';
    }
    if (normId.includes('rin') && normId.includes('bar')) {
      return '/root-images/WhatsApp%20Image%202026-07-03%20at%2014,24,02%20(1)-1.jpeg';
    }
    if (normId.includes('rin') && normId.includes('powder')) {
      return '/root-images/WhatsApp%20Image%202026-07-03%20at%2014,24,02%20(3)-1.jpeg';
    }
    if (normId.includes('ghadi')) {
      return '/root-images/WhatsApp%20Image%202026-07-03%20at%2014,24,02-1.jpeg';
    }
    if (normId.includes('wheel')) {
      return '/root-images/WhatsApp%20Image%202026-07-03%20at%2014,24,04%20(1)-1.jpeg';
    }
    if (normId.includes('nirma')) {
      return '/root-images/WhatsApp%20Image%202026-07-03%20at%2014,24,02%20(2)-1.jpeg';
    }
    return '/root-images/WhatsApp%20Image%202026-07-03%20at%2013,50,31-1.jpeg';
  }

  // Soya Chunks
  if (normId.includes('soya')) {
    return '/root-images/WhatsApp%20Image%202026-07-03%20at%2013,50,35-1.jpeg';
  }

  // Fallback
  return '/root-images/WhatsApp%20Image%202026-07-03%20at%2014.34.21.jpeg';
}

interface ProductIllustrationProps {
  product: Product;
}

export default function ProductIllustration({ product }: ProductIllustrationProps) {
  // Return a rich, photorealistic designed scene with props and package elements based on the PDF screenshots.
  const element = (() => {
    switch (product.id) {
    case 'good-day-cashew':
      return (
        <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 p-2 flex flex-col justify-between shadow-inner">
          {/* Studio lighting/highlights */}
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/20 rounded-full blur-xl pointer-events-none"></div>
          <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-amber-800/40 rounded-full blur-lg pointer-events-none"></div>
          
          {/* Scattered cashew props in background with depth */}
          <div className="absolute top-2 right-4 text-xs opacity-75 select-none drop-shadow">🥜</div>
          <div className="absolute bottom-3 left-6 text-[10px] opacity-60 rotate-45 select-none">🥜</div>
          
          {/* Brand header */}
          <div className="flex justify-between items-start z-10">
            <span className="text-[7px] font-black tracking-widest text-white/90 bg-amber-700/40 px-1 py-0.5 rounded-sm uppercase">BRITANNIA</span>
            <div className="w-3 h-3 border border-emerald-600 flex justify-center items-center bg-white p-0.5 rounded shadow-sm">
              <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
            </div>
          </div>

          {/* Biscuit details and realistic cookie vector */}
          <div className="flex justify-between items-center z-10">
            <div className="text-left select-none">
              <div className="text-[15px] font-black tracking-tighter text-white leading-none italic drop-shadow-md">Good<br />Day</div>
              <div className="text-[7px] font-black tracking-wider text-yellow-200 mt-0.5 drop-shadow-sm uppercase">CASHEW COOKIES</div>
              <div className="text-[5px] text-amber-100 uppercase opacity-95">Rich Butter Taste</div>
            </div>

            {/* Glossy biscuit visual */}
            <div className="relative shrink-0">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-100 to-amber-200 border-4 border-amber-300 rounded-full flex justify-center items-center shadow-lg relative transform rotate-12">
                {/* Spiral cookie grooves */}
                <div className="absolute inset-1 border border-dashed border-amber-400 rounded-full"></div>
                <div className="absolute inset-2 border-2 border-amber-300 rounded-full"></div>
                {/* Scattered cashew bits on biscuit */}
                <div className="w-2 h-1 bg-amber-300 rounded-full absolute top-2 left-3 rotate-45"></div>
                <div className="w-1.5 h-1 bg-amber-400 rounded-full absolute bottom-3 right-3 -rotate-12"></div>
                <span className="text-[10px] z-10 drop-shadow-sm">🍪</span>
              </div>
              {/* Floating realistic cashews adjacent */}
              <div className="absolute -bottom-1 -left-2 text-[10px] filter drop-shadow">🥜</div>
            </div>
          </div>

          {/* Special price card exactly like in the PDF page 1 */}
          <div className="flex justify-between items-center mt-1 pt-1 border-t border-white/10 z-10">
            <span className="text-[6px] text-amber-100 uppercase font-bold tracking-tight">Zero Trans Fat</span>
            <span className="text-[8px] font-black text-yellow-300 bg-amber-900/40 px-1 rounded">Rs. 10</span>
          </div>
        </div>
      );

    case 'oreo-choco':
      return (
        <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-tr from-blue-900 via-blue-700 to-sky-500 p-2 flex flex-col justify-between shadow-inner">
          {/* Milk Splash Layer in Background */}
          <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-white/30 to-transparent blur-sm pointer-events-none"></div>
          <div className="absolute bottom-2 right-2 w-10 h-10 bg-white/40 rounded-full blur-xl pointer-events-none"></div>
          
          <div className="flex justify-between items-start z-10">
            <span className="text-[7px] font-black tracking-widest text-blue-100 bg-blue-900/40 px-1 py-0.5 rounded-sm uppercase">CADBURY</span>
            <div className="w-3 h-3 border border-emerald-600 flex justify-center items-center bg-white p-0.5 rounded shadow-sm">
              <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
            </div>
          </div>

          <div className="flex justify-between items-center z-10">
            <div className="text-left select-none">
              <div className="text-xl font-black tracking-tighter text-white italic drop-shadow-md">OREO</div>
              <div className="text-[6px] font-bold bg-blue-950 text-sky-200 px-1 py-0.5 rounded inline-block uppercase mt-0.5 tracking-tight">Choco Crème</div>
            </div>

            {/* Oreo Sandwich cookie with chocolate filling oozing out */}
            <div className="relative shrink-0">
              {/* Milk splash backing */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-white/20 to-transparent rounded-full blur-sm"></div>
              <div className="w-14 h-14 bg-neutral-900 border-2 border-neutral-800 rounded-full flex justify-center items-center shadow-lg relative shrink-0">
                {/* Choco stuffing layer visual */}
                <div className="absolute inset-1 border border-neutral-700 rounded-full flex justify-center items-center">
                  <div className="w-10 h-10 bg-neutral-950 rounded-full flex justify-center items-center relative">
                    <div className="w-6 h-6 bg-amber-950 border border-amber-900 rounded-full"></div>
                  </div>
                </div>
                {/* Oreo grid pattern */}
                <div className="absolute inset-2 border-2 border-dashed border-neutral-800 rounded-full"></div>
                <span className="text-[12px] z-10 drop-shadow-md select-none">🍪</span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-1 pt-1 border-t border-white/10 z-10">
            <span className="text-[6px] text-blue-100 uppercase italic font-bold">Suggest dunking in milk</span>
            <span className="text-[8px] font-black text-yellow-300 bg-blue-950/50 px-1 rounded">Rs. 10</span>
          </div>
        </div>
      );

    case 'bounce-choco':
      return (
        <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-tr from-[#3d1a08] via-[#542d18] to-[#804f33] p-2 flex flex-col justify-between shadow-inner">
          {/* Swirling chocolate loops background */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-700/10 via-transparent to-transparent"></div>
          <div className="absolute bottom-1 right-2 text-xs opacity-70">⚽</div>
          
          <div className="flex justify-between items-start z-10">
            <span className="text-[7px] font-black tracking-widest text-[#dfb59e] bg-[#221006] px-1 py-0.5 rounded-sm uppercase">SUNFEAST</span>
            <div className="w-3 h-3 border border-emerald-600 flex justify-center items-center bg-white p-0.5 rounded shadow-sm">
              <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
            </div>
          </div>

          <div className="flex justify-between items-center z-10">
            <div className="text-left">
              <div className="text-lg font-black tracking-tighter text-white italic drop-shadow-md leading-none">bounce</div>
              <div className="text-[6px] font-extrabold bg-[#2a1204] text-amber-300 px-1 py-0.5 rounded inline-block uppercase mt-1">Choco Crème</div>
            </div>

            {/* Chocolate Soccer Ball shaped Cookie */}
            <div className="w-13 h-13 bg-amber-950 border-2 border-amber-900 rounded-full flex justify-center items-center shadow-lg relative transform rotate-45 shrink-0">
              <div className="absolute inset-1 border border-amber-800 rounded-full"></div>
              {/* Soccer ball lines */}
              <div className="w-8 h-8 border border-dashed border-amber-700 rounded-full flex justify-center items-center">
                <div className="w-4 h-4 bg-[#2a1204] rounded-sm rotate-45"></div>
              </div>
              <span className="text-[9px] z-10 drop-shadow-md">🍫</span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-1 pt-1 border-t border-white/10 z-10">
            <span className="text-[6px] text-amber-200 font-bold">Glucose with Added Cocoa</span>
            <span className="text-[8px] font-black text-yellow-300 bg-amber-950 px-1 rounded">Rs. 10</span>
          </div>
        </div>
      );

    case 'bounce-orange':
      return (
        <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 p-2 flex flex-col justify-between shadow-inner">
          <div className="absolute -top-6 -right-6 w-16 h-16 bg-white/10 rounded-full blur-md"></div>
          <div className="absolute bottom-2 left-4 text-xs opacity-80">🌾</div>

          <div className="flex justify-between items-start z-10">
            <span className="text-[7px] font-black tracking-widest text-amber-100 bg-amber-700/50 px-1 py-0.5 rounded-sm uppercase">DESI</span>
            <div className="w-3 h-3 border border-emerald-600 flex justify-center items-center bg-white p-0.5 rounded shadow-sm">
              <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
            </div>
          </div>

          <div className="flex justify-between items-center z-10">
            <div className="text-left">
              <div className="text-lg font-black tracking-tighter text-white italic leading-none drop-shadow-md">Chawal</div>
              <div className="text-[6px] font-extrabold bg-amber-800 text-yellow-300 px-1 py-0.5 rounded inline-block uppercase mt-1">Premium Rice</div>
            </div>

            {/* Rice Bowl Icon */}
            <div className="w-13 h-13 bg-amber-50 border-2 border-amber-200 rounded-full flex justify-center items-center shadow-lg relative shrink-0">
              <div className="absolute inset-1 border border-dashed border-amber-100 rounded-full"></div>
              <span className="text-[12px] z-10">🍚</span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-1 pt-1 border-t border-white/10 z-10">
            <span className="text-[6px] text-amber-100 font-bold">Aromatic Indian Rice</span>
            <span className="text-[8px] font-black text-white bg-amber-800 px-1 rounded">₹{product.price}</span>
          </div>
        </div>
      );

    case 'parle-g':
      return (
        <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-r from-[#ffe7a3] via-white to-[#ffe7a3] p-2 flex flex-col justify-between border-r-8 border-emerald-700 shadow-md">
          {/* Classic yellow/white stripes */}
          <div className="absolute inset-0 opacity-15 bg-[repeating-linear-gradient(45deg,_#f1a92a,_#f1a92a_10px,_transparent_10px,_transparent_20px)] pointer-events-none"></div>
          
          <div className="flex justify-between items-start z-10">
            <span className="text-[8px] font-black tracking-widest text-red-600 uppercase">PARLE</span>
            <div className="w-3 h-3 border border-emerald-600 flex justify-center items-center bg-white p-0.5 rounded shadow-sm">
              <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
            </div>
          </div>

          <div className="flex justify-between items-center z-10">
            <div className="text-left">
              <div className="text-xl font-black text-red-600 tracking-tighter leading-none drop-shadow-sm">Parle-G</div>
              <div className="text-[6px] text-green-800 font-bold uppercase mt-1">Original Gluco</div>
            </div>

            {/* Iconic retro biscuit packaging shape */}
            <div className="w-13 h-10 bg-amber-100 border-2 border-amber-300 rounded shadow-inner flex flex-col justify-center items-center shrink-0 relative transform rotate-3">
              <div className="text-[6px] font-black text-amber-700 tracking-tight">PARLE-G</div>
              <div className="w-9 h-0.5 bg-amber-300 my-0.5"></div>
              <span className="text-[4px] text-amber-500 font-extrabold">★ ★ ★ ★ ★</span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-1 pt-1 border-t border-amber-200 z-10">
            <span className="text-[6px] text-slate-600 italic font-medium">India's G for Genius</span>
            <span className="text-[8px] font-black text-white bg-red-600 px-1.5 py-0.2 rounded shadow">Rs. 10</span>
          </div>
        </div>
      );

    case 'moms-magic-butter':
      return (
        <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-tr from-red-950 via-red-850 to-red-750 p-2 flex flex-col justify-between shadow-inner">
          {/* Gold ribbon designs in background */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-yellow-300/10 to-transparent rounded-full blur-lg"></div>
          <div className="absolute bottom-1 left-2 text-[10px] opacity-75">🧈</div>

          <div className="flex justify-between items-start z-10">
            <span className="text-[7px] font-black tracking-widest text-red-200 bg-red-950/40 px-1 py-0.5 rounded-sm uppercase">SUNFEAST</span>
            <div className="w-3 h-3 border border-emerald-600 flex justify-center items-center bg-white p-0.5 rounded shadow-sm">
              <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
            </div>
          </div>

          <div className="flex justify-between items-center z-10">
            <div className="text-left">
              <div className="text-sm font-black tracking-tight leading-none text-white uppercase drop-shadow-md">MOM'S</div>
              <div className="text-sm font-black tracking-tight leading-none text-yellow-300 uppercase drop-shadow-sm">MAGIC</div>
              <div className="text-[6px] font-semibold text-yellow-100 uppercase mt-1">Butter Cookies</div>
            </div>

            {/* Heart visual cookie */}
            <div className="w-12 h-12 bg-amber-100 border-2 border-yellow-300 rounded-full flex justify-center items-center shadow-lg relative shrink-0">
              <div className="w-8 h-8 border border-dashed border-yellow-400 rounded-full flex justify-center items-center text-red-600 text-[10px] font-bold">♥</div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-1 pt-1 border-t border-white/10 z-10">
            <span className="text-[6px] text-red-100 font-bold">Prepared with Cow Butter</span>
            <span className="text-[8px] font-black text-yellow-300 bg-red-955 px-1 rounded">Rs. 10</span>
          </div>
        </div>
      );

    case 'dark-fantasy-fills':
      return (
        <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-tr from-stone-950 via-neutral-900 to-stone-850 p-2 flex flex-col justify-between shadow-inner border border-neutral-800">
          {/* Crimson liquid spiral layer */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-red-600/20 via-transparent to-transparent"></div>
          <div className="absolute top-2 right-2 text-xs">✨</div>

          <div className="flex justify-between items-start z-10">
            <span className="text-[7px] font-black tracking-widest text-yellow-500 bg-black/60 px-1 py-0.5 rounded-sm uppercase">SUNFEAST</span>
            <div className="w-3 h-3 border border-emerald-600 flex justify-center items-center bg-white p-0.5 rounded shadow-sm">
              <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
            </div>
          </div>

          <div className="flex justify-between items-center z-10">
            <div className="text-left">
              <div className="text-xs font-black tracking-widest text-white leading-none uppercase">Dark Fantasy</div>
              <div className="text-[10px] font-extrabold text-yellow-400 mt-1 leading-none">Choco Fills</div>
              <div className="text-[5px] text-stone-400 uppercase tracking-wider mt-0.5">Original Filled Cookie</div>
            </div>

            {/* Molten choco core cookie */}
            <div className="relative w-13 h-13 bg-[#3d2414] border border-[#23140b] rounded-full flex justify-center items-center shadow-lg shrink-0">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-3 bg-stone-950 rounded-full"></div>
              <div className="absolute top-1/3 left-1/3 w-3 h-3 bg-red-600 rounded-full animate-pulse opacity-40 blur-sm"></div>
              <span className="text-[11px] z-10 select-none">🍪</span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-1 pt-1 border-t border-white/10 z-10">
            <span className="text-[6px] text-yellow-500 font-extrabold italic uppercase tracking-wider">Pure Indulgence</span>
            <span className="text-[8px] font-black text-yellow-300 bg-black/40 px-1 rounded">Rs. 10</span>
          </div>
        </div>
      );

    case 'maggi-noodles':
      return (
        <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-tr from-yellow-500 via-yellow-400 to-amber-300 p-2 flex flex-col justify-between shadow-inner">
          <div className="absolute -bottom-10 -right-10 w-28 h-28 bg-red-600/10 rounded-full blur-xl pointer-events-none"></div>
          
          <div className="flex justify-between items-start z-10">
            <div className="bg-red-600 text-white text-[9px] font-black px-1 rounded shadow uppercase tracking-tighter">Maggi</div>
            <div className="w-3 h-3 border border-emerald-600 flex justify-center items-center bg-white p-0.5 rounded shadow-sm">
              <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
            </div>
          </div>

          <div className="flex justify-between items-center z-10">
            <div className="text-left">
              <div className="text-[15px] font-extrabold tracking-tight text-red-700 uppercase leading-none">2-Minute</div>
              <div className="text-[9px] font-black text-slate-800 leading-none">Noodles</div>
              <div className="text-[6px] font-bold text-red-600 bg-yellow-100 px-1 py-0.2 rounded inline-block mt-1">Masala Taste</div>
            </div>

            {/* Steaming noodle bowl */}
            <div className="relative w-13 h-13 shrink-0">
              <div className="absolute inset-0 bg-red-600 rounded-full border-2 border-red-700 shadow-md flex justify-center items-center">
                <div className="w-11 h-11 bg-amber-100 border border-amber-300 rounded-full flex justify-center items-center overflow-hidden relative">
                  <span className="text-[16px] leading-none text-amber-500 select-none">🍜</span>
                </div>
              </div>
              {/* Steaming rising blobs */}
              <div className="absolute -top-1 left-3 w-4 h-2 bg-white/40 rounded-full blur-sm animate-pulse"></div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-1 pt-1 border-t border-slate-700/10 z-10">
            <span className="text-[6px] text-slate-800 font-bold">Iron-Fortified Health</span>
            <span className="text-[8px] font-black text-white bg-red-600 px-1.5 py-0.2 rounded shadow">Rs. 10</span>
          </div>
        </div>
      );

    case 'tata-salt':
      return (
        <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-tr from-orange-500 via-orange-400 to-amber-300 p-2 flex flex-col justify-between shadow-inner">
          {/* Replicating Page 47 kitchen background with hanging ladles */}
          <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(0,0,0,0.1)_1px,_transparent_1px)] bg-[size:100%_8px] pointer-events-none"></div>
          
          <div className="flex justify-between items-start z-10">
            <span className="text-[7px] font-extrabold tracking-widest text-orange-900 uppercase">Iodised Salt</span>
            <div className="w-3 h-3 border border-emerald-600 flex justify-center items-center bg-white p-0.5 rounded shadow-sm">
              <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
            </div>
          </div>

          <div className="flex justify-between items-center z-10">
            <div className="text-left">
              <div className="text-2xl font-black tracking-tight leading-none text-white drop-shadow">TATA</div>
              <div className="text-lg font-bold text-blue-900 leading-none">Salt</div>
            </div>

            {/* Salt shaker packet details */}
            <div className="w-10 h-12 bg-white/20 border border-white/30 rounded shadow-inner flex flex-col justify-between p-1 shrink-0">
              <div className="flex justify-around">
                <div className="w-1 h-1 bg-white rounded-full"></div>
                <div className="w-1 h-1 bg-white rounded-full"></div>
              </div>
              <span className="text-[5px] text-center font-bold text-white uppercase tracking-tighter">VACUUMED</span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-1 pt-1 border-t border-white/20 z-10">
            <span className="text-[6px] text-orange-950 font-bold uppercase tracking-tight">Vacuum Evaporated</span>
            <span className="text-[8px] font-black text-white bg-blue-900 px-1.5 rounded">Rs. 28</span>
          </div>
        </div>
      );

    case 'ananda-ghee':
    case 'namaste-india-ghee':
      return (
        <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-tr from-amber-500 via-yellow-500 to-amber-300 p-2 flex flex-col justify-between shadow-inner">
          {/* Pasture grass fields silhouette */}
          <div className="absolute bottom-0 inset-x-0 h-8 bg-emerald-800/10 rounded-t-xl"></div>
          
          <div className="flex justify-between items-start z-10">
            <span className="text-[7px] font-black tracking-widest text-yellow-950 bg-amber-700/30 px-1 py-0.5 rounded-sm uppercase">100% PURE DESI</span>
            <div className="w-3 h-3 border border-emerald-600 flex justify-center items-center bg-white p-0.5 rounded shadow-sm">
              <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
            </div>
          </div>

          <div className="flex justify-between items-center z-10">
            <div className="text-left">
              <div className="text-xs font-black tracking-tight text-yellow-950 uppercase leading-none">{product.brand}</div>
              <div className="text-lg font-black text-amber-900 leading-none">GHEE</div>
              <div className="text-[6px] text-amber-800 bg-yellow-100 px-1 rounded inline-block mt-1">Cow Special</div>
            </div>

            {/* Brass Ghee Urn visual representation */}
            <div className="w-12 h-12 bg-yellow-100 border-2 border-yellow-300 rounded-full flex justify-center items-center shadow-lg shrink-0">
              <span className="text-[15px]">🧈</span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-1 pt-1 border-t border-yellow-600/10 z-10">
            <span className="text-[6px] text-yellow-900 font-bold uppercase">Agmark Special Grade</span>
            <span className="text-[8px] font-black text-white bg-amber-800 px-1 rounded">₹{product.price}</span>
          </div>
        </div>
      );

    case 'surf-excel-easywash':
    case 'surf-excel-sachet':
      return (
        <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-tr from-blue-700 via-blue-600 to-sky-400 p-2 flex flex-col justify-between shadow-inner">
          {/* Flying laundry bubbles */}
          <div className="absolute top-2 right-4 w-3 h-3 bg-white/20 border border-white/40 rounded-full"></div>
          <div className="absolute bottom-3 left-6 w-2 h-2 bg-white/30 border border-white/40 rounded-full"></div>
          
          <div className="flex justify-between items-start z-10">
            <span className="text-[7px] font-black bg-red-600 text-white px-1 rounded uppercase tracking-wider">NEW</span>
            <div className="w-3 h-3 border border-emerald-600 flex justify-center items-center bg-white p-0.5 rounded shadow-sm">
              <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
            </div>
          </div>

          <div className="flex justify-between items-center z-10">
            <div className="text-left select-none">
              <div className="text-xl font-black tracking-tighter text-white italic leading-none">Surf</div>
              <div className="text-lg font-extrabold tracking-tighter text-sky-200 italic leading-none">excel</div>
              <div className="text-[6px] text-yellow-300 uppercase font-black mt-1">Easy Wash</div>
            </div>

            {/* Multi color splash badge */}
            <div className="w-12 h-12 bg-orange-500 rounded-full flex justify-center items-center shadow-md border-2 border-white shrink-0">
              <span className="text-white text-[12px] font-black">⚡</span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-1 pt-1 border-t border-white/10 z-10">
            <span className="text-[6px] text-blue-100 font-bold uppercase tracking-tight">Removes Tough Stains</span>
            <span className="text-[8px] font-black text-yellow-300 bg-blue-900/40 px-1 rounded">Rs. 10</span>
          </div>
        </div>
      );

    case 'dive-detergent':
      return (
        <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-tr from-indigo-700 via-indigo-600 to-purple-500 p-2 flex flex-col justify-between shadow-inner">
          {/* Replicating the modern laundry countertop with cotton towels (Page 24, 60) */}
          <div className="absolute bottom-0 inset-x-0 h-10 bg-slate-100 flex items-center justify-around px-1 overflow-hidden pointer-events-none">
            {/* Tiny towels representation */}
            <div className="w-6 h-5 bg-sky-400 rounded-t shadow-sm"></div>
            <div className="w-6 h-5 bg-orange-400 rounded-t shadow-sm"></div>
            <div className="w-6 h-5 bg-neutral-200 rounded-t shadow-sm"></div>
          </div>

          <div className="flex justify-between items-start z-10">
            <span className="text-[7px] font-black text-indigo-100 uppercase tracking-widest bg-indigo-900/30 px-1 rounded">TRUSTED CHOICE</span>
            <div className="w-3 h-3 border border-emerald-600 flex justify-center items-center bg-white p-0.5 rounded shadow-sm">
              <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
            </div>
          </div>

          <div className="flex justify-between items-center z-10">
            <div className="text-left">
              <div className="text-xl font-black tracking-tight text-white italic leading-none drop-shadow">Dive<span className="text-yellow-300">+</span></div>
              <div className="text-[6px] text-purple-200 uppercase font-black tracking-wide mt-1 inline-block bg-purple-950 px-1 rounded">Active Detergent</div>
            </div>

            {/* White clean shirt bubble prop */}
            <div className="w-11 h-11 bg-white/20 border border-white/30 rounded-full flex justify-center items-center shrink-0">
              <span className="text-[13px]">👕</span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-1 pt-1 border-t border-white/10 z-10">
            <span className="text-[6px] text-indigo-100 font-bold uppercase">Stain Removal Specialist</span>
            <span className="text-[8px] font-black text-yellow-300 bg-indigo-950 px-1.5 rounded">₹{product.price}</span>
          </div>
        </div>
      );

    case 'soya-chunks':
      return (
        <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-tr from-emerald-800 via-emerald-700 to-teal-500 p-2 flex flex-col justify-between shadow-inner">
          {/* Soya field/leaves graphic */}
          <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-full blur-md"></div>
          <div className="absolute bottom-2 left-4 text-xs opacity-80">🌱</div>

          <div className="flex justify-between items-start z-10">
            <span className="text-[7px] font-black text-yellow-300 uppercase tracking-wider bg-emerald-900/40 px-1 rounded">HIGH PROTEIN</span>
            <div className="w-3 h-3 border border-emerald-600 flex justify-center items-center bg-white p-0.5 rounded shadow-sm">
              <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
            </div>
          </div>

          <div className="flex justify-between items-center z-10">
            <div className="text-left">
              <div className="text-sm font-black tracking-tight leading-none text-white uppercase drop-shadow">Soya</div>
              <div className="text-sm font-black tracking-tight leading-none text-yellow-200 uppercase mt-0.5">Chunks</div>
            </div>

            {/* Soya chunks bowl */}
            <div className="w-12 h-12 bg-amber-100 border border-amber-300 rounded-full flex justify-center items-center shadow-lg shrink-0">
              <span className="text-[13px]">🧆</span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-1 pt-1 border-t border-white/10 z-10">
            <span className="text-[6px] text-emerald-100 font-bold">100% Vegetarian Nutrition</span>
            <span className="text-[8px] font-black text-white bg-emerald-950 px-1.5 rounded">₹{product.price}</span>
          </div>
        </div>
      );

    case 'toor-dal':
    case 'moong-dal':
    case 'chana-dal':
      return (
        <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-tr from-amber-200 via-amber-100 to-yellow-50 p-2 flex flex-col justify-between border border-amber-300 shadow-inner">
          {/* Gunny/burlap textured background styling */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#b45309_1px,_transparent_1px)] bg-[size:6px_6px] pointer-events-none"></div>

          <div className="flex justify-between items-start z-10">
            <span className="text-[7px] font-black text-amber-900 uppercase bg-amber-200 px-1 rounded">{product.brand}</span>
            <div className="w-3 h-3 border border-emerald-600 flex justify-center items-center bg-white p-0.5 rounded shadow-sm">
              <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
            </div>
          </div>

          <div className="flex justify-between items-center z-10">
            <div className="text-left">
              <div className="text-xs font-black text-amber-950 uppercase leading-none drop-shadow-sm">{product.name.split(' ').slice(-2).join(' ')}</div>
              <div className="text-[5px] text-amber-700 uppercase font-black mt-1">Premium Staples</div>
            </div>

            {/* Dal sack/scoop visual */}
            <div className="w-12 h-12 bg-yellow-400 border border-yellow-500 rounded-full flex justify-center items-center shadow-lg shrink-0">
              <span className="text-[14px]">🌾</span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-1 pt-1 border-t border-amber-300/20 z-10">
            <span className="text-[6px] text-amber-800 font-extrabold italic uppercase tracking-tight">100% Unpolished</span>
            <span className="text-[8px] font-black text-white bg-amber-800 px-1.5 rounded shadow">₹{product.price}</span>
          </div>
        </div>
      );

    case 'unibic-cashew-almond':
      return (
        <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-tr from-amber-700 via-amber-600 to-yellow-500 p-2 flex flex-col justify-between shadow-inner">
          <div className="absolute -top-6 -left-6 w-16 h-16 bg-white/10 rounded-full blur-md"></div>
          <div className="absolute bottom-2 right-2 text-xs opacity-70">🥜</div>

          <div className="flex justify-between items-start z-10">
            <span className="text-[7px] font-black text-amber-100 bg-amber-900/40 px-1 py-0.5 rounded uppercase">UNIBIC</span>
            <div className="w-3 h-3 border border-emerald-600 flex justify-center items-center bg-white p-0.5 rounded shadow-sm">
              <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
            </div>
          </div>

          <div className="flex justify-between items-center z-10">
            <div className="text-left">
              <div className="text-xs font-black text-white leading-none uppercase">Cashew</div>
              <div className="text-xs font-black text-yellow-300 leading-none uppercase mt-0.5">Almond</div>
              <div className="text-[5px] text-yellow-100 uppercase mt-1">Premium Rich taste</div>
            </div>

            {/* Premium cookie design with nuts sticking out */}
            <div className="w-12 h-12 bg-amber-100 border-2 border-amber-300 rounded-full flex justify-center items-center shadow-lg shrink-0 transform rotate-12">
              <span className="text-[10px]">🍪</span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-1 pt-1 border-t border-white/10 z-10">
            <span className="text-[6px] text-amber-100 font-semibold">Loaded with Premium Nuts</span>
            <span className="text-[8px] font-black text-yellow-300 bg-amber-900 px-1 rounded">Rs. 10</span>
          </div>
        </div>
      );

    case 'patanjali-doodh':
      return (
        <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-tr from-cyan-600 via-sky-500 to-blue-400 p-2 flex flex-col justify-between shadow-inner">
          {/* Milk cow/farm layout styling */}
          <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-white/20 to-transparent blur-xs pointer-events-none"></div>
          <div className="absolute bottom-2 right-2 text-xs">🥛</div>

          <div className="flex justify-between items-start z-10">
            <span className="text-[7px] font-black text-cyan-100 bg-cyan-900/40 px-1 rounded uppercase">PATANJALI</span>
            <div className="w-3 h-3 border border-emerald-600 flex justify-center items-center bg-white p-0.5 rounded shadow-sm">
              <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
            </div>
          </div>

          <div className="flex justify-between items-center z-10">
            <div className="text-left">
              <div className="text-sm font-black text-white leading-none tracking-tighter uppercase drop-shadow">DOODH</div>
              <div className="text-[6px] font-extrabold text-yellow-300 uppercase mt-1 leading-none">100% Atta Biscuit</div>
            </div>

            {/* Glass of milk illustration */}
            <div className="w-11 h-11 bg-white rounded-full flex justify-center items-center shadow-md border border-cyan-300 shrink-0">
              <span className="text-[12px]">🥛</span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-1 pt-1 border-t border-white/10 z-10">
            <span className="text-[6px] text-cyan-100 font-bold">Cow Milk Nutrition</span>
            <span className="text-[8px] font-black text-yellow-300 bg-cyan-950 px-1 rounded">Rs. 10</span>
          </div>
        </div>
      );

    case 'britannia-bourbon':
      return (
        <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-tr from-purple-950 via-purple-900 to-[#3e1151] p-2 flex flex-col justify-between shadow-inner border border-purple-900">
          {/* Grocery shelf backdrop overlay (Page 9, 58, 62) */}
          <div className="absolute inset-x-0 top-0 h-1/2 bg-black/10 backdrop-blur-[0.5px] pointer-events-none"></div>
          
          <div className="flex justify-between items-start z-10">
            <span className="text-[7px] font-black tracking-widest text-purple-200 bg-purple-950/40 px-1 uppercase">BRITANNIA</span>
            <div className="w-3 h-3 border border-emerald-600 flex justify-center items-center bg-white p-0.5 rounded shadow-sm">
              <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
            </div>
          </div>

          <div className="flex justify-between items-center z-10">
            <div className="text-left">
              <div className="text-sm font-black tracking-tight leading-none text-yellow-400 uppercase drop-shadow">Bourbon</div>
              <div className="text-[5px] text-purple-200 uppercase font-black tracking-wide mt-1">The Original</div>
            </div>

            {/* Bourbon bar packet with sugar crystals */}
            <div className="w-13 h-7 bg-[#451e0f] border border-[#230f07] rounded shadow-lg flex flex-col justify-center items-center shrink-0 relative transform rotate-6">
              <div className="w-10 h-0.5 bg-[#542512]"></div>
              <span className="text-[4px] text-yellow-200 tracking-widest font-black">::::::</span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-1 pt-1 border-t border-white/10 z-10">
            <span className="text-[6px] text-purple-200 italic">Chocolate Delight</span>
            <span className="text-[8px] font-black text-yellow-300 bg-[#230a30] px-1 rounded">Rs. 10</span>
          </div>
        </div>
      );

    case 'patanjali-butter-cookies':
      return (
        <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-tr from-sky-600 via-sky-500 to-blue-400 p-2 flex flex-col justify-between shadow-inner">
          <div className="absolute bottom-2 right-2 text-xs">🧈</div>

          <div className="flex justify-between items-start z-10">
            <span className="text-[7px] font-black text-sky-100 bg-sky-900/40 px-1 rounded uppercase">PATANJALI</span>
            <div className="w-3 h-3 border border-emerald-600 flex justify-center items-center bg-white p-0.5 rounded shadow-sm">
              <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
            </div>
          </div>

          <div className="flex justify-between items-center z-10">
            <div className="text-left">
              <div className="text-xs font-black tracking-tight leading-none text-white uppercase drop-shadow">PREMIUM ATTA</div>
              <div className="text-xs font-black text-yellow-300 leading-none uppercase mt-0.5 drop-shadow-sm">Butter Cookies</div>
            </div>

            {/* Butter bar/block visual */}
            <div className="w-11 h-11 bg-amber-100 border-2 border-yellow-300 rounded-full flex justify-center items-center shadow-lg shrink-0">
              <span className="text-[12px]">🧈</span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-1 pt-1 border-t border-white/10 z-10">
            <span className="text-[6px] text-sky-100 font-bold">Pure Cow Butter Cookies</span>
            <span className="text-[8px] font-black text-yellow-300 bg-sky-950 px-1 rounded">Rs. 10</span>
          </div>
        </div>
      );

    case 'yippee-noodles-4pack':
      return (
        <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-tr from-orange-600 via-orange-500 to-red-500 p-2 flex flex-col justify-between shadow-inner border border-orange-600">
          <div className="absolute top-2 right-6 text-xs bg-white text-orange-600 font-extrabold px-1 rounded shadow-sm scale-75 uppercase">4 Pack</div>

          <div className="flex justify-between items-start z-10">
            <span className="text-[7px] font-black text-yellow-300 uppercase bg-orange-800 px-1 rounded">Sunfeast</span>
            <div className="w-3 h-3 border border-emerald-600 flex justify-center items-center bg-white p-0.5 rounded shadow-sm">
              <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
            </div>
          </div>

          <div className="flex justify-between items-center z-10">
            <div className="text-left">
              <div className="text-base font-black tracking-tighter text-yellow-300 italic leading-none drop-shadow">YiPPee!</div>
              <div className="text-[6px] font-bold text-white bg-orange-800 px-1 py-0.2 rounded inline-block mt-1">Magic Masala</div>
            </div>

            {/* Steaming noodle bowl */}
            <div className="w-12 h-12 bg-amber-50 border border-orange-300 rounded-full flex justify-center items-center shadow-lg shrink-0">
              <span className="text-[15px]">🍜</span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-1 pt-1 border-t border-white/10 z-10">
            <span className="text-[6px] text-orange-100 font-bold">Deliciously Non-Sticky Noodles</span>
            <span className="text-[8px] font-black text-yellow-300 bg-orange-950 px-1 rounded">Rs. 40</span>
          </div>
        </div>
      );

    case 'yippee-noodles-single':
      return (
        <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-tr from-red-600 via-orange-500 to-red-500 p-2 flex flex-col justify-between shadow-inner">
          <div className="flex justify-between items-start z-10">
            <span className="text-[7px] font-black text-yellow-300 uppercase bg-red-800 px-1 rounded">Sunfeast</span>
            <div className="w-3 h-3 border border-emerald-600 flex justify-center items-center bg-white p-0.5 rounded shadow-sm">
              <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
            </div>
          </div>

          <div className="flex justify-between items-center z-10">
            <div className="text-left">
              <div className="text-base font-black tracking-tighter text-yellow-300 italic leading-none drop-shadow">YiPPee!</div>
              <div className="text-[6px] font-bold text-white bg-red-800 px-1 py-0.2 rounded inline-block mt-1">Magic Masala</div>
            </div>

            {/* Steaming noodle bowl */}
            <div className="w-12 h-12 bg-amber-50 border border-red-300 rounded-full flex justify-center items-center shadow-lg shrink-0">
              <span className="text-[14px]">🍜</span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-1 pt-1 border-t border-white/10 z-10">
            <span className="text-[6px] text-red-100 font-bold">Long & Non-Sticky Noodles</span>
            <span className="text-[8px] font-black text-yellow-300 bg-red-950 px-1 rounded">Rs. 10</span>
          </div>
        </div>
      );

    case 'haldiram-khatta-meetha':
      return (
        <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-tr from-red-600 via-rose-600 to-red-500 p-2 flex flex-col justify-between shadow-inner">
          <div className="absolute top-2 right-4 text-xs">🥜</div>

          <div className="flex justify-between items-start z-10">
            <span className="text-[7px] font-black text-yellow-300 uppercase tracking-widest bg-red-900/40 px-1">Haldiram's</span>
            <div className="w-3 h-3 border border-emerald-600 flex justify-center items-center bg-white p-0.5 rounded shadow-sm">
              <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
            </div>
          </div>

          <div className="flex justify-between items-center z-10">
            <div className="text-left">
              <div className="text-sm font-black text-white leading-none uppercase drop-shadow">Khatta</div>
              <div className="text-sm font-black text-yellow-300 leading-none uppercase mt-0.5 drop-shadow-sm">Meetha</div>
            </div>

            {/* Crispy golden namkeen pile visual */}
            <div className="w-12 h-12 bg-amber-100 border border-rose-400 rounded-full flex justify-center items-center shadow-lg shrink-0">
              <span className="text-[13px]">🥜</span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-1 pt-1 border-t border-white/10 z-10">
            <span className="text-[6px] text-rose-100 font-bold">Classic Indian Namkeen Mix</span>
            <span className="text-[8px] font-black text-white bg-red-900 px-1.5 rounded">₹{product.price}</span>
          </div>
        </div>
      );

    case 'haldiram-peanuts':
      return (
        <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-tr from-purple-800 via-fuchsia-700 to-purple-600 p-2 flex flex-col justify-between shadow-inner">
          <div className="flex justify-between items-start z-10">
            <span className="text-[7px] font-black text-yellow-300 uppercase tracking-widest bg-purple-900/40 px-1">Haldiram's</span>
            <div className="w-3 h-3 border border-emerald-600 flex justify-center items-center bg-white p-0.5 rounded shadow-sm">
              <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
            </div>
          </div>

          <div className="flex justify-between items-center z-10">
            <div className="text-left">
              <div className="text-sm font-black text-white leading-none uppercase drop-shadow">Salted</div>
              <div className="text-sm font-black text-yellow-300 leading-none uppercase mt-0.5 drop-shadow-sm">Peanuts</div>
            </div>

            {/* Roasted peanuts spill */}
            <div className="w-12 h-12 bg-amber-100 border border-purple-400 rounded-full flex justify-center items-center shadow-lg shrink-0">
              <span className="text-[13px]">🥜</span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-1 pt-1 border-t border-white/10 z-10">
            <span className="text-[6px] text-purple-100 font-bold">Perfect Roasted Salted</span>
            <span className="text-[8px] font-black text-white bg-purple-950 px-1.5 rounded">₹{product.price}</span>
          </div>
        </div>
      );

    case 'haldiram-nut-cracker':
      return (
        <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-tr from-blue-800 via-indigo-700 to-indigo-500 p-2 flex flex-col justify-between shadow-inner">
          <div className="absolute top-2 right-4 text-xs">🔥</div>

          <div className="flex justify-between items-start z-10">
            <span className="text-[7px] font-black text-yellow-300 uppercase tracking-widest bg-blue-900/40 px-1">Haldiram's</span>
            <div className="w-3 h-3 border border-emerald-600 flex justify-center items-center bg-white p-0.5 rounded shadow-sm">
              <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
            </div>
          </div>

          <div className="flex justify-between items-center z-10">
            <div className="text-left">
              <div className="text-xs font-black text-white leading-none uppercase drop-shadow">Classic</div>
              <div className="text-sm font-black text-yellow-300 leading-none uppercase mt-0.5 drop-shadow-sm">Nut Cracker</div>
            </div>

            {/* Coated spicy nut cracker bowl */}
            <div className="w-11 h-11 bg-blue-100 border border-blue-400 rounded-full flex justify-center items-center shadow-lg shrink-0">
              <span className="text-[12px]">🔥</span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-1 pt-1 border-t border-white/10 z-10">
            <span className="text-[6px] text-indigo-100 font-bold">Crispy Spicy Coated Peanuts</span>
            <span className="text-[8px] font-black text-white bg-indigo-900 px-1.5 rounded">₹{product.price}</span>
          </div>
        </div>
      );

    case 'kurkure-masala':
      return (
        <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-tr from-orange-600 via-orange-500 to-amber-500 p-2 flex flex-col justify-between shadow-inner">
          <div className="absolute bottom-2 left-4 text-xs">🌽</div>

          <div className="flex justify-between items-start z-10">
            <span className="text-[7px] font-black text-yellow-300 uppercase tracking-widest bg-orange-950/40 px-1">Kurkure</span>
            <div className="w-3 h-3 border border-emerald-600 flex justify-center items-center bg-white p-0.5 rounded shadow-sm">
              <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
            </div>
          </div>

          <div className="flex justify-between items-center z-10">
            <div className="text-left">
              <div className="text-sm font-black text-white leading-none uppercase drop-shadow">Masala</div>
              <div className="text-sm font-black text-yellow-300 leading-none uppercase mt-0.5 drop-shadow-sm">Munch</div>
            </div>

            {/* Crispy twisted sachet graphics */}
            <div className="w-11 h-11 bg-amber-100 border border-orange-400 rounded-full flex justify-center items-center shadow-lg shrink-0">
              <span className="text-[12px]">🍿</span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-1 pt-1 border-t border-white/10 z-10">
            <span className="text-[6px] text-orange-100 font-semibold italic">Chatpata Tedhe Medhe</span>
            <span className="text-[8px] font-black text-white bg-orange-950 px-1.5 rounded">Rs. 10</span>
          </div>
        </div>
      );

    case 'bingo-tedhe-medhe':
      return (
        <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-tr from-pink-700 via-pink-600 to-fuchsia-500 p-2 flex flex-col justify-between shadow-inner">
          <div className="flex justify-between items-start z-10">
            <span className="text-[7px] font-black text-yellow-300 uppercase tracking-wider bg-pink-900/40 px-1">Bingo!</span>
            <div className="w-3 h-3 border border-emerald-600 flex justify-center items-center bg-white p-0.5 rounded shadow-sm">
              <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
            </div>
          </div>

          <div className="flex justify-between items-center z-10">
            <div className="text-left">
              <div className="text-xs font-black text-white leading-none uppercase drop-shadow">Tedhe Medhe</div>
              <div className="text-sm font-black text-yellow-300 leading-none uppercase mt-0.5 drop-shadow-sm">Masala Tadka</div>
            </div>

            {/* Spicy red stick represent */}
            <div className="w-11 h-11 bg-amber-100 border border-pink-400 rounded-full flex justify-center items-center shadow-lg shrink-0">
              <span className="text-[12px]">🥖</span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-1 pt-1 border-t border-white/10 z-10">
            <span className="text-[6px] text-pink-100 font-bold">Spicy Crunchy Snack Sticks</span>
            <span className="text-[8px] font-black text-yellow-300 bg-pink-950 px-1 rounded">Rs. 10</span>
          </div>
        </div>
      );

    case 'zhakaas-rice-papad':
      return (
        <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-tr from-sky-500 via-sky-400 to-blue-300 p-2 flex flex-col justify-between shadow-inner">
          {/* Cloudy sky blueprint style */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent"></div>
          
          <div className="flex justify-between items-start z-10">
            <span className="text-[7px] font-black text-sky-900 uppercase bg-sky-200 px-1 rounded">Zhakaas</span>
            <div className="w-3 h-3 border border-emerald-600 flex justify-center items-center bg-white p-0.5 rounded shadow-sm">
              <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
            </div>
          </div>

          <div className="flex justify-between items-center z-10">
            <div className="text-left">
              <div className="text-xs font-black text-white leading-none uppercase drop-shadow-sm">Rice Papad</div>
              <div className="text-[6px] font-bold text-yellow-200 mt-1 uppercase">Red Chilly</div>
            </div>

            {/* Floating thin round papads */}
            <div className="w-12 h-12 bg-amber-50 border-2 border-dashed border-amber-200 rounded-full flex justify-center items-center shadow-lg shrink-0">
              <span className="text-[13px]">🍘</span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-1 pt-1 border-t border-white/10 z-10">
            <span className="text-[6px] text-sky-100 font-bold">Super Light & Crispy Snack</span>
            <span className="text-[8px] font-black text-white bg-sky-850 px-1.5 rounded shadow">₹{product.price}</span>
          </div>
        </div>
      );

    case 'mothers-sabudana-papad':
      return (
        <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-tr from-red-650 via-red-550 to-orange-500 p-2 flex flex-col justify-between shadow-inner border border-red-600">
          <div className="absolute top-2 right-4 text-xs">🌿</div>

          <div className="flex justify-between items-start z-10">
            <span className="text-[7px] font-black text-red-100 bg-red-950/40 px-1">Mother's Recipe</span>
            <div className="w-3 h-3 border border-emerald-600 flex justify-center items-center bg-white p-0.5 rounded shadow-sm">
              <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
            </div>
          </div>

          <div className="flex justify-between items-center z-10">
            <div className="text-left">
              <div className="text-xs font-black text-white leading-none uppercase drop-shadow">Sabudana</div>
              <div className="text-sm font-black text-yellow-300 leading-none uppercase mt-0.5 drop-shadow-sm">Papad</div>
            </div>

            {/* White round sabudana pearl papad illustration */}
            <div className="w-11 h-11 bg-white border border-red-300 rounded-full flex justify-center items-center shadow-lg shrink-0">
              <span className="text-[12px]">⚪</span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-1 pt-1 border-t border-white/10 z-10">
            <span className="text-[6px] text-red-100 font-bold">Perfect for Vrat (Fasting)</span>
            <span className="text-[8px] font-black text-yellow-300 bg-red-955 px-1 rounded">₹{product.price}</span>
          </div>
        </div>
      );

    case 'rozana-urad-papad':
      return (
        <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 p-2 flex flex-col justify-between shadow-inner">
          <div className="flex justify-between items-start z-10">
            <span className="text-[7px] font-black text-emerald-100 bg-emerald-900/40 px-1 rounded uppercase">Rozana Premium</span>
            <div className="w-3 h-3 border border-emerald-600 flex justify-center items-center bg-white p-0.5 rounded shadow-sm">
              <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
            </div>
          </div>

          <div className="flex justify-between items-center z-10">
            <div className="text-left">
              <div className="text-xs font-black text-white leading-none uppercase drop-shadow">Urad Papad</div>
              <div className="text-[6px] font-bold text-yellow-300 mt-1 uppercase">Punjabi Masala</div>
            </div>

            {/* Black pepper speckled urad papad representation */}
            <div className="w-12 h-12 bg-amber-100 border border-emerald-300 rounded-full flex justify-center items-center shadow-lg shrink-0">
              <span className="text-[12px]">🍘</span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-1 pt-1 border-t border-white/10 z-10">
            <span className="text-[6px] text-emerald-100 font-bold">Traditional Spiced Taste</span>
            <span className="text-[8px] font-black text-white bg-emerald-950 px-1.5 rounded">₹{product.price}</span>
          </div>
        </div>
      );

    case 'mothers-potato-papad':
      return (
        <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 p-2 flex flex-col justify-between shadow-inner">
          <div className="absolute bottom-2 right-2 text-xs">🥔</div>

          <div className="flex justify-between items-start z-10">
            <span className="text-[7px] font-black text-amber-100 bg-amber-900/40 px-1 uppercase">Mother's Recipe</span>
            <div className="w-3 h-3 border border-emerald-600 flex justify-center items-center bg-white p-0.5 rounded shadow-sm">
              <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
            </div>
          </div>

          <div className="flex justify-between items-center z-10">
            <div className="text-left">
              <div className="text-xs font-black text-white leading-none uppercase drop-shadow">Potato (Aloo)</div>
              <div className="text-sm font-black text-yellow-300 leading-none uppercase mt-0.5 drop-shadow-sm">Papad</div>
            </div>

            {/* Flower potato crisps representation */}
            <div className="w-11 h-11 bg-amber-50 border border-amber-300 rounded-full flex justify-center items-center shadow-lg shrink-0">
              <span className="text-[12px]">🥔</span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-1 pt-1 border-t border-white/10 z-10">
            <span className="text-[6px] text-amber-100 font-bold">Sun-Dried Home Taste</span>
            <span className="text-[8px] font-black text-yellow-300 bg-amber-950 px-1.5 rounded">₹{product.price}</span>
          </div>
        </div>
      );

    case 'pure-sugar':
      return (
        <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-tr from-sky-100 via-white to-sky-50 p-2 flex flex-col justify-between border border-sky-300 shadow-inner">
          <div className="absolute top-2 right-4 text-xs opacity-70">🍬</div>

          <div className="flex justify-between items-start z-10">
            <span className="text-[7px] font-black text-sky-800 bg-sky-200 px-1 rounded uppercase">GHAR SE</span>
            <div className="w-3 h-3 border border-emerald-600 flex justify-center items-center bg-white p-0.5 rounded shadow-sm">
              <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
            </div>
          </div>

          <div className="flex justify-between items-center z-10">
            <div className="text-left">
              <div className="text-[11px] font-black text-sky-950 leading-none drop-shadow-sm">REFINED SUGAR</div>
              <div className="text-[5px] text-sky-700 uppercase font-bold mt-1 leading-none">Sulphur-Free White</div>
            </div>

            {/* Sparkling sugar cube visual */}
            <div className="w-11 h-11 bg-white border border-sky-200 rounded-lg flex justify-center items-center shadow-lg shrink-0">
              <span className="text-[12px] filter drop-shadow">🍬</span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-1 pt-1 border-t border-sky-300/30 z-10">
            <span className="text-[6px] text-sky-800 font-bold italic">Sparkling Pure Crystals</span>
            <span className="text-[8px] font-black text-white bg-sky-600 px-1.5 rounded shadow">₹{product.price}</span>
          </div>
        </div>
      );

    case 'kings-mishri':
      return (
        <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-tr from-slate-200 via-slate-100 to-slate-50 p-2 flex flex-col justify-between border border-slate-300 shadow-inner">
          <div className="absolute top-2 right-4 text-xs text-slate-400">💎</div>

          <div className="flex justify-between items-start z-10">
            <span className="text-[7px] font-black text-slate-800 bg-slate-300 px-1 rounded uppercase">KING'S</span>
            <div className="w-3 h-3 border border-emerald-600 flex justify-center items-center bg-white p-0.5 rounded shadow-sm">
              <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
            </div>
          </div>

          <div className="flex justify-between items-center z-10">
            <div className="text-left">
              <div className="text-[11px] font-black text-slate-950 leading-none drop-shadow-sm">PURE MISHRI</div>
              <div className="text-[5px] text-slate-600 uppercase font-bold mt-1 leading-none">Candy Crystal Sugar</div>
            </div>

            {/* Crystalline rock visual */}
            <div className="w-10 h-10 bg-white border border-slate-300 rounded-lg flex justify-center items-center shadow-lg shrink-0">
              <span className="text-[12px]">💎</span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-1 pt-1 border-t border-slate-300/40 z-10">
            <span className="text-[6px] text-slate-700 font-bold uppercase">Hygienic Traditional Pack</span>
            <span className="text-[8px] font-black text-white bg-slate-600 px-1.5 rounded shadow">₹{product.price}</span>
          </div>
        </div>
      );

    case 'catch-black-salt':
      return (
        <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-tr from-pink-600 via-pink-500 to-rose-400 p-2 flex flex-col justify-between shadow-inner">
          {/* Replicating Page 41 white can with fresh fruit salad */}
          <div className="absolute bottom-0 inset-x-0 h-10 bg-neutral-100 flex items-center justify-center pointer-events-none rounded-t-lg">
            <span className="text-[12px] opacity-90">🍎🍊🍌🍇</span>
          </div>

          <div className="flex justify-between items-start z-10">
            <span className="text-[7px] font-black text-pink-100 bg-pink-900/40 px-1 rounded uppercase">CATCH SPRINKLER</span>
            <div className="w-3 h-3 border border-emerald-600 flex justify-center items-center bg-white p-0.5 rounded shadow-sm">
              <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
            </div>
          </div>

          <div className="flex justify-between items-center z-10">
            <div className="text-left">
              <div className="text-sm font-black text-white leading-none uppercase drop-shadow">BLACK SALT</div>
              <div className="text-[5px] text-yellow-300 uppercase font-black mt-1 inline-block bg-pink-950 px-1 rounded">Kala Namak</div>
            </div>

            {/* Sprinkler container shape */}
            <div className="w-9 h-11 bg-white border border-pink-400 rounded-t-md rounded-b-sm flex flex-col justify-between p-1 shrink-0 shadow-lg transform rotate-3">
              <div className="w-full h-2 bg-pink-850 rounded-t-xs"></div>
              <span className="text-[4px] text-pink-900 font-black text-center leading-none">CATCH</span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-1 pt-1 border-t border-white/10 z-10">
            <span className="text-[6px] text-pink-100 font-semibold uppercase">Digestive Churna Sprinkler</span>
            <span className="text-[8px] font-black text-white bg-pink-900 px-1.5 rounded">₹{product.price}</span>
          </div>
        </div>
      );

    case 'premium-cloves':
      return (
        <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-tr from-stone-800 via-stone-750 to-stone-650 p-2 flex flex-col justify-between shadow-inner">
          {/* Whole cloves scattered around */}
          <div className="absolute bottom-2 left-4 text-xs opacity-85">🍂</div>

          <div className="flex justify-between items-start z-10">
            <span className="text-[7px] font-black text-stone-200 bg-stone-900/40 px-1 uppercase">BAZAR SPICES</span>
            <div className="w-3 h-3 border border-emerald-600 flex justify-center items-center bg-white p-0.5 rounded shadow-sm">
              <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
            </div>
          </div>

          <div className="flex justify-between items-center z-10">
            <div className="text-left">
              <div className="text-xs font-black text-white leading-none uppercase drop-shadow">WHOLE CLOVE</div>
              <div className="text-[6px] text-yellow-300 uppercase font-extrabold mt-1">Laung Premium</div>
            </div>

            {/* Bud visual representation */}
            <div className="w-11 h-11 bg-amber-50 border border-stone-500 rounded-full flex justify-center items-center shadow-lg shrink-0">
              <span className="text-[12px] filter drop-shadow">🍂</span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-1 pt-1 border-t border-white/10 z-10">
            <span className="text-[6px] text-stone-300 font-bold">Deep Aromatic Buds</span>
            <span className="text-[8px] font-black text-yellow-300 bg-stone-950 px-1 rounded">₹{product.price}</span>
          </div>
        </div>
      );

    case 'fortune-mustard-pouch':
      return (
        <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-b from-amber-50 to-orange-100 p-2 flex flex-col justify-between border border-amber-200/60 shadow-md">
          {/* Subtle warm glow background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.15),transparent_70%)] z-0"></div>
          
          {/* Non-veg/Veg Indicator */}
          <div className="flex justify-between items-center z-10 w-full">
            <span className="text-[7px] font-black bg-red-600 text-white px-1 py-0.5 rounded uppercase tracking-wider shadow-sm">FORTUNE</span>
            <div className="w-3 h-3 border border-emerald-600 flex justify-center items-center bg-white p-0.5 rounded shadow-sm">
              <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
            </div>
          </div>

          {/* Bottle Container */}
          <div className="relative flex-1 flex justify-center items-center my-0.5 z-10">
            {/* The 3D CSS/SVG Bottle */}
            <div className="relative w-20 h-[108px] flex flex-col items-center drop-shadow-[0_4px_8px_rgba(180,83,9,0.25)] hover:scale-105 transition-transform duration-300">
              {/* 1. Red Cap */}
              <div className="w-4 h-2 bg-gradient-to-r from-red-700 via-red-600 to-red-800 rounded-t-xs shadow-sm relative flex flex-col items-center">
                <div className="w-full h-[1px] bg-red-500"></div>
                {/* Ridges on cap */}
                <div className="w-full flex justify-between px-0.5 mt-0.5 opacity-45">
                  <span className="w-[1px] h-1 bg-neutral-950"></span>
                  <span className="w-[1px] h-1 bg-neutral-950"></span>
                  <span className="w-[1px] h-1 bg-neutral-950"></span>
                  <span className="w-[1px] h-1 bg-neutral-950"></span>
                </div>
              </div>

              {/* 2. White Collar with "fortune" */}
              <div className="w-3.5 h-1.5 bg-white border-x border-neutral-300 shadow-xs flex items-center justify-center relative">
                <span className="text-[3px] font-black text-red-600 tracking-tighter leading-none scale-75">fortune</span>
              </div>

              {/* 3. Transparent Neck with liquid */}
              <div className="w-5 h-4 relative bg-gradient-to-b from-transparent to-amber-500/80 rounded-b-md border-x border-amber-300/30 overflow-hidden">
                <div className="absolute top-1 left-0 right-0 h-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 opacity-90"></div>
                <div className="absolute top-0 bottom-0 left-1 w-0.5 bg-white/40 blur-[0.5px]"></div>
              </div>

              {/* 4. Upper Ribbed Section */}
              <div className="w-10 h-6 relative bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 rounded-t-xl border-x border-amber-400/30 overflow-hidden -mt-0.5">
                <div className="absolute top-0 bottom-0 left-1 w-1 bg-white/30 blur-[0.5px]"></div>
                <div className="absolute top-1.5 left-0 right-0 h-[1px] bg-amber-700/50"></div>
                <div className="absolute top-3 left-0 right-0 h-[1px] bg-amber-700/50"></div>
                <div className="absolute top-4.5 left-0 right-0 h-[1px] bg-amber-700/50"></div>
              </div>

              {/* 5. Main Body & Label */}
              <div className="w-11 h-12 relative bg-gradient-to-r from-amber-700 via-amber-500 to-amber-800 border-x border-amber-500/40 flex items-center justify-center overflow-hidden">
                <div className="absolute top-0 bottom-0 left-1 w-1.5 bg-white/20 blur-[0.5px] z-10"></div>
                
                {/* Label Wrapper (Wraps around the bottle) */}
                <div className="w-[38px] h-[38px] bg-white rounded-xs relative flex overflow-hidden shadow z-10 border border-neutral-200">
                  {/* Left part: White with vertical "Fortune" */}
                  <div className="w-[14px] bg-white flex items-center justify-center relative shrink-0">
                    <span className="text-[6.5px] font-black text-red-600 leading-none uppercase tracking-tighter origin-center -rotate-90 scale-110">
                      Fortune
                    </span>
                  </div>
                  
                  {/* Right part: Red & Yellow design */}
                  <div className="flex-1 bg-gradient-to-b from-red-600 to-red-700 relative p-0.5 flex flex-col justify-between overflow-hidden">
                    <div className="absolute top-0 right-0 bottom-0 w-3.5 bg-gradient-to-b from-yellow-400 to-amber-500 origin-top-left -skew-x-12"></div>
                    
                    <div className="z-10 text-[2.5px] text-white font-bold leading-none select-none mt-0.5 scale-90 origin-left">
                      Kachi
                      <br />
                      Ghani
                    </div>
                    
                    <div className="z-10 bg-yellow-400 text-[2px] text-amber-950 font-black px-0.5 py-0.2 rounded-xs inline-block self-start scale-90 origin-left shadow-xs">
                      100% PURE
                    </div>

                    <div className="z-10 flex justify-between items-center mt-auto scale-90 origin-bottom-left">
                      <span className="text-[2px] text-yellow-300 font-bold leading-none">Mustard</span>
                      <span className="text-[1.8px] text-white/90 font-medium">1L</span>
                    </div>
                  </div>
                </div>

                <div className="absolute top-0 left-0 right-0 h-1 bg-black/10"></div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/15"></div>
              </div>

              {/* 6. Lower Ribbed Section & Base */}
              <div className="w-[42px] h-4 relative bg-gradient-to-r from-amber-700 via-amber-500 to-amber-800 rounded-b-md border-x border-amber-600/30 overflow-hidden">
                <div className="absolute top-0 bottom-0 left-1 w-1 bg-white/20 blur-[0.5px]"></div>
                <div className="absolute top-1 left-0 right-0 h-[1px] bg-amber-800/60"></div>
                <div className="absolute top-2.5 left-0 right-0 h-[1px] bg-amber-800/60"></div>
              </div>
            </div>
          </div>

          {/* Card footer details */}
          <div className="flex justify-between items-center mt-1 pt-1 border-t border-amber-200/50 z-10 w-full">
            <div className="flex flex-col text-left">
              <span className="text-[5px] text-amber-800 font-bold uppercase tracking-wider leading-none">Premium Quality</span>
              <span className="text-[7px] text-amber-900 font-black leading-none mt-0.5">KACHI GHANI</span>
            </div>
            <span className="text-[8px] font-black text-white bg-red-600 px-1.5 py-0.5 rounded shadow-sm">₹{product.price}</span>
          </div>
        </div>
      );

    case 'saloni-mustard-oil':
      return (
        <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-500 p-2 flex flex-col justify-between shadow-inner">
          <div className="absolute bottom-2 right-2 text-xs">🧴</div>

          <div className="flex justify-between items-start z-10">
            <span className="text-[7px] font-black text-yellow-300 bg-amber-900/40 px-1 rounded uppercase">SALONI</span>
            <div className="w-3 h-3 border border-emerald-600 flex justify-center items-center bg-white p-0.5 rounded shadow-sm">
              <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
            </div>
          </div>

          <div className="flex justify-between items-center z-10">
            <div className="text-left">
              <div className="text-xs font-black leading-none uppercase text-white drop-shadow">Kachchi Ghani</div>
              <div className="text-[9px] font-black text-yellow-300 leading-none uppercase mt-1">Mustard Oil</div>
            </div>

            <div className="w-9 h-11 bg-yellow-100/20 border border-yellow-400 rounded-lg flex justify-center items-center shadow-lg shrink-0">
              <span className="text-[12px]">🧴</span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-1 pt-1 border-t border-white/10 z-10">
            <span className="text-[6px] text-yellow-100 font-bold uppercase">Agmark Grade-I Certified</span>
            <span className="text-[8px] font-black text-white bg-amber-800 px-1.5 rounded shadow">₹{product.price}</span>
          </div>
        </div>
      );

    case 'kings-soyabean-oil':
      return (
        <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-tr from-lime-600 via-lime-500 to-emerald-400 p-2 flex flex-col justify-between shadow-inner">
          <div className="absolute bottom-2 left-4 text-xs opacity-85">🌱</div>

          <div className="flex justify-between items-start z-10">
            <span className="text-[7px] font-black text-yellow-300 bg-lime-900/40 px-1 rounded uppercase">KING'S</span>
            <div className="w-3 h-3 border border-emerald-600 flex justify-center items-center bg-white p-0.5 rounded shadow-sm">
              <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
            </div>
          </div>

          <div className="flex justify-between items-center z-10">
            <div className="text-left">
              <div className="text-xs font-black leading-none uppercase text-white drop-shadow">Refined</div>
              <div className="text-xs font-black text-white leading-none uppercase mt-0.5 drop-shadow-sm">Soyabean Oil</div>
            </div>

            <div className="w-9 h-11 bg-white/20 border border-lime-300 rounded-lg flex justify-center items-center shadow-lg shrink-0">
              <span className="text-white text-[12px]">🌱</span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-1 pt-1 border-t border-white/10 z-10">
            <span className="text-[6px] text-lime-100 font-bold uppercase">Light & Healthy Staples</span>
            <span className="text-[8px] font-black text-white bg-lime-800 px-1.5 rounded">₹{product.price}</span>
          </div>
        </div>
      );

    case 'fortune-mustard-bottle':
      return (
        <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-b from-amber-100 to-amber-200 p-2 flex flex-col justify-between border border-amber-300 shadow-md">
          {/* Subtle warm glow background */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.2),transparent_75%)] z-0"></div>

          {/* Brand & Veg indicator */}
          <div className="flex justify-between items-center z-10 w-full">
            <span className="text-[7px] font-black bg-red-600 text-white px-1.5 py-0.5 rounded uppercase tracking-wider shadow-sm">FORTUNE</span>
            <div className="w-3 h-3 border border-emerald-600 flex justify-center items-center bg-white p-0.5 rounded shadow-sm">
              <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
            </div>
          </div>

          {/* Jerry Can Container */}
          <div className="relative flex-1 flex justify-center items-center my-0.5 z-10">
            {/* 3D CSS/SVG Jerry Can */}
            <div className="relative w-24 h-[100px] flex flex-col items-center drop-shadow-[0_5px_10px_rgba(180,83,9,0.3)] hover:scale-105 transition-transform duration-300">
              
              {/* Top Handle & Spout Area */}
              <div className="w-16 h-5 relative flex justify-between items-end px-1">
                {/* Spout & Cap (left side) */}
                <div className="flex flex-col items-center -mb-0.5 z-10">
                  <div className="w-3.5 h-1.5 bg-gradient-to-r from-red-700 via-red-600 to-red-800 rounded-t-xs shadow-sm"></div>
                  <div className="w-3 h-1 bg-amber-600/50"></div>
                </div>
                
                {/* Handle Bar (centered/right) */}
                <div className="absolute top-0 right-1 left-5 h-3 bg-gradient-to-b from-amber-600/80 to-amber-700 rounded-t-md border-x border-t border-amber-500/40 flex items-center justify-center">
                  <div className="w-full h-1 bg-amber-100/10 rounded-xs mx-1"></div>
                </div>
              </div>

              {/* Jerry Can Main Body */}
              <div className="w-20 h-16 relative bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 rounded-md border border-amber-400/30 overflow-hidden flex items-center justify-center">
                <div className="absolute top-0 bottom-0 left-2 w-2.5 bg-white/25 blur-[1px] z-10"></div>
                
                {/* Main Label */}
                <div className="w-14 h-[50px] bg-white rounded-xs relative flex overflow-hidden shadow z-10 border border-neutral-100">
                  {/* Left part: White label with vertical "Fortune" */}
                  <div className="w-[16px] bg-white flex items-center justify-center relative shrink-0">
                    <span className="text-[7.5px] font-black text-red-600 leading-none uppercase tracking-tighter origin-center -rotate-90 scale-110">
                      Fortune
                    </span>
                  </div>
                  
                  {/* Right part: Red design */}
                  <div className="flex-1 bg-gradient-to-b from-red-600 to-red-700 relative p-0.5 flex flex-col justify-between overflow-hidden">
                    <div className="absolute top-0 right-0 bottom-0 w-4.5 bg-gradient-to-b from-yellow-400 to-amber-500 origin-top-left -skew-x-12"></div>
                    
                    <div className="z-10 text-[3px] text-white font-black leading-none uppercase mt-0.5 scale-90 origin-left">
                      Kachi Ghani
                    </div>
                    
                    <div className="z-10 bg-yellow-400 text-[2px] text-amber-950 font-black px-0.5 py-0.2 rounded-xs inline-block self-start shadow-xs scale-90 origin-left">
                      5L VALUE
                    </div>

                    <div className="z-10 flex justify-between items-center mt-auto scale-90 origin-bottom-left">
                      <span className="text-[2.2px] text-yellow-300 font-bold leading-none">Mustard</span>
                      <span className="text-[2px] text-white/95 font-black">5L</span>
                    </div>
                  </div>
                </div>

                <div className="absolute left-1 top-1 bottom-1 w-1 bg-black/10 rounded-full blur-[0.5px]"></div>
                <div className="absolute right-1 top-1 bottom-1 w-1 bg-white/10 rounded-full blur-[0.5px]"></div>
              </div>
            </div>
          </div>

          {/* Footer of card */}
          <div className="flex justify-between items-center mt-1 pt-1 border-t border-amber-300/50 z-10 w-full">
            <div className="flex flex-col text-left">
              <span className="text-[5px] text-amber-950 font-bold uppercase tracking-wider leading-none">Family Pack</span>
              <span className="text-[7px] text-amber-950 font-black leading-none mt-0.5">MEGA VALUE CAN</span>
            </div>
            <span className="text-[8px] font-black text-white bg-red-600 px-1.5 py-0.5 rounded shadow-sm">₹{product.price}</span>
          </div>
        </div>
      );

    case 'bail-kolhu-oil':
      return (
        <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-tr from-yellow-500 via-amber-500 to-red-500 p-2 flex flex-col justify-between shadow-inner border border-red-600">
          <div className="absolute bottom-2 right-2 text-xs">🧴</div>

          <div className="flex justify-between items-start z-10">
            <span className="text-[7px] font-black bg-red-600 text-white px-1.5 rounded uppercase shadow">BAIL KOLHU</span>
            <div className="w-3 h-3 border border-emerald-600 flex justify-center items-center bg-white p-0.5 rounded shadow-sm">
              <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
            </div>
          </div>

          <div className="flex justify-between items-center z-10">
            <div className="text-left">
              <div className="text-xs font-black leading-none text-red-600 uppercase tracking-tighter drop-shadow-sm">MUSTARD OIL</div>
              <div className="text-[6px] font-black text-neutral-800 uppercase mt-1">Agmark Grade-1</div>
            </div>

            <div className="w-11 h-11 bg-amber-50 border border-yellow-400 rounded-full flex justify-center items-center shadow-lg shrink-0">
              <span className="text-red-600 text-[14px]">🐂</span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-1 pt-1 border-t border-red-600/10 z-10">
            <span className="text-[6px] text-red-700 font-bold uppercase text-center w-full">Strong Pungency</span>
            <span className="text-[8px] font-black text-white bg-red-600 px-1.5 rounded">₹{product.price}</span>
          </div>
        </div>
      );

    case 'raag-palmolein':
      return (
        <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-tr from-yellow-600 via-amber-500 to-yellow-400 p-2 flex flex-col justify-between shadow-inner">
          <div className="absolute bottom-2 left-4 text-xs opacity-85">🌴</div>

          <div className="flex justify-between items-start z-10">
            <span className="text-[7px] font-black text-yellow-950 bg-yellow-300/40 px-1 rounded uppercase">RAAG GOLD</span>
            <div className="w-3 h-3 border border-emerald-600 flex justify-center items-center bg-white p-0.5 rounded shadow-sm">
              <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
            </div>
          </div>

          <div className="flex justify-between items-center z-10">
            <div className="text-left">
              <div className="text-xs font-black leading-none text-yellow-950 uppercase drop-shadow">Refined</div>
              <div className="text-xs font-black text-white leading-none uppercase mt-0.5 drop-shadow-sm">Palmolein Oil</div>
            </div>

            <div className="w-9 h-11 bg-white/20 border border-yellow-300 rounded flex justify-center items-center shadow-lg shrink-0">
              <span className="text-yellow-600 text-[12px]">🌴</span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-1 pt-1 border-t border-white/10 z-10">
            <span className="text-[6px] text-yellow-100 font-bold uppercase">Best for Deep Frying</span>
            <span className="text-[8px] font-black text-white bg-yellow-600 px-1.5 rounded shadow">₹{product.price}</span>
          </div>
        </div>
      );

    case 'fortune-groundnut':
      return (
        <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-tr from-orange-600 via-orange-500 to-amber-500 p-2 flex flex-col justify-between shadow-inner">
          <div className="absolute bottom-2 right-2 text-xs">🥜</div>

          <div className="flex justify-between items-start z-10">
            <span className="text-[7px] font-black bg-red-600 text-white px-1 rounded uppercase">FORTUNE</span>
            <div className="w-3 h-3 border border-emerald-600 flex justify-center items-center bg-white p-0.5 rounded shadow-sm">
              <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
            </div>
          </div>

          <div className="flex justify-between items-center z-10">
            <div className="text-left">
              <div className="text-xs font-black leading-none text-white uppercase drop-shadow">Refined</div>
              <div className="text-xs font-black text-white leading-none uppercase mt-0.5 drop-shadow-sm">Groundnut Oil</div>
            </div>

            <div className="w-9 h-11 bg-white/20 border border-orange-300 rounded flex justify-center items-center shadow-lg shrink-0">
              <span className="text-orange-500 text-[12px]">🥜</span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-1 pt-1 border-t border-white/10 z-10">
            <span className="text-[6px] text-orange-100 font-bold uppercase">Rich Nutty Aroma</span>
            <span className="text-[8px] font-black text-white bg-orange-600 px-1.5 rounded">₹{product.price}</span>
          </div>
        </div>
      );

    case 'vanya-super-wash':
      return (
        <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-tr from-cyan-600 via-blue-500 to-sky-400 p-2 flex flex-col justify-between shadow-inner">
          <div className="absolute top-2 right-4 w-3 h-3 bg-white/20 border border-white/40 rounded-full"></div>
          <div className="absolute bottom-3 left-6 w-2 h-2 bg-white/30 border border-white/40 rounded-full"></div>

          <div className="flex justify-between items-start z-10">
            <span className="text-[7px] font-black text-yellow-300 bg-cyan-900/40 px-1 rounded uppercase">VANYA CARE</span>
            <div className="w-3 h-3 border border-emerald-600 flex justify-center items-center bg-white p-0.5 rounded shadow-sm">
              <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
            </div>
          </div>

          <div className="flex justify-between items-center z-10">
            <div className="text-left">
              <div className="text-xs font-black leading-none text-white drop-shadow">SUPER WASH</div>
              <div className="text-[5px] text-cyan-100 uppercase font-black mt-1">Detergent Powder</div>
            </div>

            <div className="w-10 h-10 bg-white border border-cyan-300 rounded-full flex justify-center items-center shadow-lg shrink-0">
              <span className="text-[12px]">🌸</span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-1 pt-1 border-t border-white/10 z-10">
            <span className="text-[6px] text-yellow-200 font-bold uppercase">Rose & Jasmine Scent</span>
            <span className="text-[8px] font-black text-white bg-cyan-800 px-1.5 rounded">₹{product.price}</span>
          </div>
        </div>
      );

    case 'wheel-2in1':
      return (
        <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-tr from-emerald-600 via-green-500 to-lime-400 p-2 flex flex-col justify-between shadow-inner">
          <div className="absolute bottom-2 right-2 text-xs">🍋</div>

          <div className="flex justify-between items-start z-10">
            <span className="text-[7px] font-black text-yellow-300 bg-emerald-900/40 px-1 rounded uppercase">ACTIVE WHEEL</span>
            <div className="w-3 h-3 border border-emerald-600 flex justify-center items-center bg-white p-0.5 rounded shadow-sm">
              <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
            </div>
          </div>

          <div className="flex justify-between items-center z-10">
            <div className="text-left">
              <div className="text-xs font-black leading-none text-white drop-shadow">2 IN 1 POWDER</div>
              <div className="text-[5px] text-emerald-100 uppercase font-black mt-1">Lemon & Jasmine</div>
            </div>

            <div className="w-10 h-10 bg-white border border-emerald-300 rounded-full flex justify-center items-center shadow-lg shrink-0">
              <span className="text-[12px]">🍋</span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-1 pt-1 border-t border-white/10 z-10">
            <span className="text-[6px] text-yellow-200 font-bold">Fresh Laundry Clean</span>
            <span className="text-[8px] font-black text-white bg-emerald-800 px-1.5 rounded">₹{product.price}</span>
          </div>
        </div>
      );

    case 'rin-powder':
      return (
        <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-tr from-blue-800 via-blue-700 to-sky-500 p-2 flex flex-col justify-between shadow-inner">
          <div className="absolute top-2 right-4 text-xs text-yellow-300">⚡</div>

          <div className="flex justify-between items-start z-10">
            <span className="text-[7px] font-black text-blue-100 bg-blue-900/40 px-1 rounded uppercase">RIN</span>
            <div className="w-3 h-3 border border-emerald-600 flex justify-center items-center bg-white p-0.5 rounded shadow-sm">
              <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
            </div>
          </div>

          <div className="flex justify-between items-center z-10">
            <div className="text-left">
              <div className="text-xs font-black tracking-tight leading-none text-white drop-shadow">BRIGHT LIKE NEW</div>
              <div className="text-[5px] text-yellow-300 uppercase font-black mt-1">Detergent Powder</div>
            </div>

            <div className="w-11 h-11 bg-yellow-400 rounded-full border-2 border-white flex justify-center items-center shadow-lg shrink-0">
              <span className="text-blue-700 text-[12px] font-black">⚡</span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-1 pt-1 border-t border-white/10 z-10">
            <span className="text-[6px] text-blue-100 font-bold uppercase">Lightning Bright Shine</span>
            <span className="text-[8px] font-black text-white bg-blue-800 px-1.5 rounded">₹{product.price}</span>
          </div>
        </div>
      );

    case 'nirma-advance':
      return (
        <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-tr from-sky-600 via-sky-500 to-blue-400 p-2 flex flex-col justify-between shadow-inner">
          {/* Replicating the pink rose petals flying in background (Page 30) */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent"></div>
          <div className="absolute bottom-2 left-4 text-xs animate-bounce opacity-80">🌸</div>

          <div className="flex justify-between items-start z-10">
            <span className="text-[7px] font-black text-yellow-300 bg-sky-900/40 px-1 rounded uppercase">NIRMA ADVANCE</span>
            <div className="w-3 h-3 border border-emerald-600 flex justify-center items-center bg-white p-0.5 rounded shadow-sm">
              <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
            </div>
          </div>

          <div className="flex justify-between items-center z-10">
            <div className="text-left">
              <div className="text-xs font-black leading-none text-white drop-shadow">PREMIUM POWDER</div>
              <div className="text-[5px] text-sky-100 uppercase font-black mt-1">Active Formulation</div>
            </div>

            {/* Dancing girl in white dress silhouette representation */}
            <div className="w-10 h-10 bg-yellow-400 border border-white rounded-full flex justify-center items-center shadow-lg shrink-0">
              <span className="text-[12px]">💃</span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-1 pt-1 border-t border-white/10 z-10">
            <span className="text-[6px] text-yellow-100 font-bold">Premium Rose Fragrance</span>
            <span className="text-[8px] font-black text-white bg-sky-800 px-1.5 rounded">₹{product.price}</span>
          </div>
        </div>
      );

    case 'rin-bar':
      return (
        <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-tr from-blue-800 via-blue-700 to-indigo-600 p-2 flex flex-col justify-between shadow-inner">
          <div className="absolute top-2 right-4 text-xs text-white">★</div>

          <div className="flex justify-between items-start z-10">
            <span className="text-[7px] font-black text-blue-100 bg-blue-900/40 px-1 rounded uppercase">RIN</span>
            <div className="w-3 h-3 border border-emerald-600 flex justify-center items-center bg-white p-0.5 rounded shadow-sm">
              <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
            </div>
          </div>

          <div className="flex justify-between items-center z-10">
            <div className="text-left">
              <div className="text-sm font-black text-white uppercase drop-shadow leading-none">Rin Soap</div>
              <div className="text-[6px] text-yellow-300 font-black mt-1">Big Bar</div>
            </div>

            {/* Soap block representation */}
            <div className="w-14 h-7 bg-blue-500 border border-blue-400 rounded flex justify-center items-center shadow-lg shrink-0 transform rotate-6">
              <span className="text-[8px] font-black text-white">RIN</span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-1 pt-1 border-t border-white/10 z-10">
            <span className="text-[6px] text-blue-100 font-bold uppercase">Collars & Cuffs Specialist</span>
            <span className="text-[8px] font-black text-white bg-blue-900 px-1.5 rounded">Rs. 10</span>
          </div>
        </div>
      );

    case 'ghadi-cake':
      return (
        <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-tr from-yellow-500 via-yellow-400 to-amber-500 p-2 flex flex-col justify-between shadow-inner border border-yellow-600">
          <div className="flex justify-between items-start z-10">
            <span className="text-[7px] font-black text-red-600 uppercase bg-yellow-100 px-1 rounded shadow">GHADI DETERGENT</span>
            <div className="w-3 h-3 border border-emerald-600 flex justify-center items-center bg-white p-0.5 rounded shadow-sm">
              <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
            </div>
          </div>

          <div className="flex justify-between items-center z-10">
            <div className="text-left">
              <div className="text-xs font-black text-red-600 leading-none uppercase drop-shadow">GHADI CAKE</div>
              <div className="text-[5px] text-neutral-800 uppercase font-black mt-1 leading-none">Pehle Istemaal Karein</div>
            </div>

            {/* Soap green cake block */}
            <div className="w-13 h-7 bg-red-600 border border-red-700 rounded-sm flex justify-center items-center shadow-lg shrink-0 transform -rotate-6">
              <span className="text-[7px] text-white font-black">GHADI</span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-1 pt-1 border-t border-yellow-700/10 z-10">
            <span className="text-[6px] text-neutral-800 font-bold">Phir Vishwaas Karein!</span>
            <span className="text-[8px] font-black text-white bg-red-600 px-1.5 rounded">Rs. 10</span>
          </div>
        </div>
      );

    case 'patanjali-herbal-soap':
      return (
        <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-tr from-green-700 via-green-600 to-emerald-500 p-2 flex flex-col justify-between shadow-inner">
          <div className="absolute top-2 right-4 text-xs">🌿</div>

          <div className="flex justify-between items-start z-10">
            <span className="text-[7px] font-black text-yellow-300 bg-green-950/40 px-1 rounded uppercase">PATANJALI HERBAL</span>
            <div className="w-3 h-3 border border-emerald-600 flex justify-center items-center bg-white p-0.5 rounded shadow-sm">
              <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
            </div>
          </div>

          <div className="flex justify-between items-center z-10">
            <div className="text-left">
              <div className="text-xs font-black text-white leading-none uppercase drop-shadow">HERBAL CAKE</div>
              <div className="text-[5px] text-green-100 uppercase font-black mt-1">With Neem & Lemon</div>
            </div>

            <div className="w-10 h-10 bg-white border border-green-300 rounded-full flex justify-center items-center shadow-lg shrink-0">
              <span className="text-[12px]">🌿</span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-1 pt-1 border-t border-white/10 z-10">
            <span className="text-[6px] text-green-100 font-bold">Safe for Hands & Fabrics</span>
            <span className="text-[8px] font-black text-yellow-300 bg-green-950 px-1 rounded">Rs. 10</span>
          </div>
        </div>
      );

    case 'surf-excel-bar':
      return (
        <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-tr from-orange-600 via-orange-500 to-red-500 p-2 flex flex-col justify-between shadow-inner">
          <div className="flex justify-between items-start z-10">
            <span className="text-[7px] font-black text-orange-100 bg-orange-900/40 px-1 rounded uppercase">SURF EXCEL</span>
            <div className="w-3 h-3 border border-emerald-600 flex justify-center items-center bg-white p-0.5 rounded shadow-sm">
              <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
            </div>
          </div>

          <div className="flex justify-between items-center z-10">
            <div className="text-left">
              <div className="text-sm font-black text-white uppercase drop-shadow">STAIN ERASER</div>
              <div className="text-[5px] text-yellow-200 uppercase font-black mt-1">Detergent Soap</div>
            </div>

            <div className="w-11 h-11 bg-blue-600 rounded flex justify-center items-center shadow-lg shrink-0">
              <span className="text-white text-[12px]">★</span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-1 pt-1 border-t border-white/10 z-10">
            <span className="text-[6px] text-orange-100 font-bold uppercase">Stain Eraser specialist</span>
            <span className="text-[8px] font-black text-white bg-orange-900 px-1.5 rounded">Rs. 10</span>
          </div>
        </div>
      );

    case 'anchor-toothbrush':
      return (
        <div className="relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-tr from-red-650 via-red-550 to-rose-400 p-2 flex flex-col justify-between shadow-inner">
          <div className="absolute top-2 right-4 text-xs">✨</div>

          <div className="flex justify-between items-start z-10">
            <span className="text-[7px] font-black text-yellow-300 bg-red-950/40 px-1 rounded uppercase">ANCHOR</span>
            <div className="w-3 h-3 border border-emerald-600 flex justify-center items-center bg-white p-0.5 rounded shadow-sm">
              <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
            </div>
          </div>

          <div className="flex justify-between items-center z-10">
            <div className="text-left">
              <div className="text-xs font-black text-white leading-none uppercase drop-shadow">POWER FLEXI</div>
              <div className="text-[5px] text-rose-100 uppercase font-black mt-1">Medium Toothbrush</div>
            </div>

            {/* Brush handle */}
            <div className="w-8 h-12 bg-white/30 border border-white/40 rounded-full flex flex-col justify-around p-1 shrink-0 shadow-lg">
              <div className="w-1 h-3 bg-red-400 rounded-full mx-auto"></div>
              <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mx-auto"></div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-1 pt-1 border-t border-white/10 z-10">
            <span className="text-[6px] text-yellow-200 font-bold">Zignog Bristles</span>
            <span className="text-[8px] font-black text-white bg-red-900 px-1.5 rounded">Rs. 18</span>
          </div>
        </div>
      );

    default:
      // High-quality Generic dynamic render for extra or unspecified products.
      const themeColors = (theme: string) => {
        switch (theme) {
          case 'amber': return 'from-amber-600 to-amber-500';
          case 'blue': return 'from-blue-600 to-blue-500';
          case 'yellow': return 'from-yellow-500 to-amber-500';
          case 'orange': return 'from-orange-600 to-orange-500';
          case 'red': return 'from-red-600 to-red-500';
          case 'green':
          case 'emerald': return 'from-emerald-600 to-emerald-500';
          case 'cyan':
          case 'sky': return 'from-sky-600 to-sky-500';
          case 'purple':
          case 'indigo': return 'from-indigo-600 to-indigo-500';
          default: return 'from-slate-600 to-slate-500';
        }
      };
      
      return (
        <div className={`relative w-full h-full rounded-xl overflow-hidden bg-gradient-to-tr ${themeColors(product.colorTheme)} p-2 flex flex-col justify-between shadow-inner`}>
          <div className="flex justify-between items-start z-10">
            <span className="text-[7px] font-black text-white/90 bg-black/20 px-1 rounded uppercase tracking-wider">{product.brand}</span>
            <div className="w-3 h-3 border border-emerald-600 flex justify-center items-center bg-white p-0.5 rounded shadow-sm">
              <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
            </div>
          </div>

          <div className="flex justify-between items-center z-10">
            <div className="text-left max-w-[65%]">
              <div className="text-xs font-black text-white leading-tight uppercase line-clamp-2 drop-shadow-sm">
                {product.name.replace(product.brand, '').trim()}
              </div>
            </div>

            <div className="w-10 h-11 bg-white/20 border border-white/30 rounded-lg flex justify-center items-center shadow-lg shrink-0">
              <span className="text-[14px]">
                {product.category === 'oils-ghee' ? '🧴' : product.category === 'household-care' ? '🧼' : '📦'}
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-1 pt-1 border-t border-white/10 z-10">
            <span className="text-[6px] text-white/90 font-medium truncate">{product.unit} premium pack</span>
            <span className="text-[8px] font-black text-white bg-black/20 px-1.5 rounded">₹{product.price}</span>
          </div>
        </div>
      );
  }
  })();

  if (element) {
    const bgUrl = getBackgroundImageUrl(product.id);
    const bgImage = (
      <img
        src={bgUrl}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay pointer-events-none z-0"
        referrerPolicy="no-referrer"
        key="bg-image"
      />
    );
    
    const originalChildren = element.props.children;
    const childrenArray = Array.isArray(originalChildren) ? originalChildren : [originalChildren];
    return cloneElement(element, {}, bgImage, ...childrenArray);
  }

  return null;
}

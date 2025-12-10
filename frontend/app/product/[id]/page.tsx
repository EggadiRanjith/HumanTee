"use client";

import Image from "next/image";
import Link from "next/link";
import { FiZoomIn, FiX, FiMinus, FiPlus } from "react-icons/fi";
import { notFound } from "next/navigation";
import { use, useState, useEffect } from "react";
import PageContainer from "@/app/components/PageContainer";
import { useCart } from "@/app/components/context/CartContext";

/* ---------------------------------------------
   HUMANTEE — ULTRA-LUXURY T-SHIRT PDP (FINAL)
   Mobile-First • Editorial Minimalism • No Animation
---------------------------------------------- */

type Product = {
  id: number;
  title: string;
  subtitle: string;
  price: string;
  description: string;
  details: string[];
  sizes: string[];
  images: string[]; // Changed from single image to array
};

const products: Product[] = [
  {
    id: 1,
    title: "Midnight Core Tee",
    subtitle: "Heavyweight 280 GSM • Signature Drop",
    price: "₹1,299",
    description:
      "Crafted from premium heavyweight cotton, this essential tee embodies the Humantee philosophy of understated luxury. A modern boxy silhouette, exceptional hand feel, and precise structure define this wardrobe staple.",
    details: [
      "280 GSM heavyweight cotton",
      "Premium garment dye finish",
      "Structured fit that holds shape",
      "Ethically sourced materials",
      "Made in Portugal",
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format",
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1200&auto=format",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=1200&auto=format",
      "https://images.unsplash.com/photo-1622445275463-afa2ab738c34?q=80&w=1200&auto=format",
    ],
  },
  // Add other products...
];

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const product = products.find((p) => p.id === parseInt(resolvedParams.id));

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isZoomed, setIsZoomed] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [sizeError, setSizeError] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const { addToCart } = useCart();
  const [addedToCart, setAddedToCart] = useState(false);

  if (!product) notFound();

  // Auto-transition images every 3 seconds (but not when zoomed)
  useEffect(() => {
    if (!isAutoPlaying || !product.images || product.images.length <= 1 || isZoomed) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, product.images, isZoomed]);

  const handleImageSelect = (index: number) => {
    setCurrentImageIndex(index);
    setIsAutoPlaying(false); // Stop auto-transition when user manually selects
  };

  // Handle browser back button to close zoom instead of navigating away
  useEffect(() => {
    if (isZoomed) {
      // Push a new history state when zoom opens
      window.history.pushState({ zoomOpen: true }, '');

      const handlePopState = (e: PopStateEvent) => {
        setIsZoomed(false);
      };

      window.addEventListener('popstate', handlePopState);

      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [isZoomed]);

  // Stop auto-transition when zoom opens
  const handleZoomOpen = () => {
    setIsAutoPlaying(false);
    setIsZoomed(true);
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentImageIndex < product.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
      setIsAutoPlaying(false);
    }

    if (isRightSwipe && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
      setIsAutoPlaying(false);
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      setTimeout(() => setSizeError(false), 3000);
      return;
    }

    // Clear any previous error
    setSizeError(false);

    addToCart({
      id: product.id,
      title: product.title,
      subtitle: product.subtitle,
      price: product.price,
      image: product.images[0], // Use first image for cart
      size: selectedSize,
      quantity: quantity,
    });

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  return (
    <PageContainer className="brand-bg-dusk">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 pb-4 sm:pb-6 lg:pb-8">

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* IMAGE SECTION */}
          <div className="w-full max-w-md mx-auto lg:mx-0 space-y-4">
            {/* Main Image */}
            <div
              className="relative aspect-[3/4] overflow-hidden luxury-glass border border-white/10 shadow-floating cursor-zoom-in rounded-sm touch-pan-y"
              onClick={handleZoomOpen}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <Image
                src={product!.images[currentImageIndex]}
                alt={product!.title}
                fill
                className="object-cover transition-all duration-500 ease-out"
                key={currentImageIndex}
              />

              {/* ZOOM BADGE - TOP LEFT */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-black/40 backdrop-blur-sm border border-white/10">
                <FiZoomIn className="h-3.5 w-3.5 text-white/90" />
                <span className="text-[10px] uppercase tracking-wider text-white/90 font-medium">Zoom</span>
              </div>

              {/* Image Counter - Mobile Only */}
              <div className="absolute top-3 right-3 lg:hidden px-2.5 py-1.5 rounded-md bg-black/40 backdrop-blur-sm border border-white/10">
                <span className="text-[10px] uppercase tracking-wider text-white/90 font-medium">
                  {currentImageIndex + 1}/{product!.images.length}
                </span>
              </div>

              {/* CAPTION */}
              <div className="absolute bottom-3 left-3 right-3 flex justify-between text-[10px] uppercase tracking-[0.2em] text-white/75">
                <span className="truncate">
                  {product!.subtitle.split(" • ")[0]}
                </span>
                <span>{String(product!.id).padStart(2, "0")}</span>
              </div>
            </div>

            {/* Thumbnail Gallery - Visible on All Screens */}
            {product!.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product!.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => handleImageSelect(index)}
                    className={`
                      relative aspect-[3/4] overflow-hidden rounded-sm
                      border-2 transition-all duration-300
                      ${currentImageIndex === index
                        ? 'border-white shadow-glow-violet-medium scale-105'
                        : 'border-white/10 hover:border-white/30 hover:scale-102'
                      }
                    `}
                  >
                    <Image
                      src={img}
                      alt={`${product!.title} - View ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* DETAILS */}
          <div className="flex flex-col gap-6 sm:gap-8">

            {/* TITLE */}
            <div className="space-y-1">
              <h1 className="text-white text-[1.7rem] sm:text-[2.2rem] lg:text-[2.6rem] font-light tracking-wide leading-tight">
                {product!.title}
              </h1>
              <p className="text-white/60 text-[0.85rem] sm:text-[0.95rem] tracking-wide">
                {product!.subtitle}
              </p>
            </div>

            {/* PRICE */}
            <div className="text-white text-[1.6rem] sm:text-[2rem] font-light tracking-wide">
              {product!.price}
            </div>

            {/* SIZE SELECTOR */}
            <div className="space-y-3">
              <p className="text-white/70 text-xs tracking-[0.2em] uppercase">
                Select Size
              </p>

              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                {product!.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`
                      py-2.5 rounded-lg 
                      border transition-all
                      text-[0.75rem] uppercase tracking-[0.15em]
                      ${selectedSize === size
                        ? 'bg-white text-black border-white'
                        : 'border-white/10 luxury-glass text-white/75 hover:border-white/30'
                      }
                    `}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* QUANTITY SELECTOR */}
            <div className="space-y-3">
              <p className="text-white/70 text-xs tracking-[0.2em] uppercase">
                Quantity
              </p>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2.5 rounded-lg border border-white/10 luxury-glass text-white/75 hover:bg-white/5 transition-colors"
                  disabled={quantity <= 1}
                >
                  <FiMinus className="h-4 w-4" />
                </button>

                <span className="text-white text-lg font-light min-w-[3rem] text-center">
                  {quantity}
                </span>

                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2.5 rounded-lg border border-white/10 luxury-glass text-white/75 hover:bg-white/5 transition-colors"
                >
                  <FiPlus className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* ERROR MESSAGE */}
            {sizeError && (
              <div className="p-4 rounded-lg luxury-glass border border-red-400/50 bg-red-500/15">
                <p className="text-red-200 text-[11px] uppercase tracking-[0.2em] text-center font-light">
                  Please select a size
                </p>
              </div>
            )}

            {/* ACTION BUTTONS */}
            <div className="pt-2 space-y-3">
              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className={`
                  w-full py-3.5 sm:py-4 
                  rounded-full transition-all duration-300
                  text-[0.8rem] uppercase tracking-[0.18em] font-medium
                  ${addedToCart
                    ? 'bg-green-500 text-white'
                    : 'bg-white text-black hover:bg-white/90'
                  }
                `}
              >
                {addedToCart ? "Added to Cart" : "Add to Cart"}
              </button>

              {/* Go to Cart Button */}
              <Link
                href="/cart"
                className="
                  w-full py-3.5 sm:py-4 
                  rounded-full transition-all duration-300
                  text-[0.8rem] uppercase tracking-[0.18em] font-medium
                  border-2 border-white/20 text-white
                  hover:bg-white/5 hover:border-white/30
                  flex items-center justify-center
                "
              >
                Go to Cart
              </Link>
            </div>

            {/* DESCRIPTION */}
            <div className="pt-2 space-y-4">
              <div>
                <h3 className="text-white/70 text-xs uppercase tracking-[0.15em] mb-2">
                  Description
                </h3>
                <p className="text-white/65 text-[0.9rem] leading-relaxed">
                  {product!.description}
                </p>
              </div>

              {/* KEY DETAILS */}
              <div>
                <h3 className="text-white/70 text-xs uppercase tracking-[0.15em] mb-2">
                  Key Details
                </h3>

                <ul className="space-y-1.5">
                  {product!.details.map((detail, i) => (
                    <li
                      key={i}
                      className="text-white/60 text-[0.9rem] flex gap-2"
                    >
                      <span className="text-white/30">•</span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* ZOOM MODAL */}
      {
        isZoomed && (
          <div
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 pt-[calc(var(--header-height)+1rem)]"
            onClick={() => setIsZoomed(false)}
            onTouchStart={(e) => {
              setTouchStart(e.targetTouches[0].clientY);
            }}
            onTouchMove={(e) => {
              setTouchEnd(e.targetTouches[0].clientY);
            }}
            onTouchEnd={() => {
              if (!touchStart || !touchEnd) return;

              const distance = touchStart - touchEnd;
              const isDownSwipe = distance < -100; // Swipe down to close

              if (isDownSwipe) {
                setIsZoomed(false);
              }

              setTouchStart(0);
              setTouchEnd(0);
            }}
          >
            {/* Close Button - Below Header */}
            <button
              className="absolute right-4 p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-colors z-10"
              style={{ top: 'calc(var(--header-height) + 1rem)' }}
              onClick={(e) => {
                e.stopPropagation();
                setIsZoomed(false);
              }}
            >
              <FiX className="h-6 w-6" />
            </button>

            {/* Swipe Indicator - Mobile Only */}
            <div
              className="absolute left-1/2 -translate-x-1/2 lg:hidden"
              style={{ top: 'calc(var(--header-height) + 1rem)' }}
            >
              <div className="w-12 h-1 rounded-full bg-white/30"></div>
            </div>

            {/* Zoomed Image */}
            <div
              className="relative w-full h-full max-w-5xl max-h-[80vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={product!.images[currentImageIndex]}
                alt={product!.title}
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Image Info - Bottom */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/60 backdrop-blur-sm border border-white/10">
              <p className="text-white/90 text-xs uppercase tracking-wider">
                {currentImageIndex + 1} / {product!.images.length}
              </p>
            </div>
          </div>
        )
      }
    </PageContainer >
  );
}

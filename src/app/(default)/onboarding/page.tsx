
"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Onboarding.module.css';
import { cn } from '@/lib/utils';
import { Logo } from '../../../components/core/Logo'; 

const OnboardingSlides = [
  {
    id: 'slide-1',
    backgroundClass: 'bg-onboarding-slide1',
    illustration: (
      <div className={styles.illustrationContainer}>
        <div className={styles.foodLabel}>
          <div className={styles.labelTitle}>INGREDIENTS:</div>
          <div className={styles.labelLine} style={{ width: '100%' }}></div>
          <div className={styles.labelLine} style={{ width: '90%' }}></div>
          <div className={styles.labelLine} style={{ width: '95%' }}></div>
          <div className={styles.labelLine} style={{ width: '85%' }}></div>
          <div className={styles.labelLine} style={{ width: '70%' }}></div>
          <div className={styles.allergenIcons}>
            <div className={styles.allergenIcon}>🥜</div>
            <div className={styles.allergenIcon}>🌾</div>
            <div className={styles.allergenIcon}>🥩</div>
            <div className={styles.allergenIcon}>🧪</div>
          </div>
        </div>
        <div className={cn(styles.warningIcon, "text-4xl")}>⚠️</div>
      </div>
    ),
    headline: "Do you really know what's in your food?",
    subtext: "Millions unknowingly consume harmful or forbidden ingredients every day.",
  },
  {
    id: 'slide-2',
    backgroundClass: 'bg-onboarding-slide2',
    showLogo: true,
    illustration: (
        <div className={styles.iphoneContainerRelative}>
            {/* iPhone Frame */}
            <div className="relative bg-gray-800 rounded-[40px] p-2 shadow-2xl mx-auto">
                {/* iPhone Notch */}
                <div className={styles.iphoneNotchNew}></div>
                
                {/* iPhone Side Buttons */}
                <div className={styles.iphoneButtonNew}></div>
                <div className={cn(styles.iphoneButtonNew, styles.left, styles.volumeUp)}></div>
                <div className={cn(styles.iphoneButtonNew, styles.left, styles.volumeDown)}></div>
                
                {/* iPhone Screen */}
                <div className="bg-gray-100 rounded-[32px] overflow-hidden aspect-[9/19]">
                    {/* App Interface */}
                    <div className="h-full w-full bg-gray-900 flex flex-col">
                        {/* App Header */}
                        <div className="bg-gray-800 text-white p-3 flex justify-between items-center">
                            <div className="text-xs sm:text-sm font-semibold text-white">Scan Product</div>
                            <div className="flex space-x-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                </svg>
                            </div>
                        </div>
                        
                        {/* Scanner View */}
                        <div className="flex-1 relative flex items-center justify-center">
                            {/* Scanner Frame */}
                            <div className="absolute inset-4 border-2 border-white/30 rounded-lg flex items-center justify-center">
                                {/* Scanner Corners */}
                                <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-blue-400"></div>
                                <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-blue-400"></div>
                                <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-blue-400"></div>
                                <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-blue-400"></div>
                                
                                {/* Product Placeholder */}
                                <div className={cn(styles.productPulse, "w-3/5 h-2/5 bg-white rounded-md flex flex-col items-center justify-between p-2")}>
                                    {/* Product Label Lines */}
                                    <div className="w-full h-2 bg-blue-500 rounded-sm"></div>
                                    <div className="w-full h-1 bg-gray-300 rounded-sm"></div>
                                    <div className="w-3/4 h-1 bg-gray-300 rounded-sm"></div>
                                    
                                    {/* Barcode Representation */}
                                    <div className="w-full flex justify-center items-center space-x-0.5 my-2">
                                        <div className="h-10 w-0.5 bg-black"></div> <div className="h-10 w-1 bg-black"></div>
                                        <div className="h-10 w-0.5 bg-black"></div> <div className="h-10 w-1.5 bg-black"></div>
                                        <div className="h-10 w-0.5 bg-black"></div> <div className="h-10 w-1 bg-black"></div>
                                        <div className="h-10 w-1.5 bg-black"></div> <div className="h-10 w-0.5 bg-black"></div>
                                        <div className="h-10 w-1 bg-black"></div> <div className="h-10 w-0.5 bg-black"></div>
                                        <div className="h-10 w-1.5 bg-black"></div> <div className="h-10 w-1 bg-black"></div>
                                        <div className="h-10 w-0.5 bg-black"></div>
                                    </div>
                                    
                                    <div className="w-full h-1 bg-gray-300 rounded-sm"></div>
                                </div>
                                
                                {/* Animated Scan Line */}
                                <div className={cn(styles.scanLineNew, "absolute w-full h-0.5 bg-blue-500 opacity-70")}></div>
                            </div>
                            
                            {/* Camera View Dark Overlay */}
                            <div className="absolute inset-0 bg-black/50 pointer-events-none"></div>
                        </div>
                        
                        {/* Bottom Controls Bar */}
                        <div className="bg-gray-800 p-3 flex justify-between items-center">
                            <button className="bg-gray-700 text-white text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-1.5 rounded-full hover:bg-gray-600 transition-colors">History</button>
                            <button className="bg-blue-600 text-white rounded-full w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center hover:bg-blue-700 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </button>
                            <button className="bg-gray-700 text-white text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-1.5 rounded-full hover:bg-gray-600 transition-colors">Gallery</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ),
    headline: "Scan in Seconds. Know Instantly.",
    subtext: "Let AI do the label reading — Safora instantly checks ingredients for your needs.",
  },
  {
    id: 'slide-3',
    backgroundClass: 'bg-white', 
    showLogo: true,
    illustration: (
      <div className={styles.illustrationContainer}>
        <div className={styles.profileContainer}>
          <div className={styles.profileAvatar}>👤</div>
        </div>
        <div className={cn(styles.shieldOverlay, "animate-pulseSlow")}></div> 
        <div className={cn(styles.dietaryIcons, "animate-rotate")}>
          <div className={cn(styles.dietaryIcon, styles.iconHalal)}>🌙</div>
          <div className={cn(styles.dietaryIcon, styles.iconVegan)}>🥦</div>
          <div className={cn(styles.dietaryIcon, styles.iconGluten)}>🌾</div>
          <div className={cn(styles.dietaryIcon, styles.iconDairy)}>🥛</div>
          <div className={cn(styles.dietaryIcon, styles.iconSugar)}>🍬</div>
          <div className={cn(styles.dietaryIcon, styles.iconPeanut)}>🥜</div>
        </div>
      </div>
    ),
    headline: "Your Diet. Your Faith. Your Rules.",
    subtext: "Safora adapts to your lifestyle — from halal to heart-healthy.",
    badges: [
      { text: "Halal", className: styles.badgeHalal },
      { text: "Vegan", className: styles.badgeVegan },
      { text: "No Dairy", className: styles.badgeDairy },
      { text: "Low Sugar", className: styles.badgeSugar },
    ],
  },
  {
    id: 'slide-4',
    backgroundClass: 'bg-onboarding-slide4',
    showLogo: true,
    illustration: (
      <div className={styles.illustrationContainer}>
        <div className={styles.checklistContainer}>
          {[
            "Halal Certified",
            "Gluten Free",
            "No Artificial Colors",
            "Low Sugar",
          ].map((item, idx) => (
            <div key={idx} className={styles.checklistItem}>
              <div className={styles.checklistIcon}>✓</div>
              <div className={styles.checklistText}>{item}</div>
            </div>
          ))}
        </div>
        <div className={styles.groceryBag}>
          <div className={styles.groceryHandle}></div>
          <div className={cn(styles.groceryItem, "bg-yellow-400")}></div>
          <div className={cn(styles.groceryItem, "bg-green-500")}></div>
          <div className={cn(styles.groceryItem, "bg-red-400")}></div>
        </div>
        <div className={cn(styles.floatingFood, styles.food1, "animate-float")}>🥗</div>
        <div className={cn(styles.floatingFood, styles.food2, "animate-float")} style={{animationDelay: '0.5s'}}>🍎</div>
        <div className={cn(styles.floatingFood, styles.food3, "animate-float")} style={{animationDelay: '1s'}}>🥑</div>
        <div className={cn(styles.floatingFood, styles.food4, "animate-float")} style={{animationDelay: '1.5s'}}>🍇</div>
      </div>
    ),
    headline: "Shop & Eat with Confidence",
    subtext: "Your health guardian, wherever you go. Peace of mind starts with a scan.",
    isLastSlide: true,
  },
];


export default function OnboardingPage() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [startX, setStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  const totalSlides = OnboardingSlides.length;

  useEffect(() => {
    // Apply styles to body for onboarding
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'pan-y'; // Allow vertical scroll but prioritize horizontal for carousel if mixed content was present

    // Cleanup function to remove styles when component unmounts
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, []);


  const handleDragStart = useCallback((clientX: number) => {
    setIsDragging(true);
    setStartX(clientX);
    if (carouselRef.current) {
      carouselRef.current.style.transition = 'none'; // Disable transition during drag
    }
  }, []);

  const handleDragMove = useCallback((clientX: number) => {
    if (!isDragging || !carouselRef.current) return;
    const diff = clientX - startX;
    const currentOffset = -currentSlide * window.innerWidth;
    
    // Add slight resistance at boundaries
    let newTranslateX = currentOffset + diff;
    if ((currentSlide === 0 && diff > 0) || (currentSlide === totalSlides - 1 && diff < 0)) {
      newTranslateX = currentOffset + diff / 3; // Dampen the effect
    }
    carouselRef.current.style.transform = `translateX(${newTranslateX}px)`;
  }, [isDragging, startX, currentSlide, totalSlides]);

  const handleDragEnd = useCallback(() => {
    if (!isDragging || !carouselRef.current) return;
    setIsDragging(false);
    carouselRef.current.style.transition = 'transform 0.5s ease-in-out'; // Re-enable transition

    // Determine current position based on transform (safer than relying on moveX if touchend/mouseup doesn't provide clientX)
    const endTranslateXString = carouselRef.current.style.transform.match(/translateX\(([^px]+)px\)/);
    const endTranslateX = endTranslateXString ? parseFloat(endTranslateXString[1]) : 0;

    const threshold = window.innerWidth / 4; // Swipe threshold
    const slideWidth = window.innerWidth;
    const currentOffset = -currentSlide * slideWidth;
    const movedDistance = endTranslateX - currentOffset; // How much it moved from the current slide's resting position

    if (movedDistance < -threshold && currentSlide < totalSlides - 1) {
      setCurrentSlide(prev => prev + 1);
    } else if (movedDistance > threshold && currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    } else {
      // Snap back to current slide if threshold not met
      carouselRef.current.style.transform = `translateX(${-currentSlide * slideWidth}px)`;
    }
  }, [isDragging, currentSlide, totalSlides]);


  useEffect(() => {
    if (carouselRef.current) {
        // Ensure carousel snaps to the correct slide index when currentSlide changes programmatically or after drag
        carouselRef.current.style.transform = `translateX(-${currentSlide * 100}vw)`;
    }
  }, [currentSlide]);

  // Touch events
  const onTouchStart = (e: React.TouchEvent) => handleDragStart(e.touches[0].clientX);
  const onTouchMove = (e: React.TouchEvent) => handleDragMove(e.touches[0].clientX);
  const onTouchEnd = () => handleDragEnd();

  // Mouse events
  const onMouseDown = (e: React.MouseEvent) => {
    handleDragStart(e.clientX);
    if(carouselRef.current) carouselRef.current.style.cursor = 'grabbing';
  };
  const onMouseMove = (e: React.MouseEvent) => handleDragMove(e.clientX);
  const onMouseUp = () => {
    handleDragEnd();
    if(carouselRef.current) carouselRef.current.style.cursor = 'grab';
  };
  const onMouseLeave = () => {
    if (isDragging) { // If mouse leaves while dragging, end the drag
        handleDragEnd();
        if(carouselRef.current) carouselRef.current.style.cursor = 'grab';
    }
  };

  const handleIndicatorClick = (index: number) => {
    setCurrentSlide(index);
  };

  const handleGetStarted = () => {
    router.push('/auth');
  };

  return (
    <div className={styles.carouselContainer}>
      <div
        ref={carouselRef}
        className={styles.carousel}
        style={{ width: `${totalSlides * 100}vw` }} 
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
      >
        {OnboardingSlides.map((slide) => (
          <div key={slide.id} className={cn(styles.carouselSlide, styles[slide.id], slide.backgroundClass, `font-['Poppins']`)}>
             {slide.showLogo && (
                <div className="absolute top-6 left-6 z-20">
                    <Logo />
                </div>
            )}
            {slide.id === 'slide-2' && <div className={styles.gridOverlay}></div>}

            <div className={styles.contentContainer}>
              <div className={cn(styles.illustrationContainer, slide.id === 'slide-2' ? styles.slide2IllustrationContainer : '')}>
                {slide.illustration}
              </div>
              <h1 className={styles.headline}>{slide.headline}</h1>
              <p className={styles.subtext}>{slide.subtext}</p>

              {slide.badges && (
                <div className={styles.badgesContainer}>
                  {slide.badges.map((badge, idx) => (
                    <div key={idx} className={cn(styles.badge, badge.className)}>
                      {badge.text}
                    </div>
                  ))}
                </div>
              )}

              {slide.isLastSlide ? (
                <button className={styles.ctaButton} onClick={handleGetStarted}>
                  Get Started
                </button>
              ) : (
                <div className={styles.swipeIndicator}>
                  Swipe to continue <span className={cn(styles.swipeArrow, "animate-swipeArrow")}>→</span>
                </div>
              )}
            </div>

            <div className={styles.indicatorContainer}>
              {OnboardingSlides.map((_, idx) => (
                <div
                  key={idx}
                  className={cn(styles.indicator, styles[`indicator-${idx}`] , currentSlide === idx ? styles.active : '')}
                  onClick={() => handleIndicatorClick(idx)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}



"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Onboarding.module.css';
import { cn } from '@/lib/utils';
import { Logo } from '../../../components/core/Logo'; // Import the main Logo component

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
    illustration: (
      <div className={styles.illustrationContainer}>
        <div className={styles.scanContainer}>
          <div className={styles.phoneMockup}>
            <div className={styles.phoneScreen}>
              <div className={styles.scanArea}>
                <div className={styles.scanLineAnim}></div>
                <div className={styles.barcode}></div>
              </div>
            </div>
          </div>
          <div className={cn(styles.safeCheck, "animate-fadeInOut")}>SAFE</div>
        </div>
      </div>
    ),
    headline: "Scan in Seconds. Know Instantly.",
    subtext: "Let AI do the label reading — Safora instantly checks ingredients for your needs.",
    showLogo: true,
  },
  {
    id: 'slide-3',
    backgroundClass: 'bg-white', // Corresponds to styles.slide3 in CSS Module
    illustration: (
      <div className={styles.illustrationContainer}>
        <div className={styles.profileContainer}>
          <div className={styles.profileAvatar}>👤</div>
        </div>
        <div className={cn(styles.shieldOverlay, "animate-pulseSlow")}></div> {/* Ensure animate-pulseSlow is used if defined */}
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
    showLogo: true,
  },
  {
    id: 'slide-4',
    backgroundClass: 'bg-onboarding-slide4',
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
          <div className={styles.groceryItem} style={{backgroundColor: '#f1c40f'}}></div>
          <div className={styles.groceryItem} style={{backgroundColor: '#2ecc71'}}></div>
          <div className={styles.groceryItem} style={{backgroundColor: '#ff6b6b'}}></div>
        </div>
        <div className={cn(styles.floatingFood, styles.food1, "animate-float")}>🥗</div>
        <div className={cn(styles.floatingFood, styles.food2, "animate-float")} style={{animationDelay: '0.5s'}}>🍎</div>
        <div className={cn(styles.floatingFood, styles.food3, "animate-float")} style={{animationDelay: '1s'}}>🥑</div>
        <div className={cn(styles.floatingFood, styles.food4, "animate-float")} style={{animationDelay: '1.5s'}}>🍇</div>
      </div>
    ),
    headline: "Shop & Eat with Confidence",
    subtext: "Your health guardian, wherever you go. Peace of mind starts with a scan.",
    showLogo: true,
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
    // Apply body styles for this page
    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'pan-y'; // Or 'none' if horizontal swipe is the only desired interaction

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
      carouselRef.current.style.transition = 'none';
    }
  }, []);

  const handleDragMove = useCallback((clientX: number) => {
    if (!isDragging || !carouselRef.current) return;
    const diff = clientX - startX;
    const currentOffset = -currentSlide * window.innerWidth;
    
    let newTranslateX = currentOffset + diff;
    // Add resistance to overscrolling
    if ((currentSlide === 0 && diff > 0) || (currentSlide === totalSlides - 1 && diff < 0)) {
      newTranslateX = currentOffset + diff / 3; // Reduce swipe effect by a factor
    }
    carouselRef.current.style.transform = `translateX(${newTranslateX}px)`;
  }, [isDragging, startX, currentSlide, totalSlides]);

  const handleDragEnd = useCallback(() => {
    if (!isDragging || !carouselRef.current) return;
    setIsDragging(false);
    carouselRef.current.style.transition = 'transform 0.5s ease-in-out';

    const endTranslateX = parseFloat(carouselRef.current.style.transform.replace('translateX(', '').replace('px)', ''));
    const threshold = window.innerWidth / 4; // A quarter of the screen width
    const slideWidth = window.innerWidth;
    const currentOffset = -currentSlide * slideWidth;
    const movedDistance = endTranslateX - currentOffset;

    if (movedDistance < -threshold && currentSlide < totalSlides - 1) {
      setCurrentSlide(prev => prev + 1);
    } else if (movedDistance > threshold && currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    } else {
      // Snap back to the current slide if threshold not met
      carouselRef.current.style.transform = `translateX(${-currentSlide * slideWidth}px)`;
    }
  }, [isDragging, currentSlide, totalSlides]);


  useEffect(() => {
    if (carouselRef.current) {
        // Ensure the carousel transitions to the correct slide
        carouselRef.current.style.transform = `translateX(-${currentSlide * 100}vw)`;
    }
  }, [currentSlide]);

  // Touch event handlers
  const onTouchStart = (e: React.TouchEvent) => handleDragStart(e.touches[0].clientX);
  const onTouchMove = (e: React.TouchEvent) => handleDragMove(e.touches[0].clientX);
  const onTouchEnd = () => handleDragEnd();

  // Mouse event handlers
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
    if (isDragging) {
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
        style={{ width: `${totalSlides * 100}vw` }} // Total width for all slides
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
      >
        {OnboardingSlides.map((slide, index) => (
          <div key={slide.id} className={cn(styles.carouselSlide, styles[slide.id], slide.backgroundClass, `font-['Poppins']`)}>
            {slide.showLogo && (
              <div className="absolute top-6 left-6 z-20">
                <Logo />
              </div>
            )}
            {/* Specific overlays like grid for slide-2 */}
            {slide.id === 'slide-2' && <div className={styles.gridOverlay}></div>}

            <div className={styles.contentContainer}>
              {slide.illustration}
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


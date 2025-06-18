
"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image'; // If you plan to use main_logo.png here
import styles from './Onboarding.module.css'; // Import CSS module
import { cn } from '@/lib/utils';

// Embedded SVG Icons (if any were complex, otherwise simple ones can be JSX)
const WarningIconSvg = () => (
    <svg className="w-6 h-6 sm:w-8 md:w-10 sm:h-8 md:h-10 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M12,20c-4.41,0-8-3.59-8-8 c0-4.41,3.59-8,8-8s8,3.59,8,8C20,16.41,16.41,20,12,20z M11,7h2v6h-2V7z M11,15h2v2h-2V15z"/>
    </svg>
);

const NutritionIconSvg = () => (
    <svg className="w-6 h-6 sm:w-8 md:w-10 sm:h-8 md:h-10 text-green-500" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20,12c0,4.42-3.58,8-8,8s-8-3.58-8-8s3.58-8,8-8S20,7.58,20,12z M8.5,8C7.67,8,7,8.67,7,9.5 S7.67,11,8.5,11S10,10.33,10,9.5S9.33,8,8.5,8z M12,6c-0.83,0-1.5,0.67-1.5,1.5S11.17,9,12,9s1.5-0.67,1.5-1.5S12.83,6,12,6z M15.5,8C14.67,8,14,8.67,14,9.5s0.67,1.5,1.5,1.5S17,10.33,17,9.5S16.33,8,15.5,8z"/>
    </svg>
);

const AllergenWarningIconSvg = () => (
     <svg className="w-6 h-6 sm:w-8 md:w-10 sm:h-8 md:h-10 text-red-500" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M13,17h-2v-2h2V17z M13,13h-2V7h2V13z"/>
    </svg>
);


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
        <div className={styles.saf} style={{ top: '20px', right: '20px' }}>
          <div className={styles.safGlow}></div>
          <div className={styles.safFace}>
            <div className={cn(styles.safEye, styles.left)}></div>
            <div className={cn(styles.safEye, styles.right)}></div>
            <div className={styles.safMouth}></div>
          </div>
        </div>
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
        <div className={styles.saf} style={{ top: '50%', right: '-20px' }}>
          <div className={styles.safGlow}></div>
          <div className={styles.safFace}>
            <div className={cn(styles.safEye, styles.left)}></div>
            <div className={cn(styles.safEye, styles.right)}></div>
            <div className={styles.safMouth}></div>
          </div>
          <div className={cn(styles.scanBeam, "animate-scanBeam")}></div>
        </div>
      </div>
    ),
    headline: "Scan in Seconds. Know Instantly.",
    subtext: "Let AI do the label reading — Safora instantly checks ingredients for your needs.",
    showLogo: true,
  },
  {
    id: 'slide-3',
    backgroundClass: 'bg-white',
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
        <div className={styles.saf} style={{ bottom: '20px', right: '20px' }}>
          <div className={styles.safGlow}></div>
          <div className={styles.safFace}>
            <div className={cn(styles.safEye, styles.left)}></div>
            <div className={cn(styles.safEye, styles.right)}></div>
            <div className={styles.safMouth}></div>
          </div>
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
        <div className={styles.saf} style={{ top: '20px', left: '20px' }}>
          <div className={styles.safGlow}></div>
          <div className={styles.safFace}>
            <div className={cn(styles.safEye, styles.left)}></div>
            <div className={cn(styles.safEye, styles.right)}></div>
            <div className={styles.safMouth}></div>
          </div>
        </div>
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
  const [translateX, setTranslateX] = useState(0);

  const totalSlides = OnboardingSlides.length;

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
    
    // Prevent overscrolling visual glitch
    if ((currentSlide === 0 && diff > 0) || (currentSlide === totalSlides - 1 && diff < 0)) {
         setTranslateX(currentOffset + diff / 3); // Dampen overscroll
    } else {
        setTranslateX(currentOffset + diff);
    }
    carouselRef.current.style.transform = `translateX(${currentOffset + diff}px)`;
  }, [isDragging, startX, currentSlide, totalSlides]);

  const handleDragEnd = useCallback(() => {
    if (!isDragging || !carouselRef.current) return;
    setIsDragging(false);
    carouselRef.current.style.transition = 'transform 0.5s ease-in-out';

    const endTranslateX = parseFloat(carouselRef.current.style.transform.replace('translateX(', '').replace('px)', ''));
    const threshold = window.innerWidth / 4; // Min swipe distance to change slide
    const slideWidth = window.innerWidth;
    const currentOffset = -currentSlide * slideWidth;
    const movedDistance = endTranslateX - currentOffset;

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
        style={{ width: `${totalSlides * 100}vw` }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
      >
        {OnboardingSlides.map((slide, index) => (
          <div key={slide.id} className={cn(styles.carouselSlide, slide.backgroundClass, `font-['Poppins']`)}>
            {slide.showLogo && (
              <div className={styles.logo}>
                <div className={styles.logoIcon}>S</div>
                Safora
              </div>
            )}
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

    
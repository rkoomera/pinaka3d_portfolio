"use client";

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { usePathname } from 'next/navigation';

// Vector2D class for cursor position calculations
class Vec2 {
  x: number;
  y: number;

  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }

  clone() {
    return new Vec2(this.x, this.y);
  }

  sub(v: Vec2) {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  copy(v: Vec2) {
    this.x = v.x;
    this.y = v.y;
    return this;
  }

  lerp(v: Vec2, amount: number) {
    this.x += (v.x - this.x) * amount;
    this.y += (v.y - this.y) * amount;
    return this;
  }
}

export default function Cursor() {
  const cursorRef = useRef<SVGSVGElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const pathname = usePathname(); // Get current pathname for navigation detection
  
  // Cursor state refs to maintain state across renders
  const cursorPositionRef = useRef({
    previous: new Vec2(-100, -100),
    current: new Vec2(-100, -100),
    target: new Vec2(-100, -100),
    lerpAmount: 0.1
  });
  
  const cursorScaleRef = useRef({
    previous: 1,
    current: 1,
    target: 1,
    lerpAmount: 0.1
  });
  
  const hoverStateRef = useRef({
    isHovered: false,
    hoverEl: null as HTMLElement | null
  });
  
  // Check if we're on desktop
  useEffect(() => {
    const checkIfDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    
    // Initial check
    checkIfDesktop();
    
    // Add resize listener
    window.addEventListener('resize', checkIfDesktop);
    
    return () => {
      window.removeEventListener('resize', checkIfDesktop);
    };
  }, []);
  
  // Initialize cursor
  useEffect(() => {
    // Only initialize cursor on desktop
    if (!isDesktop || !cursorRef.current) return;
    
    const cursor = cursorRef.current;
    const position = cursorPositionRef.current;
    const scale = cursorScaleRef.current;
    const hoverState = hoverStateRef.current;
    
    // Update function for animation
    const update = () => {
      position.current.lerp(position.target, position.lerpAmount);
      scale.current = gsap.utils.interpolate(
        scale.current,
        scale.target,
        scale.lerpAmount
      );
      
      const delta = position.current.clone().sub(position.previous);
      
      position.previous.copy(position.current);
      scale.previous = scale.current;
      
      gsap.set(cursor, {
        x: position.current.x,
        y: position.current.y
      });
      
      if (!hoverState.isHovered) {
        const angle = Math.atan2(delta.y, delta.x) * (180 / Math.PI);
        const distance = Math.sqrt(delta.x * delta.x + delta.y * delta.y) * 0.04;
        
        gsap.set(cursor, {
          rotate: angle,
          scaleX: scale.current + Math.min(distance, 1),
          scaleY: scale.current - Math.min(distance, 0.3)
        });
      }
    };
    
    // Update target position based on mouse movement
    const updateTargetPosition = (x: number, y: number) => {
      if (hoverState.isHovered && hoverState.hoverEl) {
        const bounds = hoverState.hoverEl.getBoundingClientRect();
        
        const cx = bounds.x + bounds.width / 2;
        const cy = bounds.y + bounds.height / 2;
        
        const dx = x - cx;
        const dy = y - cy;
        
        position.target.x = cx + dx * 0.8;
        position.target.y = cy + dy * 0.8;
        
        // Calculate scale based on element size
        const elementSize = Math.max(bounds.width, bounds.height);
        const cursorSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--cursor-size'));
        const scaleFactor = (elementSize + 16) / cursorSize;
        
        scale.target = scaleFactor;
        
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        const distance = Math.sqrt(dx * dx + dy * dy) * 0.02;
        
        gsap.set(cursor, { rotate: angle });
        gsap.to(cursor, {
          scaleX: scale.target + Math.pow(Math.min(distance, 0.8), 3) * 5,
          scaleY: scale.target - Math.pow(Math.min(distance, 0.5), 3) * 5,
          duration: 0.5,
          ease: "power4.out",
          overwrite: true,
          force3D: true,
          smoothOrigin: true
        });
      } else {
        position.target.x = x;
        position.target.y = y;
        scale.target = 1;
      }
    };
    
    // Mouse move handler for normal operations
    const onMouseMove = (event: MouseEvent) => {
      const x = event.clientX;
      const y = event.clientY;
      
      updateTargetPosition(x, y);
    };
    
    // Add event listeners for hover elements
    const setupHoverElements = () => {
      // Remove existing listeners
      const existingHoverElements = document.querySelectorAll<HTMLElement>("[data-hover]");
      existingHoverElements.forEach((el) => {
        el.removeEventListener("pointerover", () => {});
        el.removeEventListener("pointerout", () => {});
        el.removeEventListener("pointermove", () => {});
      });
      
      // Set up hover elements
      const hoverElements = document.querySelectorAll<HTMLElement>("[data-hover]");
      
      hoverElements.forEach((hoverElement) => {
        // Get bounds element
        const hoverBoundsEl = hoverElement.querySelector<HTMLElement>("[data-hover-bounds]");
        
        if (hoverBoundsEl) {
          // Hover handlers
          const handlePointerOver = () => {
            hoverState.isHovered = true;
            hoverState.hoverEl = hoverElement;
          };
          
          const handlePointerOut = () => {
            hoverState.isHovered = false;
            hoverState.hoverEl = null;
          };
          
          hoverElement.addEventListener("pointerover", handlePointerOver);
          hoverElement.addEventListener("pointerout", handlePointerOut);
          
          // Magnetic effect
          const xTo = gsap.quickTo(hoverElement, "x", {
            duration: 1,
            ease: "elastic.out(1, 0.3)"
          });
          
          const yTo = gsap.quickTo(hoverElement, "y", {
            duration: 1,
            ease: "elastic.out(1, 0.3)"
          });
          
          const handlePointerMove = (event: PointerEvent) => {
            const { clientX: cx, clientY: cy } = event;
            const { height, width, left, top } = hoverElement.getBoundingClientRect();
            const x = cx - (left + width / 2);
            const y = cy - (top + height / 2);
            xTo(x * 0.8);
            yTo(y * 0.8);
          };
          
          hoverElement.addEventListener("pointermove", handlePointerMove);
          
          // Store handlers for cleanup
          (hoverElement as any)._cursorHandlers = {
            pointerOver: handlePointerOver,
            pointerOut: handlePointerOut,
            pointerMove: handlePointerMove
          };
          
          // Reset position on pointer out
          hoverElement.addEventListener("pointerout", () => {
            xTo(0);
            yTo(0);
          });
        }
      });
    };
    
    // Initialize
    setupHoverElements();
    
    // MutationObserver to detect DOM changes
    const observer = new MutationObserver((mutations) => {
      const shouldReinitialize = mutations.some(mutation => 
        mutation.type === 'childList' || 
        mutation.type === 'attributes' && mutation.attributeName === 'data-hover'
      );
      
      if (shouldReinitialize) {
        setupHoverElements();
      }
    });
    
    // Observe the document
    observer.observe(document.body, { 
      childList: true, 
      subtree: true,
      attributes: true,
      attributeFilter: ['data-hover']
    });
    
    // Event listeners
    gsap.ticker.add(update);
    window.addEventListener("pointermove", onMouseMove);
    
    // Cleanup
    return () => {
      gsap.ticker.remove(update);
      window.removeEventListener("pointermove", onMouseMove);
      observer.disconnect();
      
      // Clean up hover element listeners
      const hoverElements = document.querySelectorAll<HTMLElement>("[data-hover]");
      hoverElements.forEach((el) => {
        const handlers = (el as any)._cursorHandlers;
        if (handlers) {
          el.removeEventListener("pointerover", handlers.pointerOver);
          el.removeEventListener("pointerout", handlers.pointerOut);
          el.removeEventListener("pointermove", handlers.pointerMove);
        }
      });
    };
  }, [isDesktop, pathname]); // Re-initialize on these changes
  
  // Don't render on mobile
  if (!isDesktop) return null;
  
  return (
    <svg 
      ref={cursorRef}
      className="cursor" 
      width="40" 
      height="40" 
      viewBox="0 0 40 40" 
      aria-hidden="true"
      style={{
        width: 'var(--cursor-size)',
        height: 'var(--cursor-size)',
      }}
    >
      <circle 
        cx="20" 
        cy="20" 
        r="19"
        fill="rgba(var(--cursor-color), 1)"
      />
    </svg>
  );
} 
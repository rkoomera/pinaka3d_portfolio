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
  const cursorRef = useRef<HTMLDivElement>(null);
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
      
      // Apply transforms directly to the div
      if (cursor) {
        // Position cursor with subpixel accuracy
        gsap.set(cursor, {
          x: position.current.x,
          y: position.current.y
        });
        
        if (!hoverState.isHovered) {
          const angle = Math.atan2(delta.y, delta.x) * (180 / Math.PI);
          const distance = Math.sqrt(delta.x * delta.x + delta.y * delta.y) * 0.04;
          
          // Apply rotation and scaling for motion effect
          gsap.set(cursor, {
            rotate: angle,
            scaleX: scale.current + Math.min(distance, 1),
            scaleY: scale.current - Math.min(distance, 0.3),
            transformOrigin: "center center"
          });
        }
      }
    };
    
    // Update target position based on mouse movement
    const updateTargetPosition = (x: number, y: number) => {
      if (hoverState.isHovered && hoverState.hoverEl) {
        const bounds = hoverState.hoverEl.getBoundingClientRect();
        
        // Get the center of the hovered element
        const cx = bounds.x + bounds.width / 2;
        const cy = bounds.y + bounds.height / 2;
        
        // Calculate distance from mouse to center
        const dx = x - cx;
        const dy = y - cy;
        
        // More magnetic effect - stronger pull to center
        // Only apply 50% of the mouse offset from center
        position.target.x = cx + dx * 0.5;
        position.target.y = cy + dy * 0.5;
        
        // Calculate scale based on element size, but ensure minimum size
        const elementSize = Math.max(bounds.width, bounds.height);
        const cursorSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--cursor-size'));
        // Ensure the cursor is at least as large as the element with padding
        const padding = 10; // 10px extra padding 
        const scaleFactor = Math.max((elementSize + padding) / cursorSize, 1.2);
        
        scale.target = scaleFactor;
        
        // Apply distortion effect but cap it for better appearance
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        const distance = Math.sqrt(dx * dx + dy * dy) * 0.02;
        
        gsap.set(cursor, { rotate: angle });
        gsap.to(cursor, {
          scaleX: scale.target + Math.min(Math.pow(distance * 0.8, 2), 0.5),
          scaleY: scale.target - Math.min(Math.pow(distance * 0.5, 2), 0.3),
          duration: 0.5,
          ease: "power4.out",
          overwrite: true
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
    <>
      {/* Using a simple div with blur for anti-aliasing */}
      <div 
        ref={cursorRef} 
        className="cursor"
        style={{
          position: 'fixed',
          left: '0',
          top: '0',
          width: 'var(--cursor-size)',
          height: 'var(--cursor-size)',
          transform: 'translate(-50%, -50%)',
          backgroundColor: `rgba(var(--cursor-color), 1)`,
          borderRadius: '50%',
          mixBlendMode: 'difference',
          pointerEvents: 'none',
          zIndex: 9999,
          willChange: 'transform',
          boxShadow: '0 0 0 1px rgba(var(--cursor-color), 0.2)'
        }}
        aria-hidden="true"
      ></div>
    </>
  );
} 
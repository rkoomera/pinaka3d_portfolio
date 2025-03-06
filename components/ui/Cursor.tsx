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
  
  useEffect(() => {
    // Only initialize cursor on desktop
    if (!isDesktop || !cursorRef.current) return;
    
    const cursor = cursorRef.current;
    
    // Initialize cursor position state
    const position = {
      previous: new Vec2(-100, -100),
      current: new Vec2(-100, -100),
      target: new Vec2(-100, -100),
      lerpAmount: 0.1
    };
    
    // Initialize cursor scale state
    const scale = {
      previous: 1,
      current: 1,
      target: 1,
      lerpAmount: 0.1
    };
    
    // Hover state
    let isHovered = false;
    let hoverEl: HTMLElement | null = null;
    
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
      
      if (!isHovered) {
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
      if (isHovered && hoverEl) {
        const bounds = hoverEl.getBoundingClientRect();
        
        const cx = bounds.x + bounds.width / 2;
        const cy = bounds.y + bounds.height / 2;
        
        const dx = x - cx;
        const dy = y - cy;
        
        position.target.x = cx + dx * 0.8;
        position.target.y = cy + dy * 0.8;
        
        // Calculate scale based on element size
        // Get the larger dimension (width or height) and add a small padding
        const elementSize = Math.max(bounds.width, bounds.height);
        const cursorSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--cursor-size'));
        const scaleFactor = (elementSize + 16) / cursorSize; // Add 16px padding (8px on each side)
        
        scale.target = scaleFactor;
        
        const angle = Math.atan2(dy, dx) * (180 / Math.PI);
        const distance = Math.sqrt(dx * dx + dy * dy) * 0.02;
        
        gsap.set(cursor, { rotate: angle });
        gsap.to(cursor, {
          scaleX: scale.target + Math.pow(Math.min(distance, 0.8), 3) * 5,
          scaleY: scale.target - Math.pow(Math.min(distance, 0.5), 3) * 5,
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
    
    // Add event listeners for hover elements
    const setupHoverElements = () => {
      // First, remove any existing event listeners to prevent duplicates
      const existingHoverElements = document.querySelectorAll<HTMLElement>("[data-hover]");
      existingHoverElements.forEach((el) => {
        el.removeEventListener("pointerover", () => {});
        el.removeEventListener("pointerout", () => {});
        el.removeEventListener("pointermove", () => {});
      });
      
      // Now set up the hover elements
      const hoverElements = document.querySelectorAll<HTMLElement>("[data-hover]");
      console.log(`Setting up ${hoverElements.length} hover elements`);
      
      hoverElements.forEach((hoverElement) => {
        // Set hover states
        const hoverBoundsEl = hoverElement.querySelector<HTMLElement>("[data-hover-bounds]");
        if (hoverBoundsEl) {
          // Use the parent element for hover detection
          const handlePointerOver = () => {
            isHovered = true;
            hoverEl = hoverElement;
          };
          
          const handlePointerOut = () => {
            isHovered = false;
            hoverEl = null;
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
          
          // Store the event handlers on the element for cleanup
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
    
    // Mouse move handler
    const onMouseMove = (event: MouseEvent) => {
      const x = event.clientX;
      const y = event.clientY;
      
      updateTargetPosition(x, y);
    };
    
    // Initialize
    setupHoverElements();
    
    // Set up a MutationObserver to detect DOM changes
    const observer = new MutationObserver((mutations) => {
      // Check if any mutations added or removed nodes
      const shouldReinitialize = mutations.some(mutation => 
        mutation.type === 'childList' || 
        mutation.type === 'attributes' && mutation.attributeName === 'data-hover'
      );
      
      if (shouldReinitialize) {
        setupHoverElements();
      }
    });
    
    // Start observing the document with the configured parameters
    observer.observe(document.body, { 
      childList: true, 
      subtree: true,
      attributes: true,
      attributeFilter: ['data-hover']
    });
    
    // Add event listeners
    gsap.ticker.add(update);
    window.addEventListener("pointermove", onMouseMove);
    
    // Cleanup
    return () => {
      gsap.ticker.remove(update);
      window.removeEventListener("pointermove", onMouseMove);
      observer.disconnect();
      
      // Clean up event listeners
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
  }, [isDesktop, pathname]); // Re-initialize when desktop status changes or pathname changes
  
  // Don't render the cursor on mobile
  if (!isDesktop) return null;
  
  return (
    <div ref={cursorRef} className="cursor" aria-hidden="true"></div>
  );
} 
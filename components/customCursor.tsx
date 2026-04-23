"use client";

import { useState, useEffect } from "react";

export default function Cursor() {
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // STEP 1: Wait for the component to safely mount
  useEffect(() => {
    setIsMounted(true);
    setIsMobile(window.matchMedia("(hover: none)").matches || window.matchMedia("(pointer: coarse)").matches);
  }, []);

  // STEP 2: Only run the mouse tracking AFTER it mounts
  useEffect(() => {
    if (!isMounted || isMobile) return;

    const ring = document.getElementById("vreya-cursor-ring");
    const dot = document.getElementById("vreya-cursor-dot");
    
    if (!ring || !dot) return;

    let mouseX = 0, mouseY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      ring.style.transform = `translate(${mouseX - 15}px, ${mouseY - 15}px)`;
      dot.style.transform = `translate(${mouseX - 2.5}px, ${mouseY - 2.5}px)`;
      ring.style.opacity = "1";
      dot.style.opacity = "1";
    };

    const onMouseLeave = () => {
      ring.style.opacity = "0";
      dot.style.opacity = "0";
    };

    const onMouseEnter = () => {
      ring.style.opacity = "1";
      dot.style.opacity = "1";
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [data-hover]")) {
        ring.style.width = "52px";
        ring.style.height = "52px";
      } else {
        ring.style.width = "30px";
        ring.style.height = "30px";
      }
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);
    document.addEventListener("mouseover", onMouseOver);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      document.removeEventListener("mouseover", onMouseOver);
    };
  }, [isMounted, isMobile]); 

  if (!isMounted || isMobile) return null;

  return (
    <>
      <div id="vreya-cursor-ring" className="hidden md:block fixed pointer-events-none z-[9999] w-[30px] h-[30px] border border-brand-ink rounded-full transition-[width,height] duration-200 ease-out" />
      <div id="vreya-cursor-dot" className="hidden md:block fixed pointer-events-none z-[9999] w-[5px] h-[5px] bg-brand-ink rounded-full" />
    </>
  );
}
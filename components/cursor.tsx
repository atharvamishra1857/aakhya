"use client";

import { useState, useEffect } from "react";

export default function Cursor() {
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // 1. Tell React the component has safely mounted in the browser
    setIsMounted(true);

    // 2. Check if it's a touch device
    const checkMobile = window.matchMedia("(hover: none)").matches || window.matchMedia("(pointer: coarse)").matches;
    setIsMobile(checkMobile);

    // 3. If it's mobile, kill the script so it doesn't run
    if (checkMobile) return;

    // 4. Safely grab the elements now that they exist
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

    // Cleanup event listeners when component unmounts
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      document.removeEventListener("mouseover", onMouseOver);
    };
  }, []);

  // If the component hasn't mounted yet, OR if it's a mobile device, render NOTHING.
  // This completely solves the Hydration Mismatch!
  if (!isMounted || isMobile) return null;

  return (
    <>
      <div id="vreya-cursor-ring" className="hidden md:block" />
      <div id="vreya-cursor-dot" className="hidden md:block" />
    </>
  );
}
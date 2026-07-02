// @ts-nocheck
import React, { useEffect, useRef } from 'react';

export const TearingBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Create the brutalist Red/Black diagonal stripe pattern
    const patternCanvas = document.createElement('canvas');
    patternCanvas.width = 32;
    patternCanvas.height = 32;
    const pCtx = patternCanvas.getContext('2d');
    if (pCtx) {
      pCtx.fillStyle = '#0a0a0a'; // Black
      pCtx.fillRect(0, 0, 32, 32);
      
      pCtx.strokeStyle = '#d90429'; // Brutalist Red
      pCtx.lineWidth = 16;
      pCtx.beginPath();
      pCtx.moveTo(-16, 16); pCtx.lineTo(48, -48);
      pCtx.moveTo(-16, 48); pCtx.lineTo(48, -16);
      pCtx.moveTo(-16, 80); pCtx.lineTo(48, 16);
      pCtx.stroke();
    }
    const stripePattern = ctx.createPattern(patternCanvas, 'repeat');

    let mouseX = -100;
    let mouseY = -100;
    let targetRect: DOMRect | null = null;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Detect if we are hovering over an interactive element or brutalist box
      const target = e.target as HTMLElement;
      
      // Look up the DOM tree for a button, link, or a brutalist-border container
      const interactiveEl = target.closest('a, button, .brutalist-border, h1, h2, h3');
      if (interactiveEl) {
        targetRect = interactiveEl.getBoundingClientRect();
      } else {
        targetRect = null;
      }
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    let animationFrameId: number;

    const render = () => {
      // Fade out previous frames (Fading Trail effect)
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, width, height);

      // Draw the new trail / outline
      ctx.globalCompositeOperation = 'source-over';
      if (stripePattern) {
        ctx.fillStyle = stripePattern;
        ctx.strokeStyle = stripePattern;
      } else {
        ctx.fillStyle = '#d90429';
        ctx.strokeStyle = '#d90429';
      }

      if (targetRect) {
        // Outline the hovered element
        ctx.lineWidth = 6;
        ctx.strokeRect(
          targetRect.left - 4, 
          targetRect.top - 4, 
          targetRect.width + 8, 
          targetRect.height + 8
        );
      } else {
        // Normal mouse trail
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, 12, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 opacity-90 mix-blend-difference dark:mix-blend-screen"
      style={{ top: 0, left: 0 }}
    />
  );
};

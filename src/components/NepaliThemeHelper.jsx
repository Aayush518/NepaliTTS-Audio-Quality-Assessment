import React, { useEffect } from 'react';

export function useDynamicSVGColors() {
  useEffect(() => {
    // Fix all SVG colors to match Nepali theme - expanded color list
    const blueColors = [
      "#4361ee", "#003893", "#87ceeb", "#747bff", "#646cff", 
      "#0000ff", "#0000cd", "#00008b", "#000080", "#191970",
      "#4169e1", "#6495ed", "#1e90ff", "#00bfff", "#87cefa", 
      "#add8e6", "#b0c4de", "#5f9ea0", "#4682b4", "#0070bb"
    ];
    
    // Also include black which is often used for icons
    blueColors.push("#000000", "#000", "black");
    
    blueColors.forEach(blueColor => {
      const svgs = document.querySelectorAll(`svg[fill="${blueColor}"]`);
      const nepaliRed = getComputedStyle(document.documentElement).getPropertyValue('--nepali-red').trim() || '#c8102e';
      
      svgs.forEach(svg => {
        svg.setAttribute('fill', nepaliRed);
      });
      
      // Also handle path fills
      document.querySelectorAll(`path[fill="${blueColor}"]`).forEach(path => {
        path.setAttribute('fill', nepaliRed);
      });

      // Fix SVG stroke colors
      document.querySelectorAll(`svg[stroke="${blueColor}"], path[stroke="${blueColor}"], line[stroke="${blueColor}"], circle[stroke="${blueColor}"]`).forEach(element => {
        element.setAttribute('stroke', nepaliRed);
      });
    });
    
    // Additional fix for specific icons
    const iconImages = document.querySelectorAll('.step-icon img');
    iconImages.forEach(icon => {
      // Apply style to directly override the fill color
      icon.style.filter = "brightness(0) saturate(100%) invert(16%) sepia(91%) saturate(4062%) hue-rotate(343deg) brightness(95%) contrast(96%)";
    });
    
    // Fix sample titles and other text elements that might still be blue
    document.querySelectorAll('.sample-title, .audio-comparison-section h4').forEach(element => {
      element.style.color = 'var(--nepali-red)';
    });
    
    // Additional fix for any buttons that might have blue text on red background
    document.querySelectorAll('.nav-cta, .cta-button, .btn-primary, button[type="submit"]').forEach(btn => {
      if (window.getComputedStyle(btn).backgroundColor.includes('rgb(200, 16, 46)') || 
          window.getComputedStyle(btn).backgroundColor.includes('#c8102e')) {
        btn.style.color = 'white';
      }
    });
  }, []);

  return null;
}

export default function NepaliThemeHelper() {
  useDynamicSVGColors();
  return null;
}

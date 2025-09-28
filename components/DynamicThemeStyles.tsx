import React, { useEffect } from 'react';
import { Theme } from '../types';

interface DynamicThemeStylesProps {
  theme: Theme;
}

const DynamicThemeStyles: React.FC<DynamicThemeStylesProps> = ({ theme }) => {
  useEffect(() => {
    // Inject or update the font link
    const fontId = 'dynamic-google-font';
    let fontLink = document.getElementById(fontId) as HTMLLinkElement;
    if (!fontLink) {
      fontLink = document.createElement('link');
      fontLink.id = fontId;
      fontLink.rel = 'stylesheet';
      document.head.appendChild(fontLink);
    }
    fontLink.href = theme.styles['--font-url'];

    // Apply CSS variables to the root element
    const root = document.documentElement;
    Object.entries(theme.styles).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

  }, [theme]);

  return null; // This component doesn't render anything itself
};

export default DynamicThemeStyles;
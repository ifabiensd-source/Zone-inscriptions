import React from 'react';

const KBanLogo: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 95 28" // Adjusted viewbox for better aspect ratio
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <text 
      x="50%" // Center horizontally
      y="22" 
      textAnchor="middle" // Anchor point is middle of text
      fill="currentColor" 
      style={{ 
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif', 
        fontSize: '26px', 
        fontWeight: 700,
        letterSpacing: '0.02em'
      }}
    >
      K-BAN
    </text>
  </svg>
);

export default KBanLogo;

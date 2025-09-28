import React from 'react';

interface PaintBrushIconProps extends React.SVGProps<SVGSVGElement> {}

const PaintBrushIcon: React.FC<PaintBrushIconProps> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor"
    {...props}
  >
    <path d="M18.36,2.64a3,3,0,0,0-4.24,0l-1,1L12,5.56l-1-1a3,3,0,0,0-4.24,0l-2.48,2.48a3,3,0,0,0,0,4.24l1,1,1.17,1.17a2,2,0,0,0,2.83,0L11.56,13l-1-1a1,1,0,0,1,0-1.41l.7-.71a1,1,0,0,1,1.42,0l3.53,3.53a1,1,0,0,1,0,1.42l-.7.7a1,1,0,0,1-1.41,0l-1-1-1.42,1.42,1.17,1.17,1,1a3,3,0,0,0,4.24,0l2.48-2.48a3,3,0,0,0,0-4.24Z"/>
    <path d="M4.64,12.64l-1-1A3,3,0,0,0,2.22,15.8l6.36,6.37a3,3,0,0,0,4.24-1.42l-7.2-7.11Z"/>
  </svg>
);

export default PaintBrushIcon;
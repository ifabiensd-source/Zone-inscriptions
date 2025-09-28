import React from 'react';

interface PencilIconProps extends React.SVGProps<SVGSVGElement> {}

const PencilIcon: React.FC<PencilIconProps> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
    <path d="M15 5l4 4"></path>
  </svg>
);

export default PencilIcon;


import React from 'react';

interface ShieldCheckIconProps extends React.SVGProps<SVGSVGElement> {}

const ShieldCheckIcon: React.FC<ShieldCheckIconProps> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor"
    {...props}
    >
    <path fillRule="evenodd" d="M12.001 2.25c-5.186 0-9.449 3.916-9.75 8.855-.223 3.653.498 7.337 2.247 10.537a.75.75 0 001.27-.611V16.5a.75.75 0 01.75-.75h11.012a.75.75 0 01.75.75v4.531a.75.75 0 001.27.611c1.749-3.199 2.47-6.884 2.247-10.537-.3-4.939-4.565-8.855-9.751-8.855zm4.864 7.61a.75.75 0 00-1.06 0l-4.5 4.5a.75.75 0 01-1.06 0l-2.25-2.25a.75.75 0 10-1.062 1.06l2.75 2.75a.75.75 0 001.06 0l5-5a.75.75 0 000-1.06z" clipRule="evenodd" />
</svg>
);

export default ShieldCheckIcon;

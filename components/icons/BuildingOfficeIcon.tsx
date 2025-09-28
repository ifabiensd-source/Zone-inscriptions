import React from 'react';

interface BuildingOfficeIconProps extends React.SVGProps<SVGSVGElement> {}

const BuildingOfficeIcon: React.FC<BuildingOfficeIconProps> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 20 20" 
    fill="currentColor" 
    {...props}>
    <path fillRule="evenodd" d="M1.75 4.5a.75.75 0 01.75-.75h1.5a.75.75 0 01.75.75v10.5a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75V4.5zM6 3.75A.75.75 0 016.75 3h6.5a.75.75 0 01.75.75v12.5a.75.75 0 01-.75.75h-6.5a.75.75 0 01-.75-.75V3.75zM15.25 15a.75.75 0 00.75-.75V5.25a.75.75 0 00-.75-.75h-1.5a.75.75 0 00-.75.75v9.75a.75.75 0 00.75.75h1.5z" clipRule="evenodd" />
    <path d="M9.75 5.5a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0V5.5zM9.75 9a.75.75 0 00-1.5 0v1.5a.75.75 0 001.5 0V9zM11.25 5.5a.75.75 0 011.5 0v1.5a.75.75 0 01-1.5 0V5.5zM11.25 9a.75.75 0 011.5 0v1.5a.75.75 0 01-1.5 0V9z" />
  </svg>
);

export default BuildingOfficeIcon;

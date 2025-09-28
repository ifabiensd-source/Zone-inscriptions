import React from 'react';

interface ExclamationCircleIconProps extends React.SVGProps<SVGSVGElement> {}

const ExclamationCircleIcon: React.FC<ExclamationCircleIconProps> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    {...props}>
    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.25-3.75a.75.75 0 011.5 0v3.75a.75.75 0 01-1.5 0V8.25zM12 16.5a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
  </svg>
);

export default ExclamationCircleIcon;

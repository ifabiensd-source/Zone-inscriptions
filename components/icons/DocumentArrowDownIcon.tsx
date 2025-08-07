
import React from 'react';

interface DocumentArrowDownIconProps extends React.SVGProps<SVGSVGElement> {}

const DocumentArrowDownIcon: React.FC<DocumentArrowDownIconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a.375.375 0 01-.375-.375V6.75A3.75 3.75 0 0010.5 3h-4.875C5.625 3 5.625 1.5 5.625 1.5zM12 9.75a.75.75 0 00-1.5 0v4.19l-1.72-1.72a.75.75 0 00-1.06 1.06l3 3a.75.75 0 001.06 0l3-3a.75.75 0 10-1.06-1.06l-1.72 1.72V9.75z" clipRule="evenodd" />
    <path d="M14.25 9h1.875a2.25 2.25 0 012.25 2.25v.375a.75.75 0 001.5 0V11.25a3.75 3.75 0 00-3.75-3.75h-1.875a.75.75 0 000 1.5z" />
  </svg>
);

export default DocumentArrowDownIcon;

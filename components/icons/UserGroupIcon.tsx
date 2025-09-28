import React from 'react';

interface UserGroupIconProps extends React.SVGProps<SVGSVGElement> {}

const UserGroupIcon: React.FC<UserGroupIconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.117a.75.75 0 01-.748.658H2.25a.75.75 0 01-.748-.658l-.001-.117v-.003zM12.75 19.125a7.125 7.125 0 0114.25 0v.003l-.001.117a.75.75 0 01-.748.658H13.5a.75.75 0 01-.748-.658l-.001-.117v-.003z" />
  </svg>
);

export default UserGroupIcon;

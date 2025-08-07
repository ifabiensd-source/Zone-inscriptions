import React from 'react';

interface CalendarDaysIconProps extends React.SVGProps<SVGSVGElement> {}

const CalendarDaysIcon: React.FC<CalendarDaysIconProps> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}>
    <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6v-1.5a.75.75 0 01.75-.75zM12 11.25a.75.75 0 01.75.75v.008h.008a.75.75 0 010 1.5H12a.75.75 0 01-.75-.75v-1.5a.75.75 0 01.75-.75zm-3.75.75a.75.75 0 000 1.5h.008a.75.75 0 000-1.5H8.25zm-1.5-1.5A.75.75 0 017.5 9h.008a.75.75 0 010 1.5H7.5a.75.75 0 01-.75-.75v-3a.75.75 0 01.75-.75h3a.75.75 0 01.75.75v.008a.75.75 0 01-1.5 0V7.5H8.25v1.5a.75.75 0 00.75.75h.75a.75.75 0 00.75-.75V8.25a.75.75 0 00-.75-.75H7.5v-.008A.75.75 0 006.75 6.75v3.75zM12 6.75a.75.75 0 01.75.75v.008a.75.75 0 01-1.5 0V7.5a.75.75 0 01.75-.75zm3.75.75a.75.75 0 000 1.5h.008a.75.75 0 000-1.5H15.75zM12 15.75a.75.75 0 01.75.75v.008a.75.75 0 01-1.5 0v-.008a.75.75 0 01.75-.75zm3.75.75a.75.75 0 000 1.5h.008a.75.75 0 000-1.5H15.75zM15 9.75a.75.75 0 01.75.75v.008a.75.75 0 01-1.5 0v-.008A.75.75 0 0115 9.75z" clipRule="evenodd" />
  </svg>
);

export default CalendarDaysIcon;
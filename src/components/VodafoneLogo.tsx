import * as React from "react";

export const VodafoneLogo: React.FC<{className?: string}> = ({ className }) => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="24" cy="24" r="24" fill="#E60000"/>
    <path d="M32.5 24.5C32.5 29.1944 28.6944 33 24 33C19.3056 33 15.5 29.1944 15.5 24.5C15.5 19.8056 19.3056 16 24 16C26.4853 16 28.5 18.0147 28.5 20.5C28.5 22.9853 26.4853 25 24 25C22.6193 25 21.5 23.8807 21.5 22.5C21.5 21.1193 22.6193 20 24 20" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

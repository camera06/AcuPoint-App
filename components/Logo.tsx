import React from 'react';

export const Logo = ({ className = "w-8 h-8" }: { className?: string }) => {
  return (
    <img 
      src="/assets/logo.png" 
      alt="AcuPoint Logo" 
      className={className}
      referrerPolicy="no-referrer"
    />
  );
};

export default Logo;
import React from 'react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center gap-1">
      <div className="h-8 w-8 rounded bg-trading-accent flex items-center justify-center">
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="text-white"
        >
          <path 
            d="M3 9L12 5L21 9M3 9V15L12 19M3 9L7.5 7M21 9V15L12 19M21 9L16.5 7M12 19V13M7.5 7L12 5.5L16.5 7M7.5 7L12 9L16.5 7" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <span className="text-white text-xl font-semibold tracking-tight">Capital</span>
    </div>
  );
};

export default Logo;